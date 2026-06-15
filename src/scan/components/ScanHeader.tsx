"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useSourceHealth } from "@/scan/hooks/useSourceHealth";
import { HEALTH_OPERATIONAL_RATIO } from "@/scan/lib/feed-config";
import { ApiKeyModal } from "./ApiKeyModal";

const NAV = [
  { href: "/scan", label: "INTEL", sub: "FEED" },
  { href: "/scan/scanner", label: "SITREP", sub: "SCAN" },
];

export function ScanHeader() {
  const pathname = usePathname();
  const [showKeyModal, setShowKeyModal] = useState(false);
  const health = useSourceHealth();

  const rssLive = health?.rss.live;
  const rssTotal = health?.rss.total;
  const xLive = health?.x.live;
  const xTotal = health?.x.total;
  const totalLive = (rssLive ?? 0) + (xLive ?? 0);
  const totalSources = (rssTotal ?? 0) + (xTotal ?? 0);
  const liveRatio = totalSources > 0 ? totalLive / totalSources : 1;
  const isOperational = health && liveRatio >= HEALTH_OPERATIONAL_RATIO;
  const failedList = [
    ...(health?.rss.failed ?? []),
    ...(health?.x.failed ?? []),
  ];

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-[var(--border-dim)] bg-[var(--bg-primary)]/95 backdrop-blur-sm">
        <div className="border-b border-[var(--border-dim)] bg-[var(--bg-inset)]">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 px-4 py-1.5 tac-mono text-[9px] tracking-wider text-[var(--text-dim)]">
            <span
              className={
                health && !isOperational ? "text-[var(--accent-amber)]" : ""
              }
              title={
                failedList.length > 0
                  ? `Offline: ${failedList.join(", ")}`
                  : undefined
              }
            >
              {health ? (
                <>
                  {rssLive}/{rssTotal} RSS LIVE · {xLive}/{xTotal} X LIVE
                  {!isOperational && " · DEGRADED"}
                </>
              ) : (
                <>SOURCE HEALTH: AWAITING INGEST</>
              )}
            </span>
            <span className="shrink-0 text-[var(--accent-amber)]">
              BETA · IT MIGHT GO WRONG
            </span>
          </div>
        </div>

        <div className="max-w-7xl mx-auto flex h-11 items-center justify-between gap-4 px-4">
          <div className="flex items-center gap-3">
            <Link
              href="/scan"
              className="tac-mono text-[11px] font-semibold tracking-widest text-[var(--text-bright)] transition-colors hover:text-[var(--accent-orange)]"
            >
              CYPHER SCAN
            </Link>
            <Link
              href="/"
              className="tac-mono text-[9px] tracking-wider text-[var(--text-dim)] transition-colors hover:text-[var(--accent-orange)]"
            >
              ← ARCHIVE
            </Link>
          </div>

          <nav className="flex items-center gap-0.5">
            {NAV.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3 py-1.5 tac-mono text-[10px] tracking-wider border transition-colors ${
                    active
                      ? "border-[var(--accent-orange)] text-[var(--accent-orange)] bg-[rgba(234,88,12,0.06)]"
                      : "border-transparent text-[var(--text-dim)] hover:text-[var(--text-primary)] hover:border-[var(--border-dim)]"
                  }`}
                >
                  {item.label}
                  <span className="hidden sm:inline opacity-50 ml-1">{item.sub}</span>
                </Link>
              );
            })}
          </nav>

          <button
            onClick={() => setShowKeyModal(true)}
            className="tac-mono text-[9px] tracking-wider px-2 py-1 border border-[var(--border-dim)] text-[var(--text-dim)] transition-colors hover:border-[var(--accent-orange)] hover:text-[var(--accent-orange)]"
            title="Optional xAI key for Scanner"
          >
            AI KEY
          </button>
        </div>
      </header>

      <ApiKeyModal open={showKeyModal} onClose={() => setShowKeyModal(false)} />
    </>
  );
}