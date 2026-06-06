"use client";

import { useState } from "react";

interface Day { date: string; contributionCount: number; color: string; }
interface Week { contributionDays: Day[]; }

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

function getColor(count: number) {
  if (count === 0) return "#161b22";
  if (count <= 2) return "#0e4429";
  if (count <= 5) return "#006d32";
  if (count <= 9) return "#26a641";
  return "#39d353";
}

export default function ContributionGraph({ weeks }: { weeks: Week[] }) {
  const [tooltip, setTooltip] = useState<{ text: string; x: number; y: number } | null>(null);

  // Build month labels
  const monthLabels: { label: string; index: number }[] = [];
  let lastMonth = -1;
  weeks.forEach((week, wi) => {
    const firstDay = week.contributionDays[0];
    if (firstDay) {
      const m = new Date(firstDay.date).getMonth();
      if (m !== lastMonth) { monthLabels.push({ label: MONTHS[m], index: wi }); lastMonth = m; }
    }
  });

  return (
    <div className="overflow-x-auto">
      <div className="relative min-w-max">
        {/* Month labels */}
        <div className="flex gap-1 mb-1 pl-0">
          {weeks.map((_, wi) => {
            const lbl = monthLabels.find(m => m.index === wi);
            return (
              <div key={wi} className="w-3 text-[10px] text-gray-500 truncate">
                {lbl ? lbl.label : ""}
              </div>
            );
          })}
        </div>

        {/* Grid */}
        <div className="flex gap-1">
          {weeks.map((week, wi) => (
            <div key={wi} className="flex flex-col gap-1">
              {week.contributionDays.map((day, di) => (
                <div
                  key={di}
                  className="w-3 h-3 rounded-sm cursor-pointer transition-all duration-150 hover:scale-125 hover:ring-1 hover:ring-white/20"
                  style={{ backgroundColor: getColor(day.contributionCount) }}
                  onMouseEnter={(e) => {
                    const rect = (e.target as HTMLElement).getBoundingClientRect();
                    setTooltip({
                      text: `${day.contributionCount} contributions on ${new Date(day.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`,
                      x: rect.left,
                      y: rect.top - 36,
                    });
                  }}
                  onMouseLeave={() => setTooltip(null)}
                />
              ))}
            </div>
          ))}
        </div>

        {/* Tooltip */}
        {tooltip && (
          <div
            className="fixed z-50 px-2 py-1 bg-gray-900 border border-gray-700 rounded-lg text-xs text-white pointer-events-none whitespace-nowrap"
            style={{ left: tooltip.x, top: tooltip.y }}
          >
            {tooltip.text}
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-1.5 mt-3 text-xs text-gray-500">
        <span>Less</span>
        {[0, 2, 5, 9, 12].map((n) => (
          <div key={n} className="w-3 h-3 rounded-sm" style={{ backgroundColor: getColor(n) }} />
        ))}
        <span>More</span>
      </div>
    </div>
  );
}
