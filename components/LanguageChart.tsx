"use client";

const COLORS = ["#2ee889", "#3ec3e8", "#ffb347", "#b48cf2", "#ff4d5e", "#e8e13e"];

export default function LanguageChart({ languages }: { languages: { name: string; count: number }[] }) {
  const total = languages.reduce((a, l) => a + l.count, 0);

  return (
    <div className="space-y-4">
      {/* allocation bar */}
      <div className="flex h-2.5 overflow-hidden gap-[2px]">
        {languages.map((lang, i) => (
          <div
            key={lang.name}
            className="h-full transition-all duration-500"
            style={{ width: `${(lang.count / total) * 100}%`, backgroundColor: COLORS[i % COLORS.length] }}
            title={`${lang.name}: ${Math.round((lang.count / total) * 100)}%`}
          />
        ))}
      </div>

      {/* holdings table */}
      <div className="space-y-1.5">
        {languages.map((lang, i) => (
          <div key={lang.name} className="flex items-baseline text-[11.5px]">
            <span className="flex items-center gap-2 flex-shrink-0">
              <span className="w-2 h-2 flex-shrink-0" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
              <span className="mono" style={{ color: "var(--ink)" }}>{lang.name}</span>
            </span>
            <span className="leader" />
            <span className="mono" style={{ color: "var(--ink-muted)" }}>
              {Math.round((lang.count / total) * 100)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
