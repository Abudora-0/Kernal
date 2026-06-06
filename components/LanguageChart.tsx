"use client";

const COLORS = ["#8b5cf6","#3b82f6","#10b981","#f59e0b","#ef4444","#06b6d4"];

export default function LanguageChart({ languages }: { languages: { name: string; count: number }[] }) {
  const total = languages.reduce((a, l) => a + l.count, 0);

  return (
    <div className="space-y-3">
      {/* Bar segments */}
      <div className="flex h-3 rounded-full overflow-hidden gap-0.5">
        {languages.map((lang, i) => (
          <div
            key={lang.name}
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${(lang.count / total) * 100}%`, backgroundColor: COLORS[i % COLORS.length] }}
            title={`${lang.name}: ${Math.round((lang.count / total) * 100)}%`}
          />
        ))}
      </div>

      {/* Legend */}
      <div className="space-y-2">
        {languages.map((lang, i) => (
          <div key={lang.name} className="flex items-center justify-between group">
            <div className="flex items-center gap-2">
              <div
                className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                style={{ backgroundColor: COLORS[i % COLORS.length] }}
              />
              <span className="text-sm text-gray-300">{lang.name}</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-24 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{ width: `${(lang.count / total) * 100}%`, backgroundColor: COLORS[i % COLORS.length] }}
                />
              </div>
              <span className="text-xs text-gray-500 w-8 text-right tabular-nums">
                {Math.round((lang.count / total) * 100)}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
