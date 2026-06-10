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

function Logo() {
  return (
    <svg width="28" height="28" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="hlg" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#fb923c"/>
          <stop offset="100%" stopColor="#22d3ee"/>
        </linearGradient>
      </defs>
      <rect x="6" y="6" width="88" height="88" rx="22" fill="url(#hlg)"/>
      <polyline points="10,50 28,50 36,20 46,74 55,34 63,50 90,50"
        stroke="white" strokeWidth="6.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

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
      <div className="min-h-screen" style={{ background: "var(--bg-base)" }}>
        <div className="h-14" style={{ background: "var(--bg-surface)", borderBottom: "1px solid var(--border)" }} />
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
      <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--bg-base)" }}>
        <div className="glass rounded-2xl p-8 text-center space-y-4 max-w-sm mx-4">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto"
            style={{ background: "rgba(251,146,60,0.1)", border: "1px solid rgba(251,146,60,0.2)" }}>
            <Activity className="w-6 h-6" style={{ color: "#fb923c" }} />
          </div>
          <p className="font-medium" style={{ color: "#fb923c" }}>{error}</p>
          <button onClick={fetchData}
            className="w-full text-white py-2.5 px-4 rounded-xl transition-colors font-medium"
            style={{ background: "linear-gradient(135deg, #fb923c, #22d3ee)" }}>
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
    <div className="min-h-screen text-white" style={{ background: "var(--bg-base)" }}>
      {/* Header */}
      <header className="sticky top-0 z-20 backdrop-blur-xl"
        style={{ borderBottom: "1px solid var(--border)", background: "rgba(11,14,22,0.85)" }}>
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center gap-4">
          {/* Logo */}
          <div className="flex items-center gap-2.5 flex-shrink-0">
            <Logo />
            <span className="font-bold text-white hidden sm:block">DevPulse</span>
          </div>

          {/* Search */}
          <form onSubmit={handleSearch} className="flex-1 max-w-xs">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5" style={{ color: "#3a5070" }} />
              <input
                ref={searchRef}
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search any GitHub user..."
                className="w-full rounded-lg pl-9 pr-3 py-1.5 text-sm text-white placeholder:text-[#3a5070] focus:outline-none transition-colors"
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid var(--border-muted)" }}
                onFocus={e => (e.currentTarget.style.borderColor = "rgba(251,146,60,0.5)")}
                onBlur={e => (e.currentTarget.style.borderColor = "var(--border-muted)")}
              />
            </div>
          </form>

          <div className="flex items-center gap-2 ml-auto">
            {/* Share */}
            <button onClick={copyShareLink}
              className="hidden sm:flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg transition-all"
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid var(--border-muted)", color: "#7a8fa8" }}
              title="Copy shareable link">
              {copied
                ? <><Check className="w-3.5 h-3.5" style={{ color: "#a3e635" }} />Copied!</>
                : <><Share2 className="w-3.5 h-3.5" />Share</>}
            </button>

            <div className="w-px h-5" style={{ background: "var(--border-muted)" }} />

            <button onClick={fetchData} disabled={refreshing}
              className="p-2 rounded-lg transition-colors disabled:opacity-40"
              style={{ color: "#7a8fa8" }}
              title="Refresh">
              <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
            </button>

            {session?.user?.image && (
              <img src={session.user.image} alt="avatar"
                className="w-7 h-7 rounded-full"
                style={{ boxShadow: "0 0 0 2px rgba(251,146,60,0.4)" }} />
            )}
            <span className="text-sm hidden md:block" style={{ color: "#8fa8c4" }}>{session?.user?.name}</span>
            <button onClick={() => signOut({ callbackUrl: "/login" })}
              className="p-2 rounded-lg transition-colors"
              style={{ color: "#7a8fa8" }}
              title="Sign out">
              <LogOut className="w-4 h-4 hover:text-red-400" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 space-y-6">
        {/* Profile Banner */}
        {profile && (
          <div className="animate-fade-in-up glass rounded-2xl p-6"
            style={{ borderTop: "2px solid transparent", backgroundImage: "linear-gradient(var(--bg-surface), var(--bg-surface)), linear-gradient(to right, #fb923c, #22d3ee)", backgroundOrigin: "border-box", backgroundClip: "padding-box, border-box" }}>
            <div className="flex items-start gap-5">
              <div className="relative flex-shrink-0">
                <img src={profile.avatar_url} alt="avatar"
                  className="w-20 h-20 rounded-2xl"
                  style={{ boxShadow: "0 0 0 2px rgba(251,146,60,0.25)" }} />
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2"
                  style={{ borderColor: "var(--bg-surface)" }} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 flex-wrap">
                  <h1 className="text-xl font-bold text-white">{profile.name || profile.login}</h1>
                  <span className="text-sm px-2 py-0.5 rounded-full" style={{ color: "#7a8fa8", background: "rgba(255,255,255,0.05)" }}>
                    @{profile.login}
                  </span>
                  <a href={profile.html_url} target="_blank" rel="noreferrer"
                    className="transition-colors" style={{ color: "#3a5070" }}
                    onMouseEnter={e => (e.currentTarget.style.color = "#fb923c")}
                    onMouseLeave={e => (e.currentTarget.style.color = "#3a5070")}>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                  {data?.grade && (
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full"
                      style={{ background: "rgba(251,146,60,0.15)", border: "1px solid rgba(251,146,60,0.3)", color: "#fb923c" }}>
                      Grade {data.grade}
                    </span>
                  )}
                </div>
                {profile.bio && <p className="text-sm mt-1.5 leading-relaxed" style={{ color: "#7a8fa8" }}>{profile.bio}</p>}
                <div className="flex flex-wrap items-center gap-4 mt-3 text-sm" style={{ color: "#4a6080" }}>
                  <span className="flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5" />
                    {profile.followers} followers · {profile.following} following
                  </span>
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
            { icon: <BookOpen className="w-4 h-4 text-orange-400" />, label: "Public Repos",   value: data?.totalRepos ?? 0,                              color: "orange" as const, delay: 0 },
            { icon: <Star      className="w-4 h-4 text-yellow-400" />, label: "Total Stars",    value: data?.totalStars ?? 0,                              color: "yellow" as const, delay: 80 },
            { icon: <TrendingUp className="w-4 h-4 text-cyan-400"  />, label: "Contributions", value: data?.contributions?.totalContributions ?? 0,       color: "cyan"   as const, delay: 160 },
            { icon: <GitFork   className="w-4 h-4 text-lime-400"   />, label: "Total Forks",   value: data?.totalForks ?? 0,                              color: "lime"   as const, delay: 240 },
          ].map((s, i) => (
            <div key={s.label} className={`animate-fade-in-up stagger-${i + 1}`}>
              <StatCard {...s} />
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 rounded-xl p-1 w-fit"
          style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)" }}>
          {tabs.map((t) => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className="px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-200"
              style={tab === t.id
                ? { background: "linear-gradient(135deg, #fb923c, #22d3ee)", color: "white", boxShadow: "0 4px 12px rgba(251,146,60,0.3)" }
                : { color: "#4a6080" }}>
              {t.label}
            </button>
          ))}
        </div>

        {/* Tab: Overview */}
        {tab === "overview" && (
          <div className="space-y-6 animate-fade-in">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              {data?.score !== undefined && (
                <div className="glass rounded-2xl p-6">
                  <h2 className="font-semibold flex items-center gap-2 mb-5 text-sm text-white">
                    <Trophy className="w-4 h-4 text-yellow-400" />Developer Score
                  </h2>
                  <ScoreCard score={data.score} grade={data.grade} breakdown={data.breakdown} />
                </div>
              )}
              {data?.contributions && (
                <div className="glass rounded-2xl p-6 lg:col-span-2">
                  <div className="flex items-center justify-between mb-5">
                    <h2 className="font-semibold flex items-center gap-2 text-sm text-white">
                      <TrendingUp className="w-4 h-4 text-cyan-400" />Contribution Activity
                    </h2>
                    <span className="text-xs px-2.5 py-1 rounded-full"
                      style={{ color: "#22d3ee", background: "rgba(34,211,238,0.08)", border: "1px solid rgba(34,211,238,0.2)" }}>
                      {data.contributions.totalContributions.toLocaleString()} this year
                    </span>
                  </div>
                  <ContributionGraph weeks={data.contributions.weeks} />
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              {data?.languages?.length > 0 && (
                <div className="glass rounded-2xl p-6">
                  <h2 className="font-semibold flex items-center gap-2 mb-5 text-sm text-white">
                    <Code2 className="w-4 h-4 text-cyan-400" />Languages
                  </h2>
                  <LanguageChart languages={data.languages} />
                </div>
              )}
              {data?.streak && (
                <div className="glass rounded-2xl p-6">
                  <h2 className="font-semibold flex items-center gap-2 mb-5 text-sm text-white">
                    <Flame className="w-4 h-4 text-orange-400" />Coding Streak
                  </h2>
                  <StreakCard current={data.streak.current} longest={data.streak.longest} activityByDay={data.activityByDay || []} />
                </div>
              )}
              {data?.activityByHour && (
                <div className="glass rounded-2xl p-6">
                  <h2 className="font-semibold flex items-center gap-2 mb-5 text-sm text-white">
                    <Clock className="w-4 h-4 text-orange-400" />Coding Hours
                  </h2>
                  <HourlyHeatmap activityByHour={data.activityByHour} />
                </div>
              )}
            </div>

            {data?.topRepos?.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-semibold flex items-center gap-2 text-sm text-white">
                    <Star className="w-4 h-4 text-yellow-400" />Top Repositories
                  </h2>
                  <button onClick={() => setTab("repos")}
                    className="text-sm transition-colors"
                    style={{ color: "#fb923c" }}
                    onMouseEnter={e => (e.currentTarget.style.color = "#22d3ee")}
                    onMouseLeave={e => (e.currentTarget.style.color = "#fb923c")}>
                    View all →
                  </button>
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
                <h2 className="font-semibold flex items-center gap-2 mb-4 text-sm text-white">
                  <GitCommit className="w-4 h-4 text-orange-400" />Recent Commits
                </h2>
                <CommitFeed commits={data?.commits || []} />
              </div>
              <div className="glass rounded-2xl p-6">
                <h2 className="font-semibold flex items-center gap-2 mb-4 text-sm text-white">
                  <GitPullRequest className="w-4 h-4 text-cyan-400" />Pull Requests
                </h2>
                <PRFeed prs={data?.prs || []} />
              </div>
            </div>
            {data?.activityByHour && (
              <div className="glass rounded-2xl p-6">
                <h2 className="font-semibold flex items-center gap-2 mb-5 text-sm text-white">
                  <Clock className="w-4 h-4 text-orange-400" />Activity by Hour of Day
                </h2>
                <HourlyHeatmap activityByHour={data.activityByHour} />
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
