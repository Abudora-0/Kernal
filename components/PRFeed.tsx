import { GitPullRequest, GitMerge, XCircle } from "lucide-react";

interface PR { title: string; repo: string; state: "open"|"merged"|"closed"; date: string; url: string; number: number; }

function timeAgo(date: string) {
  const diff = Date.now() - new Date(date).getTime();
  const hrs = Math.floor(diff / 3600000);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

const stateConfig = {
  open:   { icon: <GitPullRequest className="w-3 h-3" />, color: "text-green-400", bg: "bg-green-500/10 border-green-500/20", label: "Open" },
  merged: { icon: <GitMerge className="w-3 h-3" />,        color: "text-violet-400", bg: "bg-violet-500/10 border-violet-500/20", label: "Merged" },
  closed: { icon: <XCircle className="w-3 h-3" />,         color: "text-red-400",   bg: "bg-red-500/10 border-red-500/20",    label: "Closed" },
};

export default function PRFeed({ prs }: { prs: PR[] }) {
  if (!prs.length) {
    return <p className="text-sm text-gray-500 text-center py-4">No recent pull requests found</p>;
  }

  return (
    <div className="space-y-1">
      {prs.map((pr, i) => {
        const cfg = stateConfig[pr.state];
        return (
          <a
            key={i}
            href={pr.url}
            target="_blank"
            rel="noreferrer"
            className="flex items-start gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors group"
          >
            <div className={`w-6 h-6 rounded-full border flex items-center justify-center shrink-0 mt-0.5 ${cfg.bg} ${cfg.color}`}>
              {cfg.icon}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-200 truncate group-hover:text-white transition-colors leading-snug">
                {pr.title}
              </p>
              <div className="flex items-center gap-2 mt-0.5 text-xs text-gray-500">
                <span className="text-violet-400/70 truncate max-w-[100px]">
                  {pr.repo.split("/")[1] || pr.repo}
                </span>
                <span>·</span>
                <span className={`${cfg.color} font-medium`}>{cfg.label}</span>
                <span>·</span>
                <span>{timeAgo(pr.date)}</span>
              </div>
            </div>
            <span className="text-xs text-gray-600 shrink-0">#{pr.number}</span>
          </a>
        );
      })}
    </div>
  );
}
