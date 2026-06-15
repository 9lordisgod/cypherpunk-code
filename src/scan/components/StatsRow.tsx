"use client";

interface Stat {
  label: string;
  value: string | number;
  accent?: string;
  pulse?: boolean;
}

export function StatsRow({ stats }: { stats: Stat[] }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
      {stats.map((s) => (
        <div key={s.label} className="stat-card">
          <p className="tac-label mb-1">{s.label}</p>
          <p
            className={`tac-mono text-lg font-semibold tabular-nums ${s.pulse ? "live-pulse" : ""}`}
            style={{ color: s.accent ?? "var(--text-bright)" }}
          >
            {s.value}
          </p>
        </div>
      ))}
    </div>
  );
}