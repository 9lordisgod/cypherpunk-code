"use client";

import { useEffect, useState } from "react";
import { UtcClock } from "@/scan/components/UtcClock";
import {
  getStoredApiKey,
  setStoredApiKey,
  clearStoredApiKey,
  maskApiKey,
} from "@/scan/lib/api-key";
import { callGrok } from "@/scan/lib/grok-client";
import { buildScannerPrompt } from "@/scan/lib/grok-prompts";

const PRESETS = [
  "What is happening in the world right now? Full SITREP.",
  "Latest developments in digital privacy, surveillance, and censorship worldwide",
  "Current military conflicts and geopolitical flashpoints",
  "Cybersecurity incidents and nation-state operations this week",
  "Semiconductor export controls, AI regulation, and critical infrastructure policy",
  "Freedom tech: encryption battles, VPN bans, whistleblower news",
];

export function SitrepScan() {
  const [apiKey, setApiKey] = useState("");
  const [keyActive, setKeyActive] = useState(false);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [citations, setCitations] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const stored = getStoredApiKey();
    if (stored) setKeyActive(true);
  }, []);

  const activateKey = () => {
    if (!apiKey.trim()) return;
    setStoredApiKey(apiKey.trim());
    setKeyActive(true);
    setApiKey("");
    setError(null);
  };

  const revokeKey = () => {
    clearStoredApiKey();
    setKeyActive(false);
    setApiKey("");
  };

  const runScan = async (q?: string) => {
    const scanQuery = q ?? query;
    if (!scanQuery.trim()) return;

    if (!getStoredApiKey()) {
      setError("Enter your xAI API key below — session-only, never stored on our servers.");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      let headlines = "Feeds unavailable";
      const res = await fetch("/api/feed?sector=all&fresh=1", {
        cache: "no-store",
      });
      if (res.ok) {
        const { articles } = await res.json();
        headlines = (articles ?? [])
          .slice(0, 20)
          .map(
            (a: { sector: string; title: string; source: string }) =>
              `[${a.sector.toUpperCase()}] ${a.title} (${a.source})`
          )
          .join("\n");
      }

      const { content, citations: cites } = await callGrok(
        [
          {
            role: "system",
            content:
              "You are CypherScan global intelligence. Cypherpunk and freedom-tech focused. Use live search.",
          },
          { role: "user", content: buildScannerPrompt(headlines, scanQuery) },
        ],
        { searchMode: "on", maxTokens: 2500 }
      );

      setResult(content);
      setCitations(cites ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Scan failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="scan-grid min-h-screen">
      <div className="mx-auto max-w-7xl px-4 py-6">
        <p className="tac-mono mb-6 text-[11px] font-semibold tracking-widest text-[var(--text-bright)]">
          Cypher Scan
        </p>

        <div className="pizz-panel glow-panel mb-4">
          <div className="pizz-panel-header flex items-center justify-between">
            <h2 className="tac-mono text-[11px] font-semibold tracking-widest">
              API KEY · SESSION ONLY
            </h2>
            <span className="tac-mono text-[9px] text-[var(--accent-cyan)]">PRIVACY SHIELD</span>
          </div>

          <div className="p-4">
            <div className="mb-4 rounded-sm border border-[var(--accent-cyan)]/30 bg-[rgba(56,189,248,0.04)] p-3">
              <p className="tac-mono text-[10px] leading-relaxed text-[var(--accent-cyan)]">
                <strong>One-time temporary key.</strong> Your xAI API key lives only in this
                browser tab&apos;s session memory — cleared when you close the tab. Never saved
                to our servers or databases. You pay xAI directly.
              </p>
            </div>

            {keyActive ? (
              <div className="flex flex-wrap items-center gap-3">
                <span className="tac-mono text-[11px] text-[var(--accent-green)]">
                  ● ACTIVE: {maskApiKey(getStoredApiKey() ?? "")}
                </span>
                <button
                  type="button"
                  onClick={revokeKey}
                  className="tac-mono border border-[var(--accent-red)] px-3 py-1.5 text-[9px] tracking-wider text-[var(--accent-red)] transition-colors hover:bg-[rgba(239,68,68,0.08)]"
                >
                  REVOKE KEY
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-3 sm:flex-row">
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && activateKey()}
                  placeholder="xai-... paste your key"
                  className="sitrep-input tac-mono flex-1 border border-[var(--border-dim)] bg-[var(--bg-inset)] px-3 py-2.5 text-[12px] outline-none"
                />
                <button
                  type="button"
                  onClick={activateKey}
                  disabled={!apiKey.trim()}
                  className="tac-mono border border-[var(--accent-green)] px-5 py-2.5 text-[10px] tracking-[0.2em] text-[var(--accent-green)] transition-colors hover:bg-[rgba(74,222,128,0.08)] disabled:opacity-40"
                >
                  ARM KEY
                </button>
              </div>
            )}

            <p className="tac-mono mt-3 text-[9px] text-[var(--text-dim)]">
              Get a key at{" "}
              <a
                href="https://console.x.ai"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--accent-orange)] hover:underline"
              >
                console.x.ai
              </a>
            </p>
          </div>
        </div>

        <div className="pizz-panel glow-panel">
          <div className="pizz-panel-header flex items-center justify-between">
            <h2 className="tac-mono text-[11px] font-semibold tracking-widest">
              QUERY INTERFACE
            </h2>
            <UtcClock />
          </div>

          <div className="p-4">
            <textarea
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Enter intelligence query…"
              rows={3}
              className="sitrep-input tac-mono mb-3 w-full resize-none border border-[var(--border-dim)] bg-[var(--bg-inset)] px-3 py-2 text-[12px] outline-none"
            />
            <button
              type="button"
              onClick={() => runScan()}
              disabled={loading || !query.trim()}
              className="tac-mono w-full border border-[var(--accent-orange)] py-3 text-[10px] tracking-[0.2em] text-[var(--accent-orange)] transition-colors hover:bg-[rgba(234,88,12,0.08)] disabled:opacity-40"
            >
              {loading ? "RUNNING SITREP SCAN…" : "▶ EXECUTE SCAN"}
            </button>
          </div>
        </div>

        <div className="mt-4 pizz-panel p-4">
          <h3 className="tac-label mb-3">Preset queries</h3>
          <div className="flex flex-wrap gap-2">
            {PRESETS.map((q) => (
              <button
                key={q}
                type="button"
                onClick={() => {
                  setQuery(q);
                  runScan(q);
                }}
                className="tac-mono border border-[var(--border-dim)] px-2 py-1.5 text-left text-[9px] text-[var(--text-dim)] transition-colors hover:border-[var(--accent-orange)] hover:text-[var(--accent-orange)]"
              >
                {q.slice(0, 52)}…
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div className="tac-mono mt-4 border border-[var(--accent-red)] p-3 text-[11px] text-[var(--accent-red)]">
            {error}
          </div>
        )}

        {result && (
          <div className="mt-4 pizz-panel glow-panel">
            <div className="pizz-panel-header">
              <h3 className="tac-mono text-[11px] tracking-widest text-[var(--accent-orange)]">
                GLOBAL SITREP
              </h3>
            </div>
            <div className="whitespace-pre-wrap p-4 text-[12px] leading-relaxed">
              {result}
            </div>
            {citations.length > 0 && (
              <div className="border-t border-[var(--border-dim)] px-4 pb-4 pt-4">
                <h4 className="tac-label mb-2">Sources</h4>
                {citations.map((c, i) => (
                  <a
                    key={i}
                    href={c}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="tac-mono mb-1 block break-all text-[9px] text-[var(--accent-cyan)] hover:underline"
                  >
                    {c}
                  </a>
                ))}
              </div>
            )}
            <div className="mx-4 mb-4 border border-[var(--accent-amber)] p-3 text-[10px] text-[var(--accent-amber)]">
              Verify all claims. AI output can reflect recency bias and state narratives.
              Cross-check with primary OSINT sources.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}