"use client";

interface StreakCardProps {
  current: number;
  longest: number;
  activityByDay: number[];
}

const DAYS = ["S", "M", "T", "W", "T", "F", "S"];

export default function StreakCard({ current, longest, activityByDay }: StreakCardProps) {
  const max = Math.max(...activityByDay, 1);

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-3">
        <div className="p-3" style={{ border: "1px solid var(--border)" }}>
          <p className="dlabel mb-1.5">CURRENT</p>
          <p className="mono text-[28px] font-semibold leading-none" style={{ color: "var(--up)" }}>
            {current}
            <span className="text-[11px] ml-1" style={{ color: "var(--ink-faint)" }}>D</span>
          </p>
        </div>
        <div className="p-3" style={{ border: "1px solid var(--border)" }}>
          <p className="dlabel mb-1.5">RECORD</p>
          <p className="mono text-[28px] font-semibold leading-none" style={{ color: "var(--warn)" }}>
            {longest}
            <span className="text-[11px] ml-1" style={{ color: "var(--ink-faint)" }}>D</span>
          </p>
        </div>
      </div>

      <div>
        <p className="dlabel mb-2">VOLUME BY WEEKDAY</p>
        <div className="flex items-end gap-1 h-14">
          {DAYS.map((day, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <div
                className="w-full transition-all duration-500"
                style={{
                  height: `${(activityByDay[i] / max) * 44}px`,
                  minHeight: "2px",
                  background: (activityByDay[i] === Math.max(...activityByDay)) ? "var(--up)" : "rgba(46,232,137,0.35)",
                }}
              />
              <span className="mono text-[9px]" style={{ color: "var(--ink-faint)" }}>{day}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
