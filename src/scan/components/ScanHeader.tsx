"use client";

import Link from "next/link";

export function ScanHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border-dim)] bg-[var(--bg-primary)]/95 backdrop-blur-sm">
      <div className="border-b border-[var(--border-dim)] bg-[var(--bg-inset)]">
        <div className="mx-auto max-w-7xl px-4 py-1.5 tac-mono text-[9px] tracking-wider text-[var(--text-dim)]">
          <span className="text-[var(--accent-cyan)]">
            PRIVACY MODE · API KEYS ARE SESSION-ONLY · CLEARED ON TAB CLOSE
          </span>
        </div>
      </div>

      <div className="mx-auto flex h-11 max-w-7xl items-center gap-4 px-4">
        <Link
          href="/cypherscan"
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
    </header>
  );
}