"use client";

import { signIn } from "next-auth/react";

function Logo({ size = 40 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="1" y="1" width="30" height="30" rx="7" fill="#0c1014" stroke="#2ee889" strokeWidth="1.5" />
      <circle cx="6.5" cy="6.5" r="1.4" fill="#2ee889" />
      <rect x="6" y="19" width="4" height="7" rx="0.6" fill="#1b8a58" />
      <rect x="13" y="13" width="4" height="13" rx="0.6" fill="#2ee889" />
      <rect x="20" y="6" width="4" height="20" rx="0.6" fill="#5eead4" />
    </svg>
  );
}

function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span className={`mono font-bold text-[16px] tracking-[0.06em] ${className}`} style={{ color: "var(--ink)" }}>
      {"KERNAL".split("").map((ch, i) => (
        <span key={i} className="wordmark-letter" style={{ animationDelay: `${i * 0.18}s` }}>{ch}</span>
      ))}
      <span className="wordmark-cursor" style={{ color: "var(--up)" }}>_</span>
    </span>
  );
}

const feed = [
  ["CONTRIB.VOL",  "52-week contribution heatmap"],
  ["COMMIT.TAPE",  "live commit + PR ledger"],
  ["LANG.ALLOC",   "language allocation breakdown"],
  ["DEV.INDEX",    "S–D developer score & grade"],
];

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "var(--bg-base)" }}>
      <div className="w-full max-w-md animate-fade-in-up">

        {/* terminal window */}
        <div className="panel">
          <div className="panel-hd">
            <span className="tick" />
            <span className="panel-title">Kernal Terminal · Session Login</span>
            <span className="mono text-[10px] ml-auto flex items-center gap-1.5" style={{ color: "var(--up)" }}>
              <span className="led led-up led-pulse" /> ONLINE
            </span>
          </div>

          <div className="p-7 space-y-7">
            <div className="flex items-center gap-3">
              <Logo />
              <div>
                <Wordmark className="block" />
                <p className="mono text-[10px] tracking-[0.15em] mt-0.5" style={{ color: "var(--ink-faint)" }}>
                  DEVELOPER DATA TERMINAL v2
                </p>
              </div>
            </div>

            <p className="text-sm leading-relaxed" style={{ color: "var(--ink-muted)" }}>
              A market terminal for your GitHub activity: contributions, streaks and
              repositories rendered as live market data.
            </p>

            {/* feed listing */}
            <div style={{ border: "1px solid var(--border)" }}>
              {feed.map(([code, desc], i) => (
                <div key={code} className="flex items-baseline gap-3 px-3 py-2"
                  style={i > 0 ? { borderTop: "1px solid var(--border)" } : undefined}>
                  <span className="mono text-[10px] font-bold w-24 flex-shrink-0" style={{ color: "var(--up)" }}>
                    {code}
                  </span>
                  <span className="text-[12px]" style={{ color: "var(--ink-muted)" }}>{desc}</span>
                </div>
              ))}
            </div>

            {/* GitHub sign-in */}
            <button
              onClick={() => signIn("github", { callbackUrl: "/dashboard" })}
              className="tbtn tbtn-primary w-full justify-center py-3 text-[12px] tracking-[0.14em]"
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
              </svg>
              AUTHENTICATE · GITHUB
            </button>

            <p className="mono text-[10px] text-center tracking-[0.1em]" style={{ color: "var(--ink-faint)" }}>
              READ-ONLY ACCESS · PUBLIC DATA ONLY
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
