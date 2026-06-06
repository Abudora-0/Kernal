import { getUserProfile, getUserRepos, getUserEvents, getContributions } from "@/lib/github";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

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
  const repos = data.totalRepos || 0;
  const stars = data.totalStars || 0;
  const contributions = data.contributions?.totalContributions || 0;
  const streak = data.streak?.current || 0;
  const longestStreak = data.streak?.longest || 0;
  const followers = data.profile?.followers || 0;

  const breakdown = {
    repos:         Math.min(repos * 2, 20),
    stars:         Math.min(stars * 3, 25),
    contributions: Math.min(Math.floor(contributions / 10), 25),
    streak:        Math.min(streak * 2, 15),
    longestStreak: Math.min(longestStreak, 10),
    followers:     Math.min(followers, 5),
  };

  const score = Math.min(Object.values(breakdown).reduce((a, b) => a + b, 0), 100);
  const grade = score >= 90 ? "S" : score >= 75 ? "A" : score >= 60 ? "B" : score >= 40 ? "C" : "D";
  return { score, grade, breakdown };
}

export async function GET(req: Request, { params }: { params: { username: string } }) {
  try {
    const { username } = params;
    if (!username) return NextResponse.json({ error: "Username required" }, { status: 400 });

    // Try to get auth token for GraphQL contributions
    const session = await getServerSession(authOptions);
    let token: string | undefined;
    if (session?.user) {
      const userId = (session.user as any).id;
      const account = await prisma.account.findFirst({ where: { userId, provider: "github" } });
      token = account?.access_token ?? undefined;
    }

    const [profile, repos, events, contributions] = await Promise.all([
      getUserProfile(username, token),
      getUserRepos(username, token),
      getUserEvents(username, token).catch(() => []),
      token ? getContributions(username, token).catch(() => null) : Promise.resolve(null),
    ]);

    const langMap: Record<string, number> = {};
    for (const repo of repos as any[]) {
      if (repo.language) langMap[repo.language] = (langMap[repo.language] || 0) + 1;
    }
    const languages = Object.entries(langMap)
      .sort((a, b) => b[1] - a[1]).slice(0, 6)
      .map(([name, count]) => ({ name, count }));

    const commits = (events as any[])
      .filter((e) => e.type === "PushEvent").slice(0, 15)
      .flatMap((e) => (e.payload?.commits || []).slice(0, 3).map((c: any) => ({
        message: c.message?.split("\n")[0] || "No message",
        repo: e.repo.name, date: e.created_at,
        sha: c.sha?.slice(0, 7), repoUrl: `https://github.com/${e.repo.name}`,
      }))).slice(0, 12);

    const prs = (events as any[])
      .filter((e) => e.type === "PullRequestEvent").slice(0, 8)
      .map((e) => ({
        title: e.payload?.pull_request?.title || "PR",
        repo: e.repo.name,
        state: e.payload?.action === "closed" && e.payload?.pull_request?.merged ? "merged"
             : e.payload?.action === "closed" ? "closed" : "open",
        date: e.created_at, url: e.payload?.pull_request?.html_url,
        number: e.payload?.pull_request?.number,
      }));

    const topRepos = [...(repos as any[])]
      .sort((a, b) => b.stargazers_count - a.stargazers_count).slice(0, 6)
      .map((r) => ({
        name: r.name, description: r.description, stars: r.stargazers_count,
        forks: r.forks_count, language: r.language, url: r.html_url,
        updatedAt: r.updated_at, isPrivate: r.private, topics: r.topics?.slice(0, 3) || [],
      }));

    const streak = contributions ? calcStreak(contributions.weeks) : { current: 0, longest: 0 };

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
    console.error("User API Error:", err);
    if (err.message?.includes("404")) return NextResponse.json({ error: "User not found" }, { status: 404 });
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
