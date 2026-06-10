"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  Activity, Star, GitFork, TrendingUp, BookOpen,
  ExternalLink, MapPin, Building2, Users, GitCommit,
  GitPullRequest, Code2, Flame, Clock, Share2, Check,
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
    <div className="min-h-screen bg-[#0a0c10] flex items-center justify-center">
      <div className="text-center space-y-3">
        <div className="w-10 h-10 border-2 border-violet-500 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-gray-400 text-sm">Loading @{username}...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-[#0a0c10] flex items-center justify-center">
      <div className="glass rounded-2xl p-8 text-center space-y-3 max-w-sm mx-4">
        <p className="text-red-400 font-medium">{error}</p>
        <a href="/dashboard" className="block text-violet-400 hover:text-violet-300 text-sm transition-colors">← Back to dashboard</a>
      </div>
    </div>
  );

  const profile = data?.profile;
  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "repos", label: "Repositories" },
    { id: "activity", label: "Activity" },
  ];

  return (
    <div className="min-h-screen bg-[#0a0c10] text-white">
      {/* Header */}
      <header className="border-b border-[#21262d] bg-[#0d1117]/80 backdrop-blur-xl sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          <a href="/dashboard" className="flex items-center gap-2.5 hover:opacity-80 transition-opacity">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center">
              <Activity className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-bold text-white">DevPulse</span>
          </a>
          <button
            onClick={copyLink}
            className="flex items-center gap-2 text-sm text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 border border-[#30363d] px-3 py-1.5 rounded-lg transition-all"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Share2 className="w-3.5 h-3.5" />}
            {copied ? "Copied!" : "Share profile"}
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 space-y-6">
        {/* Profile Banner */}
        {profile && (
          <div className="animate-fade-in-up glass rounded-2xl p-6">
            <div className="flex items-start gap-5">
              <img src={profile.avatar_url} alt="avatar" className="w-20 h-20 rounded-2xl ring-2 ring-violet-500/30" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 flex-wrap">
                  <h1 className="text-xl font-bold text-white">{profile.name || profile.login}</h1>
                  <span className="text-sm text-gray-400 bg-white/5 px-2 py-0.5 rounded-full">@{profile.login}</span>
                  <a href={profile.html_url} target="_blank" rel="noreferrer" className="text-gray-500 hover:text-violet-400 transition-colors">
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
                {profile.bio && <p className="text-gray-400 text-sm mt-1.5">{profile.bio}</p>}
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
          <StatCard icon={<BookOpen className="w-4 h-4 text-orange-400" />} label="Public Repos" value={data?.totalRepos ?? 0} color="orange" />
          <StatCard icon={<Star className="w-4 h-4 text-yellow-400" />} label="Total Stars" value={data?.totalStars ?? 0} color="yellow" />
          <StatCard icon={<TrendingUp className="w-4 h-4 text-cyan-400" />} label="Contributions" value={data?.contributions?.totalContributions ?? 0} color="cyan" />
          <StatCard icon={<GitFork className="w-4 h-4 text-lime-400" />} label="Total Forks" value={data?.totalForks ?? 0} color="lime" />
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-[#161b22] border border-[#21262d] rounded-xl p-1 w-fit">
          {tabs.map((t) => (
            <button key={t.id} onClick={() => setTab(t.id as any)}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${tab === t.id ? "bg-violet-600 text-white shadow-lg shadow-violet-500/30" : "text-gray-400 hover:text-white"}`}>
              {t.label}
            </button>
          ))}
        </div>

        {tab === "overview" && (
          <div className="space-y-6 animate-fade-in">
            {/* Score + Contribution Graph */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              {data?.score !== undefined && (
                <div className="glass rounded-2xl p-6">
                  <h2 className="font-semibold flex items-center gap-2 mb-5 text-sm">
                    <Star className="w-4 h-4 text-yellow-400" />Developer Score
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
                  <h2 className="font-semibold flex items-center gap-2 mb-5 text-sm"><Flame className="w-4 h-4 text-orange-400" />Streak</h2>
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
                <h2 className="font-semibold flex items-center gap-2 mb-4 text-sm"><Star className="w-4 h-4 text-yellow-400" />Top Repositories</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {data.topRepos.slice(0, 3).map((repo: any) => <RepoCard key={repo.name} repo={repo} />)}
                </div>
              </div>
            )}
          </div>
        )}

        {tab === "repos" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-fade-in">
            {data?.topRepos?.map((repo: any, i: number) => (
              <div key={repo.name} className="animate-fade-in-up" style={{ animationDelay: `${i * 60}ms` }}>
                <RepoCard repo={repo} />
              </div>
            ))}
          </div>
        )}

        {tab === "activity" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 animate-fade-in">
            <div className="glass rounded-2xl p-6">
              <h2 className="font-semibold flex items-center gap-2 mb-4 text-sm"><GitCommit className="w-4 h-4 text-violet-400" />Recent Commits</h2>
              <CommitFeed commits={data?.commits || []} />
            </div>
            <div className="glass rounded-2xl p-6">
              <h2 className="font-semibold flex items-center gap-2 mb-4 text-sm"><GitPullRequest className="w-4 h-4 text-emerald-400" />Pull Requests</h2>
              <PRFeed prs={data?.prs || []} />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
