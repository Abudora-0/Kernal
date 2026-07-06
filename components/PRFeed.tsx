"use client";

interface PR { title: string; repo: string; state: "open"|"merged"|"closed"; date: string; url: string; number: number; }

function timeAgo(date: string) {
  const diff = Date.now() - new Date(date).getTime();
  const hrs = Math.floor(diff / 3600000);
  if (hrs < 24) return `${hrs}h`;
  return `${Math.floor(hrs / 24)}d`;
}

const stateConfig = {
  open:   { color: "var(--up)",   label: "OPEN" },
  merged: { color: "var(--info)", label: "MRGD" },
  closed: { color: "var(--down)", label: "CLSD" },
};

export default function PRFeed({ prs }: { prs: PR[] }) {
  if (!prs.length) {
    return <p className="mono text-xs text-center py-4" style={{ color: "var(--ink-faint)" }}>NO RECENT PULL REQUESTS</p>;
  }

  return (
    <div>
      {prs.map((pr, i) => {
        const cfg = stateConfig[pr.state];
        return (
          <a key={i} href={pr.url} target="_blank" rel="noreferrer"
            className="flex items-baseline gap-3 py-2 transition-colors"
            style={i > 0 ? { borderTop: "1px solid var(--border)" } : undefined}
            onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.02)")}
            onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
            <span className="mono text-[9px] font-bold flex-shrink-0 w-10 tracking-wider" style={{ color: cfg.color }}>
              {cfg.label}
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-[12.5px] truncate leading-snug" style={{ color: "var(--ink)" }}>{pr.title}</p>
              <span className="mono text-[10px]" style={{ color: "var(--ink-faint)" }}>
                {pr.repo.split("/")[1] || pr.repo} #{pr.number}
              </span>
            </div>
            <span className="mono text-[10px] flex-shrink-0 tabular-nums" style={{ color: "var(--ink-faint)" }}>
              {timeAgo(pr.date)}
            </span>
          </a>
        );
      })}
    </div>
  );
}
