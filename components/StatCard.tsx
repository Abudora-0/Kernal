"use client";

import { useEffect, useState } from "react";

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: number;
  color: "violet" | "yellow" | "green" | "blue" | "orange";
  suffix?: string;
  delay?: number;
}

const colorMap = {
  violet: { bg: "bg-violet-500/10", border: "border-violet-500/20", glow: "hover:shadow-violet-500/20", icon: "bg-violet-500/20" },
  yellow: { bg: "bg-yellow-500/10", border: "border-yellow-500/20", glow: "hover:shadow-yellow-500/20", icon: "bg-yellow-500/20" },
  green:  { bg: "bg-emerald-500/10", border: "border-emerald-500/20", glow: "hover:shadow-emerald-500/20", icon: "bg-emerald-500/20" },
  blue:   { bg: "bg-blue-500/10", border: "border-blue-500/20", glow: "hover:shadow-blue-500/20", icon: "bg-blue-500/20" },
  orange: { bg: "bg-orange-500/10", border: "border-orange-500/20", glow: "hover:shadow-orange-500/20", icon: "bg-orange-500/20" },
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
    <div className={`${c.bg} ${c.border} border rounded-2xl p-5 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg ${c.glow} cursor-default`}>
      <div className={`w-9 h-9 ${c.icon} rounded-xl flex items-center justify-center mb-3`}>
        {icon}
      </div>
      <p className="text-2xl font-bold text-white tabular-nums">
        {display.toLocaleString()}{suffix}
      </p>
      <p className="text-sm text-gray-400 mt-1">{label}</p>
    </div>
  );
}
