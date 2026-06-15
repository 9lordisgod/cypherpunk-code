"use client";

import type { IntelArticle } from "@/scan/types";
import { SECTOR_VISUAL } from "@/scan/lib/sectors";
import { formatTimeAgo } from "@/scan/lib/feeds";
import type { SectorId } from "@/scan/types";

export function TopSignals({
  articles,
  onSelect,
}: {
  articles: IntelArticle[];
  onSelect: (a: IntelArticle) => void;
}) {
  const sectors: Exclude<SectorId, "all">[] = [
    "conflict",
    "security",
    "politics",
    "freedom",
    "tech",
  ];

  return (
    <section className="pt-4 border-t border-[var(--border-dim)]">
      <h3 className="tac-label mb-3">Sector highlights</h3>
      <div className="space-y-3">
        {sectors.map((sector) => {
          const top = articles.find((a) => a.sector === sector);
          if (!top) return null;
          const v = SECTOR_VISUAL[sector];
          return (
            <button
              key={sector}
              type="button"
              onClick={() => onSelect(top)}
              className="w-full text-left p-2 border border-[var(--border-dim)] hover:border-[var(--border-bright)] transition-colors"
              style={{ borderLeftColor: v.color, borderLeftWidth: 2 }}
            >
              <p className="tac-mono text-[8px] mb-1" style={{ color: v.color }}>
                {v.label}
              </p>
              <p className="text-[11px] leading-snug line-clamp-2 text-[var(--text-primary)]">
                {top.title}
              </p>
              <p className="tac-mono text-[8px] text-[var(--text-dim)] mt-1">
                {top.platform === "x" ? `@${top.authorHandle}` : top.source} ·{" "}
                {formatTimeAgo(top.timestamp)}
              </p>
            </button>
          );
        })}
      </div>
    </section>
  );
}