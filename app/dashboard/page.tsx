"use client";

import { useSession, signOut } from "next-auth/react";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Activity, Star, Code2, GitCommit, TrendingUp,
  BookOpen, LogOut, RefreshCw, ExternalLink,
  GitFork, GitPullRequest, Flame, MapPin, Building2,
  Users, Search, Share2, Check, Clock, Trophy,
} from "lucide-react";
import ContributionGraph from "@/components/ContributionGraph";
import LanguageChart from "@/components/LanguageChart";
import RepoCard from "@/components/RepoCard";
import CommitFeed from "@/components/CommitFeed";
import PRFeed from "@/components/PRFeed";
import StreakCard from "@/components/StreakCard";
import ScoreCard from "@/components/ScoreCard";
import HourlyHeatmap from "@/components/HourlyHeatmap";
import StatCard from "@/components/StatCard";

type Tab = "overview" | "repos" | "activity";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [tab, setTab] = useState<Tab>("overview");
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState("");
  const [copied, setCopied] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  useEffect(() => {
    if (status === "authenticated") fetchData();
  }, [status]);

  async function fetchData() {
    setRefreshing(true);
    setError("");
    try {
      const res = await fetch("/api/github");
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to fetch GitHub data");
      setData(json);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const q = search.trim();
    if (q) router.push(`/u/${q}`);
  }

  function copyShareLink() {
    const username = data?.profile?.login;
    if (!username) return;
    navigator.clipboard.writeText(`${window.location.origin}/u/${username}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-[#0a0c10]">
        <div className="h-14 bg-[#0d1117] border-b border-[#21262d]" />
        <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">
          <div className="skeleton h-36 rounded-2xl" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => <div key={i} className="skeleton h-28 rounded-2xl" />)}
          </div>
          <div className="skeleton h-48 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0a0c10] flex items-center justify-center">
        <div className="glass rounded-2xl p-8 text-center space-y-4 max-w-sm mx-4">
          <div className="w-12 h-12 bg-red-500/10 rounded-xl flex items-center justify-center mx-auto">
            <Activity className="w-6 h-6 text-red-400" />
          </div>
          <p className="text-red-400 font-medium">{error}</p>
          <button onClick={fetchData} className="w-full bg-violet-600 hover:bg-violet-700 text-white py-2.5 px-4 rounded-xl transition-colors font-medium">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const profile = data?.profile;
  const tabs: { id: Tab; label: string }[] = [
    { id: "overview", label: "Overview" },
    { id: "repos", label: "Repositories" },
    { id: "activity", label: "Activity" },
  ];

  return (
    <div className="min-h-screen bg-[#0a0c10] text-white">
      {/* Header */}
      <header className="border-b border-[#21262d] bg-[#0d1117]/80 backdrop-blur-xl sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center gap-4">
          {/* Logo */}
          <div className="flex items-center gap-2.5 flex-shrink-0">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center">
              <Activity className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-bold text-white hidden sm:block">DevPulse</span>
          </div>

          {/* Search */}
          <form onSubmit={handleSearch} className="flex-1 max-w-xs">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500" />
              <input
                ref={searchRef}
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search any GitHub user..."
                className="w-full bg-white/5 border border-[#30363d] rounded-lg pl-9 pr-3 py-1.5 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-violet-500 transition-colors"
              />
            </div>
          </form>

          <div className="flex items-center gap-2 ml-auto">
            {/* Share button */}
            <button
              onClick={copyShareLink}
              className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 border border-[#30363d] px-2.5 py-1.5 rounded-lg transition-all hidden sm:flex"
              title="Copy shareable link"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Share2 className="w-3.5 h-3.5" />}
              {copied ? "Copied!" : "Share"}
            </button>

            <div className="w-px h-5 bg-[#30363d]" />

            <button onClick={fetchData} disabled={refreshing}
              className="p-2 hover:bg-white/5 rounded-lg transition-colors text-gray-400 hover:text-white disabled:opacity-40"
              title="Refresh">
              <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
            </button>

            {session?.user?.image && (
              <img src={session.user.image} alt="avatar" className="w-7 h-7 rounded-full ring-2 ring-violet-500/50" />
            )}
            <span className="text-sm text-gray-300 hidden md:block">{session?.user?.name}</span>
            <button onClick={() => signOut({ callbackUrl: "/login" })}
              className="p-2 hover:bg-white/5 rounded-lg transition-colors text-gray-400 hover:text-red-400"
              title="Sign out">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 space-y-6">
        {/* Profile Banner */}
        {profile && (
          <div className="animate-fade-in-up glass rounded-2xl p-6">
            <div className="flex items-start gap-5">
              <div className="relative flex-shrink-0">
                <img src={profile.avatar_url} alt="avatar" className="w-20 h-20 rounded-2xl ring-2 ring-violet-500/30" />
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-[#0d1117]" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 flex-wrap">
                  <h1 className="text-xl font-bold text-white">{profile.name || profile.login}</h1>
                  <span className="text-sm text-gray-400 bg-white/5 px-2 py-0.5 rounded-full">@{profile.login}</span>
                  <a href={profile.html_url} target="_blank" rel="noreferrer" className="text-gray-500 hover:text-violet-400 transition-colors">
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                  {data?.grade && (
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-violet-500/20 border border-violet-500/30 text-violet-300">
                      Grade {data.grade}
                    </span>
                  )}
                </div>
                {profile.bio && <p className="text-gray-400 text-sm mt-1.5 leading-relaxed">{profile.bio}</p>}
                <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-gray-500">
                  <span className="flex items-center gap-1.5"><Users className="w-3.5 h-3.5" />{profile.followers} followers · {profile.following} following</span>
                  {profile.location && <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" />{profile.location}</span>}
                  {profile.company && <span className="flex items-center gap-1.5"><Building2 className="w-3.5 h-3.5" />{profile.company}</span>}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { icon: <BookOpen className="w-4 h-4 text-violet-400" />, label: "Public Repos", value: data?.totalRepos ?? 0, color: "violet" as const, delay: 0 },
            { icon: <Star className="w-4 h-4 text-yellow-400" />, label: "Total Stars", value: data?.totalStars ?? 0, color: "yellow" as const, delay: 80 },
            { icon: <TrendingUp className="w-4 h-4 text-emerald-400" />, label: "Contributions", value: data?.contributions?.totalContributions ?? 0, color: "green" as const, delay: 160 },
            { icon: <GitFork className="w-4 h-4 text-blue-400" />, label: "Total Forks", value: data?.totalForks ?? 0, color: "blue" as const, delay: 240 },
          ].map((s, i) => (
            <div key={s.label} className={`animate-fade-in-up stagger-${i + 1}`}>
              <StatCard {...s} />
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-[#161b22] border border-[#21262d] rounded-xl p-1 w-fit">
          {tabs.map((t) => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${tab === t.id ? "bg-violet-600 text-white shadow-lg shadow-violet-500/30" : "text-gray-400 hover:text-white"}`}>
              {t.label}
            </button>
          ))}
        </div>

        {/* Tab: Overview */}
        {tab === "overview" && (
          <div className="space-y-6 animate-fade-in">
            {/* Score + Contribution Graph */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              {data?.score !== undefined && (
                <div className="glass rounded-2xl p-6">
                  <h2 className="font-semibold flex items-center gap-2 mb-5 text-sm">
                    <Trophy className="w-4 h-4 text-yellow-400" />Developer Score
                  </h2>
                  <ScoreCard score={data.score} grade={data.grade} breakdown={data.breakdown} />
                </div>
              )}
              {data?.contributions && (
                <div className="glass rounded-2xl p-6 lg:col-span-2">
                  <div className="flex items-center justify-between mb-5">
                    <h2 className="font-semibold flex items-center gap-2 text-sm">
                      <TrendingUp className="w-4 h-4 text-emerald-400" />Contribution Activity
                    </h2>
                    <span className="text-xs text-gray-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full">
                      {data.contributions.totalContributions.toLocaleString()} this year
                    </span>
                  </div>
                  <ContributionGraph weeks={data.contributions.weeks} />
                </div>
              )}
            </div>

            {/* Languages + Streak + Hourly */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              {data?.languages?.length > 0 && (
                <div className="glass rounded-2xl p-6">
                  <h2 className="font-semibold flex items-center gap-2 mb-5 text-sm"><Code2 className="w-4 h-4 text-blue-400" />Languages</h2>
                  <LanguageChart languages={data.languages} />
                </div>
              )}
              {data?.streak && (
                <div className="glass rounded-2xl p-6">
                  <h2 className="font-semibold flex items-center gap-2 mb-5 text-sm"><Flame className="w-4 h-4 text-orange-400" />Coding Streak</h2>
                  <StreakCard current={data.streak.current} longest={data.streak.longest} activityByDay={data.activityByDay || []} />
                </div>
              )}
              {data?.activityByHour && (
                <div className="glass rounded-2xl p-6">
                  <h2 className="font-semibold flex items-center gap-2 mb-5 text-sm"><Clock className="w-4 h-4 text-violet-400" />Coding Hours</h2>
                  <HourlyHeatmap activityByHour={data.activityByHour} />
                </div>
              )}
            </div>

            {/* Top Repos */}
            {data?.topRepos?.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-semibold flex items-center gap-2 text-sm"><Star className="w-4 h-4 text-yellow-400" />Top Repositories</h2>
                  <button onClick={() => setTab("repos")} className="text-sm text-violet-400 hover:text-violet-300 transition-colors">View all →</button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {data.topRepos.slice(0, 3).map((repo: any) => <RepoCard key={repo.name} repo={repo} />)}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab: Repos */}
        {tab === "repos" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-fade-in">
            {data?.topRepos?.map((repo: any, i: number) => (
              <div key={repo.name} className="animate-fade-in-up" style={{ animationDelay: `${i * 60}ms` }}>
                <RepoCard repo={repo} />
              </div>
            ))}
          </div>
        )}

        {/* Tab: Activity */}
        {tab === "activity" && (
          <div className="space-y-5 animate-fade-in">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              <div className="glass rounded-2xl p-6">
                <h2 className="font-semibold flex items-center gap-2 mb-4 text-sm"><GitCommit className="w-4 h-4 text-violet-400" />Recent Commits</h2>
                <CommitFeed commits={data?.commits || []} />
              </div>
              <div className="glass rounded-2xl p-6">
                <h2 className="font-semibold flex items-center gap-2 mb-4 text-sm"><GitPullRequest className="w-4 h-4 text-emerald-400" />Pull Requests</h2>
                <PRFeed prs={data?.prs || []} />
              </div>
            </div>
            {data?.activityByHour && (
              <div className="glass rounded-2xl p-6">
                <h2 className="font-semibold flex items-center gap-2 mb-5 text-sm"><Clock className="w-4 h-4 text-violet-400" />Activity by Hour of Day</h2>
                <HourlyHeatmap activityByHour={data.activityByHour} />
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
