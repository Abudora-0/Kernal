"use client";

import { useEffect, useState } from "react";

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: number;
  color: "orange" | "yellow" | "cyan" | "lime";
  suffix?: string;
  delay?: number;
}

/* signal color per metric — terminal quote-tile style */
const colorMap = {
  orange: "var(--warn)",
  yellow: "var(--warn)",
  cyan:   "var(--info)",
  lime:   "var(--up)",
};

export default function StatCard({ label, value, color, suffix = "", delay = 0 }: StatCardProps) {
  const [display, setDisplay] = useState(0);
  const accent = colorMap[color];

  useEffect(() => {
    const duration = 800;
    const steps = 30;
    const increment = value / steps;
    let current = 0;
    const timer = setTimeout(() => {
      const interval = setInterval(() => {
        current += increment;
        if (current >= value) { setDisplay(value); clearInterval(interval); }
        else setDisplay(Math.floor(current));
      }, duration / steps);
      return () => clearInterval(interval);
    }, delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return (
    <div
      className="panel p-4 transition-colors duration-200 cursor-default group"
      onMouseEnter={e => (e.currentTarget.style.borderColor = "var(--border-muted)")}
      onMouseLeave={e => (e.currentTarget.style.borderColor = "var(--border)")}
    >
      <div className="flex items-center gap-2 mb-2.5">
        <span style={{ width: 3, height: 10, background: accent, display: "inline-block" }} />
        <span className="dlabel">{label}</span>
      </div>
      <div className="flex items-baseline gap-1.5">
        <p className="mono text-[26px] font-semibold leading-none" style={{ color: "var(--ink)" }}>
          {display.toLocaleString()}{suffix}
        </p>
        <span className="mono text-[11px]" style={{ color: accent }}>▲</span>
      </div>
    </div>
  );
}
