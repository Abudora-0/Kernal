"use client";

import { Flame, Zap } from "lucide-react";

interface StreakCardProps {
  current: number;
  longest: number;
  activityByDay: number[];
}

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function StreakCard({ current, longest, activityByDay }: StreakCardProps) {
  const max = Math.max(...activityByDay, 1);

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-xl p-4 text-center"
          style={{ background: "rgba(251,146,60,0.08)", border: "1px solid rgba(251,146,60,0.2)" }}>
          <div className="flex items-center justify-center gap-1.5 mb-1">
            <Flame className="w-4 h-4 text-orange-400" />
            <span className="text-xs" style={{ color: "#4a6080" }}>Current Streak</span>
          </div>
          <p className="text-3xl font-bold text-orange-400">{current}</p>
          <p className="text-xs mt-0.5" style={{ color: "#3a5070" }}>days</p>
        </div>
        <div className="rounded-xl p-4 text-center"
          style={{ background: "rgba(251,191,36,0.08)", border: "1px solid rgba(251,191,36,0.2)" }}>
          <div className="flex items-center justify-center gap-1.5 mb-1">
            <Zap className="w-4 h-4 text-yellow-400" />
            <span className="text-xs" style={{ color: "#4a6080" }}>Longest Streak</span>
          </div>
          <p className="text-3xl font-bold text-yellow-400">{longest}</p>
          <p className="text-xs mt-0.5" style={{ color: "#3a5070" }}>days</p>
        </div>
      </div>

      <div>
        <p className="text-xs mb-2" style={{ color: "#3a5070" }}>Activity by day of week</p>
        <div className="flex items-end gap-1.5 h-16">
          {DAYS.map((day, i) => (
            <div key={day} className="flex-1 flex flex-col items-center gap-1">
              <div
                className="w-full rounded-t-sm transition-all duration-500"
                style={{
                  height: `${(activityByDay[i] / max) * 48}px`,
                  minHeight: "2px",
                  background: "linear-gradient(to top, #fb923c, #22d3ee)",
                  opacity: 0.7,
                }}
              />
              <span className="text-[10px]" style={{ color: "#3a5070" }}>{day.slice(0, 1)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
