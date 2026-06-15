"use client";

import { SECTOR_VISUAL } from "@/scan/lib/sectors";
import type { SectorId } from "@/scan/types";

const SECTORS: SectorId[] = [
  "all",
  "conflict",
  "politics",
  "security",
  "freedom",
  "tech",
];

interface Props {
  active: SectorId;
  counts: Partial<Record<SectorId, number>>;
  total: number;
  onChange: (s: SectorId) => void;
}

export function SectorGrid({ active, counts, total, onChange }: Props) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
      {SECTORS.map((id) => {
        const count = counts[id] ?? 0;
        const visual =
          id === "all"
            ? { color: "var(--accent-orange)", glow: "rgba(234,88,12,0.3)", label: "ALL" }
            : SECTOR_VISUAL[id];
        const pct = total > 0 ? Math.round((count / total) * 100) : 0;
        const isActive = active === id;

        return (
          <button
            key={id}
            type="button"
            onClick={() => onChange(id)}
            className={`sector-card text-left ${isActive ? "sector-card-active" : ""}`}
            style={
              isActive
                ? {
                    borderColor: visual.color,
                    boxShadow: `0 0 20px ${visual.glow}`,
                  }
                : undefined
            }
          >
            <p
              className="tac-mono text-[9px] tracking-widest mb-2"
              style={{ color: visual.color }}
            >
              {visual.label}
            </p>
            <p className="tac-mono text-2xl font-bold tabular-nums text-[var(--text-bright)]">
              {count}
            </p>
            <div className="sector-bar mt-2">
              <div
                className="sector-bar-fill"
                style={{ width: `${id === "all" ? 100 : pct}%`, background: visual.color }}
              />
            </div>
            {id !== "all" && (
              <p className="tac-mono text-[8px] text-[var(--text-dim)] mt-1">{pct}%</p>
            )}
          </button>
        );
      })}
    </div>
  );
}