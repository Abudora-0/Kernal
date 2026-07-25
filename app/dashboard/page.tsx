"use client";

import { useSession, signOut } from "next-auth/react";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  BookOpen, LogOut, RefreshCw, ExternalLink,
  GitFork, MapPin, Building2, Users, Search, Share2, Check,
  Star, TrendingUp,
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

function Logo({ size = 30 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="1" y="1" width="30" height="30" rx="7" fill="#0c1014" stroke="#2ee889" strokeWidth="1.5" />
      <circle cx="6.5" cy="6.5" r="1.4" fill="#2ee889" />
      <rect x="6" y="19" width="4" height="7" rx="0.6" fill="#1b8a58" />
      <rect x="13" y="13" width="4" height="13" rx="0.6" fill="#2ee889" />
      <rect x="20" y="6" width="4" height="20" rx="0.6" fill="#5eead4" />
    </svg>
  );
}

function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span className={`mono font-bold text-[16px] tracking-[0.06em] ${className}`} style={{ color: "var(--ink)" }}>
      {"KERNAL".split("").map((ch, i) => (
        <span key={i} className="wordmark-letter" style={{ animationDelay: `${i * 0.18}s` }}>{ch}</span>
      ))}
      <span className="wordmark-cursor" style={{ color: "var(--up)" }}>_</span>
    </span>
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
        <div className="h-12" style={{ background: "var(--bg-surface)", borderBottom: "1px solid var(--border)" }} />
        <div className="max-w-7xl mx-auto px-6 py-6 space-y-4">
          <div className="skeleton h-28" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[...Array(4)].map((_, i) => <div key={i} className="skeleton h-24" />)}
          </div>
          <div className="skeleton h-48" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--bg-base)" }}>
        <div className="panel p-8 text-center space-y-4 max-w-sm mx-4">
          <p className="mono text-[10px] tracking-[0.25em] font-bold" style={{ color: "var(--down)" }}>
            ▌ FEED ERROR
          </p>
          <p className="text-sm" style={{ color: "var(--ink-muted)" }}>{error}</p>
          <button onClick={fetchData} className="tbtn tbtn-primary w-full justify-center py-2.5">
            Reconnect feed
          </button>
        </div>
      </div>
    );
  }

  const profile = data?.profile;
  const tabs: { id: Tab; label: string; key: string }[] = [
    { id: "overview", label: "Overview",     key: "F1" },
    { id: "repos",    label: "Repositories", key: "F2" },
    { id: "activity", label: "Activity",     key: "F3" },
  ];

  return (
    <div className="min-h-screen" style={{ background: "var(--bg-base)", color: "var(--ink)" }}>
      {/* Header */}
      <header className="sticky top-0 z-20"
        style={{ borderBottom: "1px solid var(--border)", background: "rgba(6,8,9,0.92)", backdropFilter: "blur(10px)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-wrap items-center gap-3 sm:gap-4 py-2.5 sm:h-14 sm:py-0">
          <div className="flex items-center gap-2.5 flex-shrink-0 order-1">
            <Logo />
            <Wordmark />
          </div>

          <div className="flex items-center gap-2 ml-auto order-2 sm:order-3">
            <button onClick={copyShareLink} className="tbtn" title="Copy shareable link">
              {copied
                ? <><Check className="w-3 h-3" style={{ color: "var(--up)" }} /><span className="hidden sm:inline">Copied</span></>
                : <><Share2 className="w-3 h-3" /><span className="hidden sm:inline">Share</span></>}
            </button>

            <button onClick={fetchData} disabled={refreshing}
              className="tbtn px-2" title="Refresh">
              <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin" : ""}`} />
            </button>

            {session?.user?.image && (
              <img src={session.user.image} alt="avatar"
                className="w-6 h-6"
                style={{ border: "1px solid var(--border-muted)" }} />
            )}
            <button onClick={() => signOut({ callbackUrl: "/login" })}
              className="tbtn px-2" title="Sign out">
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* ticker lookup: full-width row on mobile, inline on desktop */}
          <form onSubmit={handleSearch} className="w-full sm:w-auto sm:flex-1 sm:max-w-xs order-3 sm:order-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none" style={{ color: "var(--ink-faint)" }} />
              <input
                ref={searchRef}
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="LOOKUP USER…"
                className="tinput"
                style={{ paddingLeft: "30px" }}
              />
            </div>
          </form>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-4">
        {/* Profile strip */}
        {profile && (
          <div className="animate-fade-in-up panel">
            <div className="panel-hd">
              <span className="tick" />
              <span className="panel-title">Trader Profile</span>
              <span className="mono text-[10px] ml-auto flex items-center gap-2" style={{ color: "var(--up)" }}>
                <span className="led led-up led-pulse" /> LIVE FEED
              </span>
            </div>
            <div className="panel-bd flex items-start gap-4">
              <img src={profile.avatar_url} alt="avatar"
                className="w-16 h-16 flex-shrink-0"
                style={{ border: "1px solid var(--border-muted)" }} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 flex-wrap">
                  <h1 className="text-lg font-bold" style={{ color: "var(--ink)" }}>{profile.name || profile.login}</h1>
                  <span className="mono text-[11px]" style={{ color: "var(--ink-muted)" }}>@{profile.login}</span>
                  <a href={profile.html_url} target="_blank" rel="noreferrer"
                    style={{ color: "var(--ink-faint)" }}
                    onMouseEnter={e => (e.currentTarget.style.color = "var(--up)")}
                    onMouseLeave={e => (e.currentTarget.style.color = "var(--ink-faint)")}>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                  {data?.grade && (
                    <span className="mono text-[10px] font-bold px-1.5 py-0.5"
                      style={{ border: "1px solid var(--up)", color: "var(--up)" }}>
                      GRADE {data.grade}
                    </span>
                  )}
                </div>
                {profile.bio && <p className="text-sm mt-1.5 leading-relaxed" style={{ color: "var(--ink-muted)" }}>{profile.bio}</p>}
                <div className="mono flex flex-wrap items-center gap-4 mt-2.5 text-[11px]" style={{ color: "var(--ink-faint)" }}>
                  <span className="flex items-center gap-1.5">
                    <Users className="w-3 h-3" />
                    {profile.followers} FLW · {profile.following} FLWG
                  </span>
                  {profile.location && <span className="flex items-center gap-1.5"><MapPin className="w-3 h-3" />{profile.location}</span>}
                  {profile.company && <span className="flex items-center gap-1.5"><Building2 className="w-3 h-3" />{profile.company}</span>}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Quote tiles */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { icon: <BookOpen className="w-4 h-4" />,   label: "Public Repos",  value: data?.totalRepos ?? 0,                        color: "cyan"   as const, delay: 0 },
            { icon: <Star className="w-4 h-4" />,       label: "Total Stars",   value: data?.totalStars ?? 0,                        color: "yellow" as const, delay: 80 },
            { icon: <TrendingUp className="w-4 h-4" />, label: "Contributions", value: data?.contributions?.totalContributions ?? 0, color: "lime"   as const, delay: 160 },
            { icon: <GitFork className="w-4 h-4" />,    label: "Total Forks",   value: data?.totalForks ?? 0,                        color: "cyan"   as const, delay: 240 },
          ].map((s, i) => (
            <div key={s.label} className={`animate-fade-in-up stagger-${i + 1}`}>
              <StatCard {...s} />
            </div>
          ))}
        </div>

        {/* Function-key tabs */}
        <div className="flex gap-1 w-full sm:w-fit p-1 overflow-x-auto" style={{ border: "1px solid var(--border)", background: "var(--bg-surface)" }}>
          {tabs.map((t) => (
            <button key={t.id} onClick={() => setTab(t.id)} className={`fkey flex-1 sm:flex-none justify-center ${tab === t.id ? "active" : ""}`}>
              <span className="fnum hidden sm:inline">{t.key}</span>{t.label}
            </button>
          ))}
        </div>

        {/* Tab: Overview */}
        {tab === "overview" && (
          <div className="space-y-4 animate-fade-in">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {data?.score !== undefined && (
                <div className="panel">
                  <div className="panel-hd"><span className="tick" /><span className="panel-title">Developer Index</span></div>
                  <div className="panel-bd">
                    <ScoreCard score={data.score} grade={data.grade} breakdown={data.breakdown} />
                  </div>
                </div>
              )}
              {data?.contributions && (
                <div className="panel lg:col-span-2">
                  <div className="panel-hd">
                    <span className="tick" />
                    <span className="panel-title">Contribution Volume · 52W</span>
                    <span className="mono text-[10px] ml-auto" style={{ color: "var(--up)" }}>
                      {data.contributions.totalContributions.toLocaleString()} YTD
                    </span>
                  </div>
                  <div className="panel-bd">
                    <ContributionGraph weeks={data.contributions.weeks} />
                  </div>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {data?.languages?.length > 0 && (
                <div className="panel">
                  <div className="panel-hd"><span className="tick" /><span className="panel-title">Language Allocation</span></div>
                  <div className="panel-bd">
                    <LanguageChart languages={data.languages} />
                  </div>
                </div>
              )}
              {data?.streak && (
                <div className="panel">
                  <div className="panel-hd"><span className="tick" /><span className="panel-title">Streak Position</span></div>
                  <div className="panel-bd">
                    <StreakCard current={data.streak.current} longest={data.streak.longest} activityByDay={data.activityByDay || []} />
                  </div>
                </div>
              )}
              {data?.activityByHour && (
                <div className="panel">
                  <div className="panel-hd"><span className="tick" /><span className="panel-title">Intraday Activity</span></div>
                  <div className="panel-bd">
                    <HourlyHeatmap activityByHour={data.activityByHour} />
                  </div>
                </div>
              )}
            </div>

            {data?.topRepos?.length > 0 && (
              <div>
                <div className="flex items-baseline justify-between mb-3">
                  <h2 className="panel-title">▌ Top Holdings · Repositories</h2>
                  <button onClick={() => setTab("repos")}
                    className="mono text-[11px] transition-colors"
                    style={{ color: "var(--up)" }}>
                    VIEW ALL ▸
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {data.topRepos.slice(0, 3).map((repo: any) => <RepoCard key={repo.name} repo={repo} />)}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab: Repos */}
        {tab === "repos" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 animate-fade-in">
            {data?.topRepos?.map((repo: any, i: number) => (
              <div key={repo.name} className="animate-fade-in-up" style={{ animationDelay: `${i * 60}ms` }}>
                <RepoCard repo={repo} />
              </div>
            ))}
          </div>
        )}

        {/* Tab: Activity */}
        {tab === "activity" && (
          <div className="space-y-4 animate-fade-in">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="panel">
                <div className="panel-hd"><span className="tick" /><span className="panel-title">Commit Tape</span></div>
                <div className="panel-bd pt-1">
                  <CommitFeed commits={data?.commits || []} />
                </div>
              </div>
              <div className="panel">
                <div className="panel-hd"><span className="tick" /><span className="panel-title">Pull Request Orders</span></div>
                <div className="panel-bd pt-1">
                  <PRFeed prs={data?.prs || []} />
                </div>
              </div>
            </div>
            {data?.activityByHour && (
              <div className="panel">
                <div className="panel-hd"><span className="tick" /><span className="panel-title">Intraday Activity · 24H</span></div>
                <div className="panel-bd">
                  <HourlyHeatmap activityByHour={data.activityByHour} />
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
