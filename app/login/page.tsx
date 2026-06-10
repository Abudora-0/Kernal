"use client";

import { signIn } from "next-auth/react";
import { BarChart2, GitCommit, Star, Zap } from "lucide-react";

const features = [
  { icon: <BarChart2 className="w-4 h-4" />, text: "Contribution heatmap" },
  { icon: <GitCommit className="w-4 h-4" />, text: "Commit timeline" },
  { icon: <Star className="w-4 h-4" />, text: "Top repositories" },
  { icon: <Zap className="w-4 h-4" />, text: "Coding streak tracker" },
];

function Logo({ size = 44 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="lg" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#fb923c"/>
          <stop offset="100%" stopColor="#22d3ee"/>
        </linearGradient>
      </defs>
      <rect x="6" y="6" width="88" height="88" rx="22" fill="url(#lg)"/>
      <polyline points="10,50 28,50 36,20 46,74 55,34 63,50 90,50"
        stroke="white" strokeWidth="6.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{ background: "var(--bg-base)" }}>
      {/* Ambient glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(251,146,60,0.08), transparent)" }} />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full blur-3xl pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(34,211,238,0.07), transparent)" }} />

      <div className="relative z-10 w-full max-w-md px-6 animate-fade-in-up">
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <Logo size={44} />
          <span className="text-2xl font-bold text-white tracking-tight">DevPulse</span>
        </div>

        {/* Card */}
        <div className="glass rounded-2xl p-8 space-y-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white">Welcome to DevPulse</h1>
            <p className="text-sm mt-2" style={{ color: "#7a8fa8" }}>Your personal GitHub activity dashboard</p>
          </div>

          {/* Feature grid */}
          <div className="grid grid-cols-2 gap-2">
            {features.map((f, i) => (
              <div key={i} className="flex items-center gap-2 text-sm rounded-lg px-3 py-2"
                style={{ background: "rgba(255,255,255,0.04)", color: "#7a8fa8" }}>
                <span style={{ color: "#fb923c" }}>{f.icon}</span>
                {f.text}
              </div>
            ))}
          </div>

          {/* GitHub sign-in button */}
          <button
            onClick={() => signIn("github", { callbackUrl: "/dashboard" })}
            className="w-full flex items-center justify-center gap-3 font-semibold py-3 px-4 rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-lg text-white"
            style={{
              background: "linear-gradient(135deg, #fb923c, #f59e0b 50%, #22d3ee)",
              boxShadow: "0 4px 20px rgba(251,146,60,0.3)",
            }}
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
            </svg>
            Continue with GitHub
          </button>

          <p className="text-xs text-center" style={{ color: "#3a5070" }}>
            Read-only access to your public GitHub data
          </p>
        </div>
      </div>
    </div>
  );
}
