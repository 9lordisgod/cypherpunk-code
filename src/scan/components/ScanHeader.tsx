"use client";

import Link from "next/link";
import { useState } from "react";
import { ApiKeyModal } from "./ApiKeyModal";

export function ScanHeader() {
  const [showKeyModal, setShowKeyModal] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-[var(--border-dim)] bg-[var(--bg-primary)]/95 backdrop-blur-sm">
        <div className="border-b border-[var(--border-dim)] bg-[var(--bg-inset)]">
          <div className="mx-auto max-w-7xl px-4 py-1.5 tac-mono text-[9px] tracking-wider text-[var(--text-dim)]">
            <span className="text-[var(--accent-cyan)]">
              PRIVACY MODE · API KEYS ARE SESSION-ONLY · CLEARED ON TAB CLOSE
            </span>
          </div>
        </div>

        <div className="mx-auto flex h-11 max-w-7xl items-center justify-between gap-4 px-4">
          <div className="flex items-center gap-3">
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

          <nav className="flex items-center gap-0.5">
            <span className="px-3 py-1.5 tac-mono text-[10px] tracking-wider border border-[var(--accent-orange)] text-[var(--accent-orange)] bg-[rgba(234,88,12,0.06)]">
              SITREP
              <span className="ml-1 hidden opacity-50 sm:inline">SCAN</span>
            </span>
          </nav>

          <button
            type="button"
            onClick={() => setShowKeyModal(true)}
            className="tac-mono border border-[var(--border-dim)] px-2 py-1 text-[9px] tracking-wider text-[var(--text-dim)] transition-colors hover:border-[var(--accent-orange)] hover:text-[var(--accent-orange)]"
            title="Session-only xAI key for SITREP Scanner"
          >
            AI KEY
          </button>
        </div>
      </header>

      <ApiKeyModal open={showKeyModal} onClose={() => setShowKeyModal(false)} />
    </>
  );
}