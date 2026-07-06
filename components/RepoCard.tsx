"use client";

import { Star, GitFork, Lock } from "lucide-react";

interface Repo {
  name: string; description: string; stars: number; forks: number;
  language: string; url: string; updatedAt: string; isPrivate?: boolean; topics?: string[];
}

const langColors: Record<string, string> = {
  TypeScript:"#3ec3e8", JavaScript:"#e8e13e", Python:"#2ee889", Rust:"#ffb347",
  Go:"#3ec3e8", Java:"#ffb347", "C++":"#ff4d5e", C:"#76839a", CSS:"#b48cf2",
  HTML:"#ff4d5e", Ruby:"#ff4d5e", Swift:"#ffb347", Kotlin:"#b48cf2", Dart:"#3ec3e8",
};

export default function RepoCard({ repo }: { repo: Repo }) {
  const updated = new Date(repo.updatedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" });

  return (
    <a
      href={repo.url}
      target="_blank"
      rel="noreferrer"
      className="panel group flex flex-col p-4 gap-2.5 transition-colors duration-150"
      onMouseEnter={e => (e.currentTarget.style.borderColor = "rgba(46,232,137,0.45)")}
      onMouseLeave={e => (e.currentTarget.style.borderColor = "var(--border)")}
    >
      <div className="flex items-center gap-2 min-w-0">
        {repo.isPrivate && <Lock className="w-3 h-3 flex-shrink-0" style={{ color: "var(--ink-faint)" }} />}
        <h3 className="mono font-semibold truncate text-[13px] transition-colors"
          style={{ color: "var(--ink)" }}>
          {repo.name}
        </h3>
        <span className="mono text-[10px] ml-auto flex-shrink-0" style={{ color: "var(--ink-faint)" }}>
          {updated.toUpperCase()}
        </span>
      </div>

      <p className="text-xs line-clamp-2 flex-1 leading-relaxed min-h-[2rem]" style={{ color: "var(--ink-muted)" }}>
        {repo.description || "No description provided."}
      </p>

      {repo.topics && repo.topics.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {repo.topics.map((t) => (
            <span key={t} className="mono text-[9px] px-1.5 py-0.5 uppercase tracking-wider"
              style={{ color: "var(--info)", border: "1px solid rgba(62,195,232,0.25)" }}>
              {t}
            </span>
          ))}
        </div>
      )}

      <div className="mono flex items-center gap-4 text-[10.5px] pt-2" style={{ color: "var(--ink-muted)", borderTop: "1px solid var(--border)" }}>
        {repo.language && (
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2" style={{ backgroundColor: langColors[repo.language] || "var(--up)" }} />
            {repo.language}
          </span>
        )}
        <span className="flex items-center gap-1"><Star className="w-3 h-3" />{repo.stars}</span>
        <span className="flex items-center gap-1"><GitFork className="w-3 h-3" />{repo.forks}</span>
        <span className="ml-auto transition-colors" style={{ color: "var(--ink-faint)" }}>
          ↗
        </span>
      </div>
    </a>
  );
}
