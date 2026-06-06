"use client";

import { useEffect, useState } from "react";
import { Trophy } from "lucide-react";

interface ScoreCardProps {
  score: number;
  grade: string;
  breakdown: Record<string, number>;
}

const gradeConfig: Record<string, { color: string; bg: string; border: string; label: string }> = {
  S: { color: "text-yellow-300", bg: "bg-yellow-500/10", border: "border-yellow-500/30", label: "Legendary" },
  A: { color: "text-violet-300", bg: "bg-violet-500/10", border: "border-violet-500/30", label: "Expert" },
  B: { color: "text-blue-300",   bg: "bg-blue-500/10",   border: "border-blue-500/30",   label: "Skilled" },
  C: { color: "text-green-300",  bg: "bg-green-500/10",  border: "border-green-500/30",  label: "Growing" },
  D: { color: "text-gray-300",   bg: "bg-gray-500/10",   border: "border-gray-500/30",   label: "Beginner" },
};

const breakdownLabels: Record<string, string> = {
  repos: "Repositories", stars: "Stars earned", contributions: "Contributions",
  streak: "Current streak", longestStreak: "Longest streak", followers: "Followers",
};

const maxValues: Record<string, number> = {
  repos: 20, stars: 25, contributions: 25, streak: 15, longestStreak: 10, followers: 5,
};

export default function ScoreCard({ score, grade, breakdown }: ScoreCardProps) {
  const [animScore, setAnimScore] = useState(0);
  const cfg = gradeConfig[grade] || gradeConfig["D"];

  useEffect(() => {
    let cur = 0;
    const interval = setInterval(() => {
      cur += 2;
      if (cur >= score) { setAnimScore(score); clearInterval(interval); }
      else setAnimScore(cur);
    }, 16);
    return () => clearInterval(interval);
  }, [score]);

  const circumference = 2 * Math.PI * 36;
  const progress = (animScore / 100) * circumference;

  return (
    <div className="space-y-4">
      {/* Score circle + grade */}
      <div className="flex items-center gap-5">
        <div className="relative w-24 h-24 flex-shrink-0">
          <svg className="w-24 h-24 -rotate-90" viewBox="0 0 80 80">
            <circle cx="40" cy="40" r="36" fill="none" stroke="#21262d" strokeWidth="6" />
            <circle
              cx="40" cy="40" r="36" fill="none"
              stroke="url(#scoreGrad)" strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={circumference - progress}
              style={{ transition: "stroke-dashoffset 0.05s linear" }}
            />
            <defs>
              <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#8b5cf6" />
                <stop offset="100%" stopColor="#3b82f6" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-xl font-bold text-white">{animScore}</span>
            <span className="text-[10px] text-gray-400">/ 100</span>
          </div>
        </div>

        <div>
          <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border ${cfg.bg} ${cfg.border} mb-2`}>
            <Trophy className={`w-4 h-4 ${cfg.color}`} />
            <span className={`text-lg font-bold ${cfg.color}`}>Grade {grade}</span>
          </div>
          <p className={`text-sm ${cfg.color} font-medium`}>{cfg.label} Developer</p>
          <p className="text-xs text-gray-500 mt-0.5">Based on your GitHub activity</p>
        </div>
      </div>

      {/* Breakdown */}
      <div className="space-y-2">
        {Object.entries(breakdown).map(([key, val]) => (
          <div key={key} className="flex items-center gap-3">
            <span className="text-xs text-gray-400 w-28 flex-shrink-0">{breakdownLabels[key]}</span>
            <div className="flex-1 h-1.5 bg-gray-800 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-violet-500 to-blue-500 transition-all duration-700"
                style={{ width: `${(val / maxValues[key]) * 100}%` }}
              />
            </div>
            <span className="text-xs text-gray-500 w-8 text-right tabular-nums">{val}/{maxValues[key]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
