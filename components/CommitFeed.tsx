"use client";

import { GitCommit, ExternalLink } from "lucide-react";

interface Commit { message: string; repo: string; date: string; sha: string; repoUrl?: string; }

function timeAgo(date: string) {
  const diff = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default function CommitFeed({ commits }: { commits: Commit[] }) {
  if (!commits.length) {
    return <p className="text-sm text-center py-4" style={{ color: "#3a5070" }}>No recent commits found</p>;
  }

  return (
    <div className="space-y-1">
      {commits.map((commit, i) => (
        <div key={i} className="flex items-start gap-3 p-2 rounded-lg transition-colors group"
          style={{ cursor: "default" }}
          onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.03)")}
          onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
          <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5"
            style={{ background: "rgba(251,146,60,0.1)", border: "1px solid rgba(251,146,60,0.2)" }}>
            <GitCommit className="w-3 h-3 text-orange-400" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm text-white truncate leading-snug">{commit.message}</p>
            <div className="flex items-center gap-2 mt-0.5 text-xs" style={{ color: "#3a5070" }}>
              <a href={commit.repoUrl} target="_blank" rel="noreferrer"
                className="transition-colors truncate max-w-[120px]"
                style={{ color: "rgba(34,211,238,0.7)" }}
                onMouseEnter={e => (e.currentTarget.style.color = "#22d3ee")}
                onMouseLeave={e => (e.currentTarget.style.color = "rgba(34,211,238,0.7)")}>
                {commit.repo.split("/")[1] || commit.repo}
              </a>
              <span>·</span>
              <span className="font-mono text-[10px] px-1 rounded" style={{ background: "var(--bg-elevated)" }}>
                {commit.sha}
              </span>
              <span>·</span>
              <span>{timeAgo(commit.date)}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
