"use client";

import { useState } from "react";

export default function HourlyHeatmap({ activityByHour }: { activityByHour: number[] }) {
  const [hoveredHour, setHoveredHour] = useState<number | null>(null);
  const max = Math.max(...activityByHour, 1);

  const getColor = (val: number) => {
    const ratio = val / max;
    if (ratio === 0) return "var(--bg-elevated)";
    if (ratio < 0.25) return "rgba(62,195,232,0.3)";
    if (ratio < 0.5)  return "rgba(62,195,232,0.55)";
    if (ratio < 0.75) return "rgba(62,195,232,0.8)";
    return "var(--info)";
  };

  const formatHour = (h: number) => {
    if (h === 0) return "12am";
    if (h === 12) return "12pm";
    return h < 12 ? `${h}am` : `${h - 12}pm`;
  };

  const peakHour = activityByHour.indexOf(Math.max(...activityByHour));
  const period = peakHour < 6 ? "NIGHT OWL" : peakHour < 12 ? "MORNING CODER"
               : peakHour < 18 ? "AFTERNOON DEV" : "EVENING HACKER";

  return (
    <div className="space-y-3">
      <div className="flex items-end gap-[3px]">
        {activityByHour.map((val, h) => (
          <div key={h}
            className="relative flex-1 flex flex-col items-center cursor-pointer"
            onMouseEnter={() => setHoveredHour(h)}
            onMouseLeave={() => setHoveredHour(null)}>
            <div
              className="w-full transition-all duration-150"
              style={{
                height: `${Math.max((val / max) * 56, 2)}px`,
                backgroundColor: hoveredHour === h ? "var(--up)" : getColor(val),
              }}
            />
            {hoveredHour === h && (
              <div className="mono absolute bottom-full mb-1.5 left-1/2 -translate-x-1/2 px-2 py-1 text-[10px] whitespace-nowrap z-10 pointer-events-none"
                style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-muted)", color: "var(--ink)" }}>
                {formatHour(h)} · {val} EV
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mono flex justify-between text-[9px]" style={{ color: "var(--ink-faint)" }}>
        <span>00</span><span>06</span><span>12</span><span>18</span><span>23</span>
      </div>

      <div className="flex items-baseline text-[11px] pt-1" style={{ borderTop: "1px solid var(--border)" }}>
        <span className="dlabel pt-2">{period}</span>
        <span className="leader" />
        <span className="mono pt-2" style={{ color: "var(--ink-muted)" }}>
          PEAK <span style={{ color: "var(--info)" }}>{formatHour(peakHour).toUpperCase()}</span>
        </span>
      </div>
    </div>
  );
}
