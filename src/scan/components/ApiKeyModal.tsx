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
            className="text-[var(--text-dim)] hover:text-white tac-mono text-sm"
          >
            ×
          </button>
        </div>

        <div className="p-5 text-[12px] text-[var(--text-dim)] space-y-2 leading-relaxed">
          <p>
            <strong className="text-[var(--accent-green)]">Intel feed needs no key.</strong>{" "}
            News is ingested via Finnhub on the server.
          </p>
          <p>
            Add a key only for <strong>SITREP Scanner</strong>. Get one at{" "}
            <a
              href="https://console.x.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--accent-orange)] hover:underline"
            >
              console.x.ai
            </a>
            . Stored locally in your browser only.
          </p>
        </div>

        {saved ? (
          <p className="px-5 text-[12px] mb-3 tac-mono">
            ACTIVE: <span className="text-[var(--accent-green)]">{maskApiKey(saved)}</span>
          </p>
        ) : (
          <p className="px-5 text-[12px] text-[var(--accent-amber)] mb-3 tac-mono">
            NO KEY — SCANNER OFFLINE
          </p>
        )}

        <div className="px-5 pb-5">
          <input
            type="password"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            placeholder="xai-..."
            className="w-full px-3 py-2 text-[13px] tac-mono bg-[var(--bg-inset)] border border-[var(--border-dim)] outline-none focus:border-[var(--accent-orange)] mb-3"
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
              className="px-3 py-1.5 tac-mono text-[10px] border border-[var(--accent-green)] text-[var(--accent-green)]"
            >
              SAVE
            </button>
            {saved && (
              <button
                type="button"
                onClick={() => {
                  clearStoredApiKey();
                  setSaved(null);
                }}
                className="px-3 py-1.5 tac-mono text-[10px] border border-[var(--accent-red)] text-[var(--accent-red)]"
              >
                CLEAR
              </button>
            )}
          </div>

          <p className="tac-mono text-[9px] text-[var(--text-dim)] mt-3">
            {rateInfo.remaining}/20 req/hr · local storage only
          </p>
        </div>
      </div>
    </div>
  );
}