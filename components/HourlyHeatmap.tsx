"use client";

import { useState } from "react";

export default function HourlyHeatmap({ activityByHour }: { activityByHour: number[] }) {
  const [hoveredHour, setHoveredHour] = useState<number | null>(null);
  const max = Math.max(...activityByHour, 1);

  const getColor = (val: number) => {
    const ratio = val / max;
    if (ratio === 0) return "var(--border)";
    if (ratio < 0.25) return "rgba(251,146,60,0.25)";
    if (ratio < 0.5)  return "rgba(251,146,60,0.5)";
    if (ratio < 0.75) return "rgba(251,146,60,0.75)";
    return "#fb923c";
  };

  const formatHour = (h: number) => {
    if (h === 0) return "12am";
    if (h === 12) return "12pm";
    return h < 12 ? `${h}am` : `${h - 12}pm`;
  };

  const peakHour = activityByHour.indexOf(Math.max(...activityByHour));
  const period = peakHour < 6 ? "Night owl" : peakHour < 12 ? "Morning coder"
               : peakHour < 18 ? "Afternoon dev" : "Evening hacker";

  return (
    <div className="space-y-3">
      <div className="flex items-end gap-1">
        {activityByHour.map((val, h) => (
          <div key={h}
            className="relative flex-1 flex flex-col items-center gap-1 cursor-pointer"
            onMouseEnter={() => setHoveredHour(h)}
            onMouseLeave={() => setHoveredHour(null)}>
            <div
              className="w-full rounded-sm transition-all duration-150"
              style={{
                height: `${Math.max((val / max) * 60, 3)}px`,
                backgroundColor: getColor(val),
                boxShadow: hoveredHour === h ? "0 0 8px rgba(251,146,60,0.5)" : "none",
              }}
            />
            {hoveredHour === h && (
              <div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 rounded-lg px-2 py-1 text-xs text-white whitespace-nowrap z-10 pointer-events-none"
                style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-muted)" }}>
                {formatHour(h)}: {val} events
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="flex justify-between text-[10px]" style={{ color: "#2a3a50" }}>
        <span>12am</span><span>6am</span><span>12pm</span><span>6pm</span><span>11pm</span>
      </div>

      <div className="flex items-center justify-between rounded-lg px-3 py-2 text-xs"
        style={{ background: "rgba(255,255,255,0.03)", border: "1px solid var(--border)" }}>
        <span style={{ color: "#4a6080" }}>{period}</span>
        <span style={{ color: "#7a8fa8" }}>Peak: <span style={{ color: "#fb923c" }} className="font-medium">{formatHour(peakHour)}</span></span>
      </div>
    </div>
  );
}
