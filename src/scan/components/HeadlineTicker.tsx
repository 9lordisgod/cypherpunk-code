"use client";

import type { IntelArticle } from "@/scan/types";

export function HeadlineTicker({ articles }: { articles: IntelArticle[] }) {
  const items = articles.slice(0, 12);
  if (!items.length) return null;

  const doubled = [...items, ...items];

  return (
    <div className="ticker-wrap border-y border-[var(--border-dim)] bg-[var(--bg-inset)] overflow-hidden">
      <div className="ticker-track">
        {doubled.map((a, i) => (
          <a
            key={`${a.id}-${i}`}
            href={a.url}
            target="_blank"
            rel="noopener noreferrer"
            className="ticker-item tac-mono text-[10px] text-[var(--text-dim)] hover:text-[var(--accent-orange)] whitespace-nowrap"
          >
            <span className="text-[var(--accent-orange)] mr-2">▸</span>
            {a.platform === "x" ? `@${a.authorHandle}` : a.source}
            <span className="mx-2 opacity-30">|</span>
            {a.title.slice(0, 90)}
            {a.title.length > 90 ? "…" : ""}
          </a>
        ))}
      </div>
    </div>
  );
}