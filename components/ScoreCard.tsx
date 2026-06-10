"use client";

import { useEffect, useState } from "react";
import { Trophy } from "lucide-react";

interface ScoreCardProps {
  score: number;
  grade: string;
  breakdown: Record<string, number>;
}

const gradeConfig: Record<string, { color: string; bg: string; border: string; label: string }> = {
  S: { color: "#fbbf24", bg: "rgba(251,191,36,0.1)",  border: "rgba(251,191,36,0.3)",  label: "Legendary" },
  A: { color: "#fb923c", bg: "rgba(251,146,60,0.1)",  border: "rgba(251,146,60,0.3)",  label: "Expert"    },
  B: { color: "#22d3ee", bg: "rgba(34,211,238,0.1)",  border: "rgba(34,211,238,0.3)",  label: "Skilled"   },
  C: { color: "#a3e635", bg: "rgba(163,230,53,0.1)",  border: "rgba(163,230,53,0.3)",  label: "Growing"   },
  D: { color: "#7a8fa8", bg: "rgba(122,143,168,0.1)", border: "rgba(122,143,168,0.3)", label: "Beginner"  },
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
      <div className="flex items-center gap-5">
        <div className="relative w-24 h-24 flex-shrink-0">
          <svg className="w-24 h-24 -rotate-90" viewBox="0 0 80 80">
            <circle cx="40" cy="40" r="36" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="6" />
            <circle
              cx="40" cy="40" r="36" fill="none"
              stroke="url(#scoreGrad)" strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={circumference - progress}
              style={{ transition: "stroke-dashoffset 0.05s linear", filter: "drop-shadow(0 0 6px rgba(251,146,60,0.5))" }}
            />
            <defs>
              <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#fb923c" />
                <stop offset="100%" stopColor="#22d3ee" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-xl font-bold text-white">{animScore}</span>
            <span className="text-[10px]" style={{ color: "#4a6080" }}>/ 100</span>
          </div>
        </div>

        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border mb-2"
            style={{ background: cfg.bg, borderColor: cfg.border }}>
            <Trophy className="w-4 h-4" style={{ color: cfg.color }} />
            <span className="text-lg font-bold" style={{ color: cfg.color }}>Grade {grade}</span>
          </div>
          <p className="text-sm font-medium" style={{ color: cfg.color }}>{cfg.label} Developer</p>
          <p className="text-xs mt-0.5" style={{ color: "#3a5070" }}>Based on your GitHub activity</p>
        </div>
      </div>

      <div className="space-y-2">
        {Object.entries(breakdown).map(([key, val]) => (
          <div key={key} className="flex items-center gap-3">
            <span className="text-xs w-28 flex-shrink-0" style={{ color: "#4a6080" }}>{breakdownLabels[key]}</span>
            <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: "var(--border)" }}>
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{
                  width: `${(val / maxValues[key]) * 100}%`,
                  background: "linear-gradient(to right, #fb923c, #22d3ee)",
                }}
              />
            </div>
            <span className="text-xs w-8 text-right tabular-nums" style={{ color: "#3a5070" }}>{val}/{maxValues[key]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
