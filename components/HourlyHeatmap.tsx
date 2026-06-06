"use client";

import { useState } from "react";

export default function HourlyHeatmap({ activityByHour }: { activityByHour: number[] }) {
  const [hoveredHour, setHoveredHour] = useState<number | null>(null);
  const max = Math.max(...activityByHour, 1);

  const getColor = (val: number) => {
    const ratio = val / max;
    if (ratio === 0) return "#161b22";
    if (ratio < 0.25) return "#0e4429";
    if (ratio < 0.5)  return "#006d32";
    if (ratio < 0.75) return "#26a641";
    return "#39d353";
  };

  const formatHour = (h: number) => {
    if (h === 0) return "12am";
    if (h === 12) return "12pm";
    return h < 12 ? `${h}am` : `${h - 12}pm`;
  };

  const peakHour = activityByHour.indexOf(Math.max(...activityByHour));
  const period = peakHour < 6 ? "🌙 Night owl" : peakHour < 12 ? "🌅 Morning coder"
               : peakHour < 18 ? "☀️ Afternoon dev" : "🌆 Evening hacker";

  return (
    <div className="space-y-3">
      <div className="flex items-end gap-1">
        {activityByHour.map((val, h) => (
          <div
            key={h}
            className="relative flex-1 flex flex-col items-center gap-1 cursor-pointer group"
            onMouseEnter={() => setHoveredHour(h)}
            onMouseLeave={() => setHoveredHour(null)}
          >
            <div
              className="w-full rounded-sm transition-all duration-150 group-hover:ring-1 group-hover:ring-white/30"
              style={{
                height: `${Math.max((val / max) * 60, 3)}px`,
                backgroundColor: getColor(val),
              }}
            />
            {hoveredHour === h && (
              <div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 bg-gray-900 border border-gray-700 rounded-lg px-2 py-1 text-xs text-white whitespace-nowrap z-10 pointer-events-none">
                {formatHour(h)}: {val} events
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Hour labels */}
      <div className="flex justify-between text-[10px] text-gray-600">
        <span>12am</span>
        <span>6am</span>
        <span>12pm</span>
        <span>6pm</span>
        <span>11pm</span>
      </div>

      {/* Peak info */}
      <div className="flex items-center justify-between bg-white/5 rounded-lg px-3 py-2 text-xs">
        <span className="text-gray-400">{period}</span>
        <span className="text-gray-300">Peak: <span className="text-violet-400 font-medium">{formatHour(peakHour)}</span></span>
      </div>
    </div>
  );
}
