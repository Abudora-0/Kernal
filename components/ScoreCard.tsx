"use client";

import { useEffect, useState } from "react";

interface ScoreCardProps {
  score: number;
  grade: string;
  breakdown: Record<string, number>;
}

const gradeConfig: Record<string, { color: string; label: string }> = {
  S: { color: "var(--warn)", label: "LEGENDARY" },
  A: { color: "var(--up)",   label: "EXPERT"    },
  B: { color: "var(--info)", label: "SKILLED"   },
  C: { color: "var(--info)", label: "GROWING"   },
  D: { color: "var(--ink-muted)", label: "BEGINNER" },
};

const breakdownLabels: Record<string, string> = {
  repos: "REPOS", stars: "STARS", contributions: "CONTRIB",
  streak: "STREAK", longestStreak: "MAX STRK", followers: "FOLLOWERS",
};

const maxValues: Record<string, number> = {
  repos: 20, stars: 25, contributions: 25, streak: 15, longestStreak: 10, followers: 5,
};

const SEGMENTS = 16;

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

  const lit = Math.round((animScore / 100) * SEGMENTS);

  return (
    <div className="space-y-5">
      {/* index readout */}
      <div className="flex items-end justify-between">
        <div>
          <p className="dlabel mb-1">DEV INDEX</p>
          <div className="flex items-baseline gap-2">
            <span className="mono font-bold leading-none" style={{ fontSize: 42, color: cfg.color }}>
              {animScore}
            </span>
            <span className="mono text-[11px]" style={{ color: "var(--ink-faint)" }}>/100</span>
          </div>
        </div>
        <div className="text-right">
          <span
            className="mono inline-block px-2.5 py-1 text-[16px] font-bold leading-none"
            style={{ border: `1px solid ${cfg.color}`, color: cfg.color }}
          >
            {grade}
          </span>
          <p className="dlabel mt-1.5" style={{ color: cfg.color }}>{cfg.label}</p>
        </div>
      </div>

      {/* segmented gauge */}
      <div className="flex gap-[3px]">
        {Array.from({ length: SEGMENTS }).map((_, i) => (
          <div
            key={i}
            className="h-2 flex-1 transition-colors duration-75"
            style={
              i < lit
                ? { background: cfg.color }
                : { background: "var(--bg-elevated)", border: "1px solid var(--border)" }
            }
          />
        ))}
      </div>

      {/* breakdown table */}
      <div className="space-y-1.5 pt-1">
        {Object.entries(breakdown).map(([key, val]) => (
          <div key={key} className="flex items-baseline text-[11px]">
            <span className="dlabel w-20 flex-shrink-0">{breakdownLabels[key] ?? key.toUpperCase()}</span>
            <span className="leader" />
            <span className="mono" style={{ color: "var(--ink)" }}>
              {val}
              <span style={{ color: "var(--ink-faint)" }}>/{maxValues[key]}</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
