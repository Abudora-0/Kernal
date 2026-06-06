import { Star, GitFork, Lock, ExternalLink } from "lucide-react";

interface Repo {
  name: string; description: string; stars: number; forks: number;
  language: string; url: string; updatedAt: string; isPrivate?: boolean; topics?: string[];
}

const langColors: Record<string, string> = {
  TypeScript:"#3178c6", JavaScript:"#f7df1e", Python:"#3572A5", Rust:"#dea584",
  Go:"#00ADD8", Java:"#b07219", "C++":"#f34b7d", C:"#555555", CSS:"#563d7c",
  HTML:"#e34c26", Ruby:"#701516", Swift:"#fa7343", Kotlin:"#A97BFF", Dart:"#00B4AB",
};

export default function RepoCard({ repo }: { repo: Repo }) {
  const updated = new Date(repo.updatedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" });

  return (
    <a
      href={repo.url}
      target="_blank"
      rel="noreferrer"
      className="group flex flex-col bg-[#0d1117] border border-[#21262d] hover:border-violet-500/40 rounded-xl p-5 space-y-3 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-violet-500/10"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          {repo.isPrivate && <Lock className="w-3.5 h-3.5 text-gray-500 flex-shrink-0" />}
          <h3 className="font-semibold text-white group-hover:text-violet-400 transition-colors truncate text-sm">
            {repo.name}
          </h3>
        </div>
        <ExternalLink className="w-3.5 h-3.5 text-gray-600 group-hover:text-violet-400 transition-colors flex-shrink-0" />
      </div>

      <p className="text-xs text-gray-400 line-clamp-2 flex-1 leading-relaxed min-h-[2rem]">
        {repo.description || "No description provided."}
      </p>

      {repo.topics && repo.topics.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {repo.topics.map((t) => (
            <span key={t} className="text-[10px] px-2 py-0.5 bg-violet-500/10 text-violet-300 rounded-full border border-violet-500/20">
              {t}
            </span>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between text-xs text-gray-500 pt-1 border-t border-[#21262d]">
        <div className="flex items-center gap-3">
          {repo.language && (
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: langColors[repo.language] || "#8b5cf6" }} />
              <span className="text-gray-400">{repo.language}</span>
            </span>
          )}
          <span className="flex items-center gap-1">
            <Star className="w-3 h-3" />
            {repo.stars}
          </span>
          <span className="flex items-center gap-1">
            <GitFork className="w-3 h-3" />
            {repo.forks}
          </span>
        </div>
        <span>{updated}</span>
      </div>
    </a>
  );
}
