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

const colorMap = {
  orange: { bg: "rgba(251,146,60,0.08)",  border: "rgba(251,146,60,0.2)",  icon: "rgba(251,146,60,0.15)",  glow: "rgba(251,146,60,0.15)" },
  yellow: { bg: "rgba(251,191,36,0.08)",  border: "rgba(251,191,36,0.2)",  icon: "rgba(251,191,36,0.15)",  glow: "rgba(251,191,36,0.15)" },
  cyan:   { bg: "rgba(34,211,238,0.08)",  border: "rgba(34,211,238,0.2)",  icon: "rgba(34,211,238,0.15)",  glow: "rgba(34,211,238,0.15)" },
  lime:   { bg: "rgba(163,230,53,0.08)",  border: "rgba(163,230,53,0.2)",  icon: "rgba(163,230,53,0.15)",  glow: "rgba(163,230,53,0.15)" },
};

export default function StatCard({ icon, label, value, color, suffix = "", delay = 0 }: StatCardProps) {
  const [display, setDisplay] = useState(0);
  const c = colorMap[color];

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
      className="rounded-2xl p-5 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg cursor-default"
      style={{ background: c.bg, border: `1px solid ${c.border}` }}
      onMouseEnter={e => (e.currentTarget.style.boxShadow = `0 8px 24px ${c.glow}`)}
      onMouseLeave={e => (e.currentTarget.style.boxShadow = "none")}
    >
      <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-3"
        style={{ background: c.icon }}>
        {icon}
      </div>
      <p className="text-2xl font-bold text-white tabular-nums">
        {display.toLocaleString()}{suffix}
      </p>
      <p className="text-sm mt-1" style={{ color: "#4a6080" }}>{label}</p>
    </div>
  );
}
