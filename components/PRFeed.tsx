"use client";

import { GitPullRequest, GitMerge, XCircle } from "lucide-react";

interface PR { title: string; repo: string; state: "open"|"merged"|"closed"; date: string; url: string; number: number; }

function timeAgo(date: string) {
  const diff = Date.now() - new Date(date).getTime();
  const hrs = Math.floor(diff / 3600000);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

const stateConfig = {
  open:   { icon: <GitPullRequest className="w-3 h-3" />, color: "#a3e635", bg: "rgba(163,230,53,0.1)",  border: "rgba(163,230,53,0.25)",  label: "Open"   },
  merged: { icon: <GitMerge className="w-3 h-3" />,       color: "#fb923c", bg: "rgba(251,146,60,0.1)",  border: "rgba(251,146,60,0.25)",  label: "Merged" },
  closed: { icon: <XCircle className="w-3 h-3" />,        color: "#f87171", bg: "rgba(248,113,113,0.1)", border: "rgba(248,113,113,0.25)", label: "Closed" },
};

export default function PRFeed({ prs }: { prs: PR[] }) {
  if (!prs.length) {
    return <p className="text-sm text-center py-4" style={{ color: "#3a5070" }}>No recent pull requests found</p>;
  }

  return (
    <div className="space-y-1">
      {prs.map((pr, i) => {
        const cfg = stateConfig[pr.state];
        return (
          <a key={i} href={pr.url} target="_blank" rel="noreferrer"
            className="flex items-start gap-3 p-2 rounded-lg transition-colors group"
            onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.03)")}
            onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
            <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5"
              style={{ background: cfg.bg, border: `1px solid ${cfg.border}`, color: cfg.color }}>
              {cfg.icon}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-white truncate leading-snug">{pr.title}</p>
              <div className="flex items-center gap-2 mt-0.5 text-xs" style={{ color: "#3a5070" }}>
                <span className="truncate max-w-[100px]" style={{ color: "rgba(34,211,238,0.7)" }}>
                  {pr.repo.split("/")[1] || pr.repo}
                </span>
                <span>·</span>
                <span className="font-medium" style={{ color: cfg.color }}>{cfg.label}</span>
                <span>·</span>
                <span>{timeAgo(pr.date)}</span>
              </div>
            </div>
            <span className="text-xs shrink-0" style={{ color: "#2a3a50" }}>#{pr.number}</span>
          </a>
        );
      })}
    </div>
  );
}
