"use client";

import { useMemo, useState } from "react";
import {
  getStoredApiKey,
  setStoredApiKey,
  clearStoredApiKey,
  maskApiKey,
  checkRateLimit,
} from "@/scan/lib/api-key";

interface Props {
  open: boolean;
  onClose: () => void;
}

export function ApiKeyModal({ open, onClose }: Props) {
  const [key, setKey] = useState("");
  const [saved, setSaved] = useState<string | null>(() => getStoredApiKey());

  const rateInfo = useMemo(
    () => (open ? checkRateLimit() : { remaining: 20, resetIn: 0 }),
    [open]
  );

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80" onClick={onClose} />
      <div className="relative pizz-panel w-full max-w-md">
        <div className="pizz-panel-header flex items-center justify-between">
          <h2 className="tac-mono text-[11px] tracking-widest">AI KEY · BYOK</h2>
          <button
            type="button"
            onClick={onClose}
            className="tac-mono text-sm text-[var(--text-dim)] hover:text-white"
          >
            ×
          </button>
        </div>

        <div className="space-y-2 p-5 text-[12px] leading-relaxed text-[var(--text-dim)]">
          <p>
            <strong className="text-[var(--accent-cyan)]">One-time temporary key.</strong>{" "}
            Your xAI API key is stored only in this browser tab&apos;s session memory and is
            cleared when you close the tab. Never written to our servers or databases.
          </p>
          <p>
            Get a key at{" "}
            <a
              href="https://console.x.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--accent-orange)] hover:underline"
            >
              console.x.ai
            </a>
            . You pay xAI directly — not CypherScan.
          </p>
        </div>

        {saved ? (
          <p className="tac-mono mb-3 px-5 text-[12px]">
            ACTIVE: <span className="text-[var(--accent-green)]">{maskApiKey(saved)}</span>
          </p>
        ) : (
          <p className="tac-mono mb-3 px-5 text-[12px] text-[var(--accent-amber)]">
            NO KEY — SCANNER OFFLINE
          </p>
        )}

        <div className="px-5 pb-5">
          <input
            type="password"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            placeholder="xai-..."
            className="tac-mono mb-3 w-full border border-[var(--border-dim)] bg-[var(--bg-inset)] px-3 py-2 text-[13px] outline-none focus:border-[var(--accent-orange)]"
          />

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => {
                if (key.trim()) {
                  setStoredApiKey(key.trim());
                  setSaved(key.trim());
                  setKey("");
                }
              }}
              className="tac-mono border border-[var(--accent-green)] px-3 py-1.5 text-[10px] text-[var(--accent-green)]"
            >
              ARM KEY
            </button>
            {saved && (
              <button
                type="button"
                onClick={() => {
                  clearStoredApiKey();
                  setSaved(null);
                }}
                className="tac-mono border border-[var(--accent-red)] px-3 py-1.5 text-[10px] text-[var(--accent-red)]"
              >
                REVOKE
              </button>
            )}
          </div>

          <p className="tac-mono mt-3 text-[9px] text-[var(--text-dim)]">
            {rateInfo.remaining}/20 req/hr · session storage only
          </p>
        </div>
      </div>
    </div>
  );
}