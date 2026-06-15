"use client";

import type { IntelArticle } from "@/scan/types";

interface Props {
  articles: IntelArticle[];
  rssCount: number;
  xCount: number;
}

export function SourceMatrix({ articles, rssCount, xCount }: Props) {
  const activeSources = new Map<string, number>();
  for (const a of articles) {
    activeSources.set(a.source, (activeSources.get(a.source) ?? 0) + 1);
  }

  const sorted = [...activeSources.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 24);

  return (
    <section className="pt-4 border-t border-[var(--border-dim)]">
      <div className="flex items-center justify-between mb-3">
        <h3 className="tac-label">Active sources</h3>
        <span className="tac-mono text-[9px] text-[var(--text-dim)]">
          {rssCount} RSS · {xCount} X
        </span>
      </div>
      <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto scrollbar-tactical">
        {sorted.map(([name, count]) => (
          <span
            key={name}
            className="source-pill tac-mono text-[8px] tracking-wide"
            title={`${count} signals`}
          >
            <span className="source-dot" />
            {name}
            <span className="opacity-50 ml-1">{count}</span>
          </span>
        ))}
      </div>
    </section>
  );
}