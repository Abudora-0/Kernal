"use client";

import { useState } from "react";

interface Day { date: string; contributionCount: number; color: string; }
interface Week { contributionDays: Day[]; }

const MONTHS = ["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"];

/* green signal ramp on terminal black */
function getColor(count: number) {
  if (count === 0) return "#11161c";
  if (count <= 2) return "rgba(46,232,137,0.22)";
  if (count <= 5) return "rgba(46,232,137,0.45)";
  if (count <= 9) return "rgba(46,232,137,0.7)";
  return "#2ee889";
}

export default function ContributionGraph({ weeks }: { weeks: Week[] }) {
  const [tooltip, setTooltip] = useState<{ text: string; x: number; y: number } | null>(null);

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
              <div key={wi} className="mono w-3 text-[8.5px] truncate" style={{ color: "var(--ink-faint)" }}>
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
                  className="w-3 h-3 cursor-pointer transition-transform duration-100 hover:scale-125"
                  style={{ backgroundColor: getColor(day.contributionCount) }}
                  onMouseEnter={(e) => {
                    const rect = (e.target as HTMLElement).getBoundingClientRect();
                    setTooltip({
                      text: `${day.contributionCount} contributions · ${new Date(day.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`,
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
            className="mono fixed z-50 px-2 py-1 text-[10px] pointer-events-none whitespace-nowrap"
            style={{ left: tooltip.x, top: tooltip.y, background: "var(--bg-elevated)", border: "1px solid var(--border-muted)", color: "var(--ink)" }}
          >
            {tooltip.text}
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="mono flex items-center gap-1.5 mt-3 text-[9.5px]" style={{ color: "var(--ink-faint)" }}>
        <span>LOW</span>
        {[0, 2, 5, 9, 12].map((n) => (
          <div key={n} className="w-3 h-3" style={{ backgroundColor: getColor(n) }} />
        ))}
        <span>HIGH</span>
      </div>
    </div>
  );
}
