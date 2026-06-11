export const dynamic = "force-dynamic";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getUserProfile, getUserRepos, getUserEvents, getContributions } from "@/lib/github";
import { NextResponse } from "next/server";

function calcStreak(weeks: any[]) {
  const days = weeks.flatMap((w: any) => w.contributionDays).reverse();
  let current = 0, longest = 0, temp = 0, foundGap = false;
  for (const day of days) {
    if (day.contributionCount > 0) {
      temp++;
      if (!foundGap) current = temp;
      longest = Math.max(longest, temp);
    } else {
      if (!foundGap) foundGap = true;
      temp = 0;
    }
  }
  return { current, longest };
}

function calcScore(data: any): { score: number; grade: string; breakdown: Record<string, number> } {
  const breakdown = {
    repos:         Math.min((data.totalRepos || 0) * 2, 20),
    stars:         Math.min((data.totalStars || 0) * 3, 25),
    contributions: Math.min(Math.floor((data.contributions?.totalContributions || 0) / 10), 25),
    streak:        Math.min((data.streak?.current || 0) * 2, 15),
    longestStreak: Math.min((data.streak?.longest || 0), 10),
    followers:     Math.min((data.profile?.followers || 0), 5),
  };
  const score = Math.min(Object.values(breakdown).reduce((a, b) => a + b, 0), 100);
  const grade = score >= 90 ? "S" : score >= 75 ? "A" : score >= 60 ? "B" : score >= 40 ? "C" : "D";
  return { score, grade, breakdown };
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const userId = (session.user as any).id;
    if (!userId) return NextResponse.json({ error: "No user ID in session" }, { status: 400 });

    const account = await prisma.account.findFirst({ where: { userId, provider: "github" } });
    if (!account) return NextResponse.json({ error: "No GitHub account linked" }, { status: 400 });

    const token = account.access_token ?? undefined;

    // Get or fetch username
    const dbUser = await prisma.user.findUnique({ where: { id: userId } });
    let username = dbUser?.githubUsername;

    if (!username && token) {
      const me = await fetch("https://api.github.com/user", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (me.ok) {
        const meData = await me.json();
        username = meData.login;
        await prisma.user.update({ where: { id: userId }, data: { githubUsername: username } });
      }
    }

    // Fallback: derive username from providerAccountId (GitHub user ID won't work) or email
    if (!username) {
      // Try fetching with no token using providerAccountId as a last resort via public API
      const providerRes = await fetch(`https://api.github.com/user/${account.providerAccountId}`);
      if (providerRes.ok) {
        const providerData = await providerRes.json();
        username = providerData.login;
        if (username) {
          await prisma.user.update({ where: { id: userId }, data: { githubUsername: username } });
        }
      }
    }

    if (!username) return NextResponse.json({ error: "Could not determine GitHub username" }, { status: 400 });

    // Fetch all data in parallel
    const [profile, repos, events, contributions] = await Promise.all([
      getUserProfile(username, token),
      getUserRepos(username, token),
      getUserEvents(username, token).catch(() => []),
      token ? getContributions(username, token).catch(() => null) : Promise.resolve(null),
    ]);

    // Language stats
    const langMap: Record<string, number> = {};
    for (const repo of repos as any[]) {
      if (repo.language) langMap[repo.language] = (langMap[repo.language] || 0) + 1;
    }
    const languages = Object.entries(langMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([name, count]) => ({ name, count }));

    // Recent commits
    const commits = (events as any[])
      .filter((e) => e.type === "PushEvent")
      .slice(0, 15)
      .flatMap((e) =>
        (e.payload?.commits || []).slice(0, 3).map((c: any) => ({
          message: c.message?.split("\n")[0] || "No message",
          repo: e.repo.name,
          date: e.created_at,
          sha: c.sha?.slice(0, 7),
          repoUrl: `https://github.com/${e.repo.name}`,
        }))
      )
      .slice(0, 12);

    // PRs from events
    const prs = (events as any[])
      .filter((e) => e.type === "PullRequestEvent")
      .slice(0, 8)
      .map((e) => ({
        title: e.payload?.pull_request?.title || "PR",
        repo: e.repo.name,
        state: e.payload?.action === "closed" && e.payload?.pull_request?.merged ? "merged" :
               e.payload?.action === "closed" ? "closed" : "open",
        date: e.created_at,
        url: e.payload?.pull_request?.html_url,
        number: e.payload?.pull_request?.number,
      }));

    // Top repos
    const topRepos = [...(repos as any[])]
      .sort((a, b) => b.stargazers_count - a.stargazers_count)
      .slice(0, 6)
      .map((r) => ({
        name: r.name,
        description: r.description,
        stars: r.stargazers_count,
        forks: r.forks_count,
        language: r.language,
        url: r.html_url,
        updatedAt: r.updated_at,
        isPrivate: r.private,
        topics: r.topics?.slice(0, 3) || [],
      }));

    // Streak
    const streak = contributions ? calcStreak(contributions.weeks) : { current: 0, longest: 0 };

    // Activity by day and hour
    const activityByDay = [0, 0, 0, 0, 0, 0, 0];
    const activityByHour = Array(24).fill(0);
    for (const e of events as any[]) {
      const d = new Date(e.created_at);
      activityByDay[d.getDay()]++;
      activityByHour[d.getHours()]++;
    }

    const result = {
      profile, topRepos, languages, commits, prs, contributions, streak,
      activityByDay, activityByHour,
      totalRepos: (repos as any[]).length,
      totalStars: (repos as any[]).reduce((acc, r) => acc + r.stargazers_count, 0),
      totalForks: (repos as any[]).reduce((acc, r) => acc + r.forks_count, 0),
    };
    const scoreData = calcScore(result);
    return NextResponse.json({ ...result, ...scoreData });
  } catch (err: any) {
    console.error("GitHub API Error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
