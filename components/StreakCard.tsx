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
      {/* Streak numbers */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-orange-500/10 border border-orange-500/20 rounded-xl p-4 text-center">
          <div className="flex items-center justify-center gap-1.5 mb-1">
            <Flame className="w-4 h-4 text-orange-400" />
            <span className="text-xs text-gray-400">Current Streak</span>
          </div>
          <p className="text-3xl font-bold text-orange-400">{current}</p>
          <p className="text-xs text-gray-500 mt-0.5">days</p>
        </div>
        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4 text-center">
          <div className="flex items-center justify-center gap-1.5 mb-1">
            <Zap className="w-4 h-4 text-yellow-400" />
            <span className="text-xs text-gray-400">Longest Streak</span>
          </div>
          <p className="text-3xl font-bold text-yellow-400">{longest}</p>
          <p className="text-xs text-gray-500 mt-0.5">days</p>
        </div>
      </div>

      {/* Activity by day */}
      <div>
        <p className="text-xs text-gray-500 mb-2">Activity by day of week</p>
        <div className="flex items-end gap-1.5 h-16">
          {DAYS.map((day, i) => (
            <div key={day} className="flex-1 flex flex-col items-center gap-1">
              <div
                className="w-full rounded-t-sm bg-violet-500/60 transition-all duration-500"
                style={{ height: `${(activityByDay[i] / max) * 48}px`, minHeight: "2px" }}
              />
              <span className="text-[10px] text-gray-500">{day.slice(0,1)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
