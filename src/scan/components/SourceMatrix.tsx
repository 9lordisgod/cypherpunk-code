"use client";

import type { IntelArticle } from "@/scan/types";

interface Props {
  articles: IntelArticle[];
  newsCount: number;
  xCount: number;
}

export function SourceMatrix({ articles, newsCount, xCount }: Props) {
  const activeSources = new Map<string, number>();
  for (const a of articles) {
    activeSources.set(a.source, (activeSources.get(a.source) ?? 0) + 1);
  }

  const sorted = [...activeSources.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 24);

  return (
    <section className="border-t border-[var(--border-dim)] pt-4">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="tac-label">Active sources</h3>
        <span className="tac-mono text-[9px] text-[var(--text-dim)]">
          {newsCount} Finnhub · {xCount} X
        </span>
      </div>
      <div className="scrollbar-tactical flex max-h-32 flex-wrap gap-1.5 overflow-y-auto">
        {sorted.map(([name, count]) => (
          <span
            key={name}
            className="source-pill tac-mono text-[8px] tracking-wide"
            title={`${count} signals`}
          >
            <span className="source-dot" />
            {name}
            <span className="ml-1 opacity-50">{count}</span>
          </span>
        ))}
      </div>
    </section>
  );
}