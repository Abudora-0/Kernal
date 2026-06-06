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
    return <p className="text-sm text-gray-500 text-center py-4">No recent commits found</p>;
  }

  return (
    <div className="space-y-1">
      {commits.map((commit, i) => (
        <div key={i} className="flex items-start gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors group">
          <div className="w-6 h-6 rounded-full bg-violet-500/10 border border-violet-500/20 flex items-center justify-center shrink-0 mt-0.5">
            <GitCommit className="w-3 h-3 text-violet-400" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm text-gray-200 truncate leading-snug">{commit.message}</p>
            <div className="flex items-center gap-2 mt-0.5 text-xs text-gray-500">
              <a
                href={commit.repoUrl}
                target="_blank"
                rel="noreferrer"
                className="text-violet-400/70 hover:text-violet-400 transition-colors truncate max-w-[120px]"
              >
                {commit.repo.split("/")[1] || commit.repo}
              </a>
              <span>·</span>
              <span className="font-mono text-[10px] bg-gray-800 px-1 rounded">{commit.sha}</span>
              <span>·</span>
              <span>{timeAgo(commit.date)}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
