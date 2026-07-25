"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  Star, GitFork, TrendingUp, BookOpen,
  ExternalLink, MapPin, Building2, Users, Share2, Check, ArrowLeft,
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

export default function PublicProfilePage() {
  const params = useParams();
  const username = params.username as string;
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [tab, setTab] = useState<"overview"|"repos"|"activity">("overview");

  useEffect(() => {
    if (!username) return;
    fetch(`/api/user/${username}`)
      .then(r => r.json())
      .then(json => {
        if (json.error) throw new Error(json.error);
        setData(json);
      })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [username]);

  function copyLink() {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--bg-base)" }}>
      <div className="text-center space-y-3">
        <p className="mono text-[11px] tracking-[0.2em]" style={{ color: "var(--up)" }}>
          ▚ FETCHING FEED
        </p>
        <p className="mono text-xs" style={{ color: "var(--ink-faint)" }}>@{username}</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--bg-base)" }}>
      <div className="panel p-8 text-center space-y-3 max-w-sm mx-4">
        <p className="mono text-[10px] tracking-[0.25em] font-bold" style={{ color: "var(--down)" }}>▌ FEED ERROR</p>
        <p className="text-sm" style={{ color: "var(--ink-muted)" }}>{error}</p>
        <a href="/dashboard" className="mono text-[11px] block transition-colors" style={{ color: "var(--up)" }}>
          ◂ BACK TO TERMINAL
        </a>
      </div>
    </div>
  );

  const profile = data?.profile;
  const tabs = [
    { id: "overview", label: "Overview",     key: "F1" },
    { id: "repos",    label: "Repositories", key: "F2" },
    { id: "activity", label: "Activity",     key: "F3" },
  ];

  return (
    <div className="min-h-screen" style={{ background: "var(--bg-base)", color: "var(--ink)" }}>
      {/* Header */}
      <header className="sticky top-0 z-20"
        style={{ borderBottom: "1px solid var(--border)", background: "rgba(6,8,9,0.92)", backdropFilter: "blur(10px)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <a href="/dashboard" className="flex items-center gap-2.5 hover:opacity-80 transition-opacity">
            <Logo />
            <Wordmark />
          </a>
          <div className="flex items-center gap-2">
            <a href="/dashboard" className="tbtn" title="Back to dashboard">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Dashboard</span>
            </a>
            <button onClick={copyLink} className="tbtn">
              {copied
                ? <><Check className="w-3 h-3" style={{ color: "var(--up)" }} /><span className="hidden sm:inline">Copied</span></>
                : <><Share2 className="w-3 h-3" /><span className="hidden sm:inline">Share profile</span></>}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-4">
        {/* Profile strip */}
        {profile && (
          <div className="animate-fade-in-up panel">
            <div className="panel-hd">
              <span className="tick" />
              <span className="panel-title">Public Profile · @{profile.login}</span>
            </div>
            <div className="panel-bd flex items-start gap-4">
              <img src={profile.avatar_url} alt="avatar" className="w-16 h-16 flex-shrink-0"
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
          <StatCard icon={<BookOpen className="w-4 h-4" />} label="Public Repos" value={data?.totalRepos ?? 0} color="cyan" />
          <StatCard icon={<Star className="w-4 h-4" />} label="Total Stars" value={data?.totalStars ?? 0} color="yellow" />
          <StatCard icon={<TrendingUp className="w-4 h-4" />} label="Contributions" value={data?.contributions?.totalContributions ?? 0} color="lime" />
          <StatCard icon={<GitFork className="w-4 h-4" />} label="Total Forks" value={data?.totalForks ?? 0} color="cyan" />
        </div>

        {/* Tabs */}
        <div className="flex gap-1 w-full sm:w-fit p-1 overflow-x-auto" style={{ border: "1px solid var(--border)", background: "var(--bg-surface)" }}>
          {tabs.map((t) => (
            <button key={t.id} onClick={() => setTab(t.id as any)} className={`fkey flex-1 sm:flex-none justify-center ${tab === t.id ? "active" : ""}`}>
              <span className="fnum hidden sm:inline">{t.key}</span>{t.label}
            </button>
          ))}
        </div>

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
                  <div className="panel-bd"><LanguageChart languages={data.languages} /></div>
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
                  <div className="panel-bd"><HourlyHeatmap activityByHour={data.activityByHour} /></div>
                </div>
              )}
            </div>

            {data?.topRepos?.length > 0 && (
              <div>
                <h2 className="panel-title mb-3">▌ Top Holdings · Repositories</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {data.topRepos.slice(0, 3).map((repo: any) => <RepoCard key={repo.name} repo={repo} />)}
                </div>
              </div>
            )}
          </div>
        )}

        {tab === "repos" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 animate-fade-in">
            {data?.topRepos?.map((repo: any, i: number) => (
              <div key={repo.name} className="animate-fade-in-up" style={{ animationDelay: `${i * 60}ms` }}>
                <RepoCard repo={repo} />
              </div>
            ))}
          </div>
        )}

        {tab === "activity" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 animate-fade-in">
            <div className="panel">
              <div className="panel-hd"><span className="tick" /><span className="panel-title">Commit Tape</span></div>
              <div className="panel-bd pt-1"><CommitFeed commits={data?.commits || []} /></div>
            </div>
            <div className="panel">
              <div className="panel-hd"><span className="tick" /><span className="panel-title">Pull Request Orders</span></div>
              <div className="panel-bd pt-1"><PRFeed prs={data?.prs || []} /></div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
