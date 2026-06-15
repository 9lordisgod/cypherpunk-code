"use client";

import type { IntelArticle } from "@/scan/types";
import { FEED_DISPLAY_CAP } from "@/scan/lib/feed-config";
import { formatTimeAgo } from "@/scan/lib/feeds";
import { formatZuluTime } from "@/scan/lib/watchcon";

interface Props {
  articles: IntelArticle[];
  selectedUrl?: string;
  onSelect?: (article: IntelArticle) => void;
  newIds?: Set<string>;
  limit?: number;
}

const SECTOR_META: Record<
  string,
  { tag: string; signal: string; color: string }
> = {
  conflict: { tag: "CONFLICT", signal: "signal-conflict", color: "#ef4444" },
  politics: { tag: "GEO", signal: "signal-geo", color: "#38bdf8" },
  security: { tag: "CYBER", signal: "signal-cyber", color: "#f59e0b" },
  freedom: { tag: "FREEDOM", signal: "signal-freedom", color: "#4ade80" },
  tech: { tag: "POLICY", signal: "signal-tech", color: "#a78bfa" },
};

function sourceLabel(article: IntelArticle): string {
  if (article.platform === "x" && article.authorHandle) {
    return `@${article.authorHandle}`;
  }
  return article.source;
}

export function FeedList({
  articles,
  selectedUrl,
  onSelect,
  newIds,
  limit = FEED_DISPLAY_CAP,
}: Props) {
  const items = articles.slice(0, limit);

  if (!items.length) {
    return (
      <p className="text-[12px] text-[var(--text-dim)] py-12 text-center tac-mono tracking-wider">
        INGESTING OSINT FEEDS…
      </p>
    );
  }

  return (
    <div className="feed-list">
      <ul>
        {items.map((article) => {
          const selected = selectedUrl === article.url;
          const meta = SECTOR_META[article.sector] ?? SECTOR_META.politics;
          const isNew = newIds?.has(article.id);
          const isX = article.platform === "x";

          return (
            <li
              key={article.id}
              className={`border-b border-[var(--border-dim)] last:border-0 ${meta.signal} ${
                isNew ? "feed-item-enter" : ""
              } ${selected ? "bg-[rgba(234,88,12,0.04)]" : ""}`}
            >
              <div className="px-3 py-3.5 hover:bg-[var(--bg-elevated)] transition-colors">
                <div className="flex items-start justify-between gap-3 mb-1.5">
                  <div className="flex flex-wrap items-center gap-2 min-w-0">
                    {isX && (
                      <span className="tac-mono text-[8px] px-1 py-0.5 border border-[var(--border-bright)] text-[var(--text-dim)] tracking-wider">
                        X
                      </span>
                    )}
                    <span className="tac-mono text-[9px] text-[var(--text-dim)] tracking-wider">
                      {isX ? "KOL" : "SOURCE"}
                    </span>
                    <a
                      href={article.feedUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="tac-mono text-[10px] text-[var(--accent-orange)] hover:underline"
                    >
                      {sourceLabel(article)}
                    </a>
                    {isNew && (
                      <span className="tac-mono text-[8px] text-[var(--accent-green)] tracking-widest">
                        NEW
                      </span>
                    )}
                  </div>
                  <span className="tac-mono text-[9px] text-[var(--text-dim)] tabular-nums shrink-0">
                    {formatZuluTime(article.timestamp)}
                  </span>
                </div>

                <a
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-[13px] leading-snug text-[var(--text-primary)] hover:text-[var(--accent-orange)] line-clamp-4 mb-2 transition-colors"
                >
                  {article.title}
                </a>

                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-2 tac-mono text-[9px]">
                    <span
                      className="px-1.5 py-0.5 border tracking-wider"
                      style={{
                        borderColor: `${meta.color}55`,
                        color: meta.color,
                      }}
                    >
                      {meta.tag}
                    </span>
                    <span className="text-[var(--text-dim)]">
                      {isX ? "x.com" : article.domain}
                    </span>
                    <span className="text-[var(--text-dim)] opacity-60">
                      {formatTimeAgo(article.timestamp)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {onSelect && (
                      <button
                        type="button"
                        onClick={() => onSelect(article)}
                        className="tac-mono text-[8px] tracking-wider text-[var(--text-dim)] hover:text-[var(--text-primary)]"
                      >
                        PREVIEW
                      </button>
                    )}
                    <a
                      href={article.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="tac-mono text-[9px] text-[var(--accent-orange)] hover:underline tracking-wider"
                    >
                      {isX ? "OPEN TWEET ↗" : "READ SOURCE ↗"}
                    </a>
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export function IntelBrief({
  article,
  highlighted = false,
}: {
  article: IntelArticle;
  highlighted?: boolean;
}) {
  const meta = SECTOR_META[article.sector] ?? SECTOR_META.politics;
  const isX = article.platform === "x";

  return (
    <article
      className={`border border-[var(--border-dim)] p-3 bg-[var(--bg-inset)] ${
        highlighted ? "border-[var(--accent-orange)]" : ""
      }`}
    >
      <p className="tac-mono text-[9px] tracking-widest mb-2" style={{ color: meta.color }}>
        {meta.tag} · {isX ? "X POST" : "PRIMARY SOURCE"}
      </p>

      <div className="mb-2 space-y-1">
        <p className="tac-mono text-[9px] text-[var(--text-dim)]">
          {isX ? "ACCOUNT" : "PUBLISHER"}:{" "}
          <a
            href={article.feedUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--text-primary)] hover:text-[var(--accent-orange)]"
          >
            {isX && article.authorHandle
              ? `@${article.authorHandle}`
              : article.source}
          </a>
        </p>
      </div>

      <a
        href={article.url}
        target="_blank"
        rel="noopener noreferrer"
        className="block text-[13px] font-medium leading-snug text-[var(--text-bright)] hover:text-[var(--accent-orange)] mb-2 transition-colors"
      >
        {article.title} ↗
      </a>

      {article.summary && article.summary !== article.title && (
        <p className="text-[11px] text-[var(--text-dim)] leading-relaxed mb-3 line-clamp-4">
          {article.summary}
        </p>
      )}

      <p className="tac-mono text-[8px] text-[var(--text-dim)] break-all mb-3 opacity-70">
        {article.url}
      </p>

      <div className="flex flex-col gap-2 pt-2 border-t border-[var(--border-dim)]">
        <div className="flex items-center justify-between tac-mono text-[9px] text-[var(--text-dim)]">
          <span>
            {formatTimeAgo(article.timestamp)} · {isX ? "X ingest" : "RSS ingest"}
          </span>
          <a
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--accent-orange)] hover:underline"
          >
            {isX ? "OPEN TWEET ↗" : "OPEN ARTICLE ↗"}
          </a>
        </div>
        <a
          href={article.feedUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="tac-mono text-[8px] text-[var(--text-dim)] hover:text-[var(--accent-cyan)] break-all"
        >
          {isX ? `Profile: ${article.feedUrl}` : `Feed: ${article.feedUrl}`}
        </a>
      </div>
    </article>
  );
}

