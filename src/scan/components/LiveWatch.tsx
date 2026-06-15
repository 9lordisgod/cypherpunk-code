"use client";

import { useEffect, useMemo, useState } from "react";
import { FEED_DISPLAY_CAP, FEED_REFRESH_MS } from "@/scan/lib/feed-config";
import { formatTimeAgo } from "@/scan/lib/feeds";
import { useLiveFeed } from "@/scan/hooks/useLiveFeed";
import { FINNHUB_CATEGORIES } from "@/scan/lib/finnhub";
import { X_SOURCES } from "@/scan/lib/x-sources";
import { computeWatchcon } from "@/scan/lib/watchcon";
import { StatsRow } from "./StatsRow";
import { SectorGrid } from "./SectorGrid";
import { HeadlineTicker } from "./HeadlineTicker";
import { SourceMatrix } from "./SourceMatrix";
import { TopSignals } from "./TopSignals";
import { FeedList, IntelBrief } from "./FeedList";
import { UtcClock } from "./UtcClock";
import type { SectorId } from "@/scan/types";

export function LiveWatch() {
  const [sector, setSector] = useState<SectorId>("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const {
    articles,
    fetchedAt,
    loading,
    refreshing,
    error,
    refresh,
    newIds,
    ingestCount,
    lastNewCount,
    refreshStatus,
  } = useLiveFeed();

  const filtered = useMemo(() => {
    const pool =
      sector === "all" ? articles : articles.filter((a) => a.sector === sector);
    return pool.slice(0, FEED_DISPLAY_CAP);
  }, [articles, sector]);

  const selected = useMemo(
    () =>
      selectedId ? filtered.find((a) => a.id === selectedId) ?? null : null,
    [filtered, selectedId]
  );

  const featured = selected ?? filtered[0] ?? null;

  const sectorCounts = useMemo(() => {
    const counts: Partial<Record<SectorId, number>> = { all: articles.length };
    for (const a of articles) {
      counts[a.sector] = (counts[a.sector] ?? 0) + 1;
    }
    return counts;
  }, [articles]);

  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const watchcon = useMemo(() => computeWatchcon(articles), [articles]);
  const alertCount = useMemo(
    () =>
      articles.filter((a) => a.sector === "conflict" || a.sector === "security")
        .length,
    [articles]
  );
  const xCount = useMemo(
    () => articles.filter((a) => a.platform === "x").length,
    [articles]
  );
  const newsCount = articles.length - xCount;

  const nextIn = useMemo(() => {
    if (!fetchedAt) return Math.floor(FEED_REFRESH_MS / 1000);
    const elapsed = now - new Date(fetchedAt).getTime();
    return Math.max(0, Math.ceil((FEED_REFRESH_MS - elapsed) / 1000));
  }, [fetchedAt, now]);

  return (
    <div className="scan-grid min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-6 space-y-5">
        {/* Hero */}
        <section className="hero-glow rounded-sm p-5 sm:p-6 border border-[var(--border-dim)]">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="tac-mono text-[10px] tracking-[0.35em] text-[var(--accent-orange)] mb-2">
                # CYPHER SCAN
              </p>
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[var(--text-bright)] leading-none">
                GLOBAL INTEL INDEX
              </h1>
              <p className="tac-mono text-[11px] text-[var(--text-dim)] mt-3 tracking-wide">
                Finnhub news · {X_SOURCES.length} X accounts · live ingest
              </p>
            </div>
            <div className="text-right tac-mono">
              <p className="tac-label mb-1">EASTERN TIME</p>
              <UtcClock />
              <p className="text-[9px] text-[var(--accent-green)] mt-2 live-pulse">
                ● OPERATIONAL
              </p>
            </div>
          </div>
        </section>

        {/* Stats */}
        <StatsRow
          stats={[
            { label: "Signals", value: articles.length, accent: "var(--text-bright)" },
            { label: "News", value: newsCount, accent: "var(--accent-cyan)" },
            { label: "X / KOL", value: xCount, accent: "var(--accent-orange)" },
            { label: "Alerts", value: alertCount, accent: "var(--accent-red)" },
            {
              label: "Cycle",
              value: ingestCount || "—",
              accent: "var(--accent-amber)",
            },
            {
              label: "Next",
              value: refreshing || loading ? "…" : `${nextIn}s`,
              accent: "var(--accent-green)",
              pulse: !refreshing && !loading,
            },
          ]}
        />

        {/* WATCHCON */}
        <div className="watchcon-banner px-4 py-3 flex flex-wrap items-center justify-between gap-3 rounded-sm">
          <div className="tac-mono text-[11px] tracking-wider flex items-center gap-2">
            <span className={`watchcon-level ${watchcon.className}`}>
              WATCHCON {watchcon.level}
            </span>
            <span className="text-[var(--text-primary)]">{watchcon.label}</span>
          </div>
          <span className="text-[10px] text-[var(--text-dim)]">{watchcon.detail}</span>
        </div>

        {/* Ticker */}
        <HeadlineTicker articles={articles} />

        {/* Sector grid */}
        <section>
          <p className="tac-label mb-2">Sector overview</p>
          <SectorGrid
            active={sector}
            counts={sectorCounts}
            total={articles.length || 1}
            onChange={setSector}
          />
        </section>

        {/* Main dashboard: feed + right intel rail */}
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_300px] xl:grid-cols-[minmax(0,1fr)_340px] gap-4 items-start">
          <div className="pizz-panel min-w-0 glow-panel order-1">
            <div className="pizz-panel-header flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="tac-mono text-[11px] font-semibold tracking-widest text-[var(--text-bright)]">
                  OSINT FEED · {sector.toUpperCase()}
                </h2>
                <p className="tac-divider mt-1">- - - - -</p>
              </div>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 tac-mono text-[10px]">
                <span className="text-[var(--accent-green)]">AUTO LIVE</span>
                <span className="text-[var(--text-dim)]">
                  {refreshing || loading
                    ? "INGESTING…"
                    : `${filtered.length} SHOWN · ${articles.length} IN INDEX`}
                </span>
                {fetchedAt && !loading && (
                  <span className="text-[var(--text-dim)]">
                    UPDATED {formatTimeAgo(fetchedAt).toUpperCase()}
                  </span>
                )}
                {refreshStatus === "updated" && (
                  <span className="text-[var(--accent-green)]">
                    +{lastNewCount} NEW SIGNAL{lastNewCount === 1 ? "" : "S"}
                  </span>
                )}
                {refreshStatus === "unchanged" && (
                  <span className="text-[var(--accent-amber)]">
                    NO NEW SIGNALS
                  </span>
                )}
                <button
                  type="button"
                  onClick={refresh}
                  disabled={refreshing || loading}
                  className="px-2 py-1 border border-[var(--border-dim)] text-[var(--text-dim)] hover:border-[var(--accent-orange)] hover:text-[var(--accent-orange)] disabled:opacity-40 transition-colors"
                >
                  REFRESH
                </button>
              </div>
            </div>

            {error && (
              <p className="px-4 py-3 text-[11px] text-[var(--accent-red)] border-b border-[var(--border-dim)]">
                {error}
              </p>
            )}

            <div className="px-2 pb-2">
              <FeedList
                articles={filtered}
                selectedUrl={selected?.url}
                onSelect={(a) => setSelectedId(a.id)}
                newIds={newIds}
              />
            </div>
          </div>

          <aside className="intel-sidebar order-2 sticky top-[4.75rem] self-start w-full max-h-[calc(100vh-5.5rem)] overflow-y-auto scrollbar-tactical">
            <div className="intel-sidebar-header">
              <h2 className="tac-mono text-[10px] font-semibold tracking-[0.25em] text-[var(--accent-orange)]">
                INTEL RAIL
              </h2>
              <p className="tac-divider mt-1">- - - - -</p>
            </div>

            <div className="p-4 space-y-4">
              <section>
                <h3 className="tac-label mb-2">Intel brief</h3>
                {featured ? (
                  <IntelBrief article={featured} highlighted={!!selected} />
                ) : (
                  <p className="text-[11px] text-[var(--text-dim)] py-8 text-center tac-mono">
                    AWAITING INGEST…
                  </p>
                )}
              </section>

              <TopSignals
                articles={articles}
                onSelect={(a) => {
                  setSector(a.sector);
                  setSelectedId(a.id);
                }}
              />

              <SourceMatrix
                articles={articles}
                newsCount={FINNHUB_CATEGORIES.length}
                xCount={X_SOURCES.length}
              />
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}