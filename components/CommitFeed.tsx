"use client";

interface Commit { message: string; repo: string; date: string; sha: string; repoUrl?: string; }

function timeAgo(date: string) {
  const diff = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h`;
  return `${Math.floor(hrs / 24)}d`;
}

/* tape-style commit ledger */
export default function CommitFeed({ commits }: { commits: Commit[] }) {
  if (!commits.length) {
    return <p className="mono text-xs text-center py-4" style={{ color: "var(--ink-faint)" }}>NO RECENT COMMITS</p>;
  }

  return (
    <div>
      {commits.map((commit, i) => (
        <div key={i}
          className="flex items-baseline gap-3 py-2 transition-colors"
          style={i > 0 ? { borderTop: "1px solid var(--border)" } : undefined}
          onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.02)")}
          onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
          <span className="mono text-[10px] flex-shrink-0 w-14" style={{ color: "var(--up)" }}>
            {commit.sha.slice(0, 7)}
          </span>
          <div className="flex-1 min-w-0">
            <p className="text-[12.5px] truncate leading-snug" style={{ color: "var(--ink)" }}>{commit.message}</p>
            <a href={commit.repoUrl} target="_blank" rel="noreferrer"
              className="mono text-[10px] truncate inline-block max-w-[160px] transition-colors"
              style={{ color: "var(--ink-faint)" }}
              onMouseEnter={e => (e.currentTarget.style.color = "var(--info)")}
              onMouseLeave={e => (e.currentTarget.style.color = "var(--ink-faint)")}>
              {commit.repo.split("/")[1] || commit.repo}
            </a>
          </div>
          <span className="mono text-[10px] flex-shrink-0 tabular-nums" style={{ color: "var(--ink-faint)" }}>
            {timeAgo(commit.date)}
          </span>
        </div>
      ))}
    </div>
  );
}
