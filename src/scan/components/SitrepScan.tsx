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

const GLYPHS = ["◈", "◇", "▣", "⬡", "◎", "◉", "⬢", "▲"];

export function SitrepScan() {
  const [apiKey, setApiKey] = useState("");
  const [keyActive, setKeyActive] = useState(false);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [citations, setCitations] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [scanPhase, setScanPhase] = useState(0);

  useEffect(() => {
    const stored = getStoredApiKey();
    if (stored) setKeyActive(true);
  }, []);

  useEffect(() => {
    if (!loading) return;
    const id = setInterval(() => setScanPhase((p) => (p + 1) % 4), 600);
    return () => clearInterval(id);
  }, [loading]);

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
    setScanPhase(0);

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

  const scanLabels = ["DECRYPTING", "CROSS-REF", "LIVE SEARCH", "SYNTHESIS"];

  return (
    <div className="scan-grid sitrep-scan min-h-screen overflow-hidden">
      <div className="sitrep-particles" aria-hidden="true">
        {GLYPHS.map((g, i) => (
          <span key={i} className="sitrep-particle" style={{ "--i": i } as React.CSSProperties}>
            {g}
          </span>
        ))}
      </div>

      <div className="sitrep-scanline" aria-hidden="true" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-6">
        <section className="sitrep-hero mb-6 rounded-sm border border-[var(--border-dim)] p-5 sm:p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="sitrep-tag tac-mono mb-2 text-[10px] tracking-[0.35em] text-[var(--accent-orange)]">
                # SITREP SCANNER
              </p>
              <h1 className="sitrep-glitch text-3xl font-bold leading-none tracking-tight text-[var(--text-bright)] sm:text-4xl">
                SITUATION ANALYSIS
              </h1>
              <p className="tac-mono mt-3 text-[11px] tracking-wide text-[var(--text-dim)]">
                Grok + live search · cypherpunk intel · BYOK
              </p>
              <div className="sitrep-mascot tac-mono mt-4 text-[11px] text-[var(--accent-cyan)]">
                <span className="sitrep-blink">◉</span>
                <span className="mx-1 opacity-60">_</span>
                <span className="sitrep-bounce">◉</span>
                <span className="ml-2 text-[9px] text-[var(--text-dim)]">
                  ghost in the shell, online
                </span>
              </div>
            </div>
            <div className="tac-mono text-right">
              <p className="tac-label mb-1">EASTERN TIME</p>
              <UtcClock />
              <p className="sitrep-status mt-2 text-[9px] text-[var(--accent-green)]">
                ● {keyActive ? "KEY ARMED" : "AWAITING KEY"}
              </p>
            </div>
          </div>
        </section>

        <div className="sitrep-panel pizz-panel glow-panel mb-4">
          <div className="pizz-panel-header flex items-center justify-between">
            <h2 className="tac-mono text-[11px] font-semibold tracking-widest">
              <span className="sitrep-lock-pulse">🔐</span> API KEY · SESSION ONLY
            </h2>
            <span className="tac-mono text-[9px] text-[var(--accent-cyan)]">PRIVACY SHIELD</span>
          </div>

          <div className="p-4">
            <div className="sitrep-privacy mb-4 rounded-sm border border-[var(--accent-cyan)]/30 bg-[rgba(56,189,248,0.04)] p-3">
              <p className="tac-mono text-[10px] leading-relaxed text-[var(--accent-cyan)]">
                <strong>One-time temporary key.</strong> Your xAI API key lives only in this
                browser tab&apos;s session memory — cleared when you close the tab. Never saved
                to our servers or databases. You pay xAI directly.
              </p>
            </div>

            {keyActive ? (
              <div className="flex flex-wrap items-center gap-3">
                <span className="tac-mono text-[11px] text-[var(--accent-green)] sitrep-key-glow">
                  ● ACTIVE: {maskApiKey(getStoredApiKey() ?? "")}
                </span>
                <button
                  type="button"
                  onClick={revokeKey}
                  className="tac-mono border border-[var(--accent-red)] px-3 py-1.5 text-[9px] tracking-wider text-[var(--accent-red)] transition-all hover:bg-[rgba(239,68,68,0.08)]"
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
                  className="sitrep-btn tac-mono border border-[var(--accent-green)] px-5 py-2.5 text-[10px] tracking-[0.2em] text-[var(--accent-green)] transition-all hover:bg-[rgba(74,222,128,0.08)] disabled:opacity-40"
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

        <div className="sitrep-panel pizz-panel glow-panel">
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
              className="sitrep-execute tac-mono w-full border border-[var(--accent-orange)] py-3 text-[10px] tracking-[0.2em] text-[var(--accent-orange)] transition-all disabled:opacity-40"
            >
              {loading ? (
                <span className="inline-flex items-center justify-center gap-2">
                  <span className="sitrep-radar" />
                  {scanLabels[scanPhase]}…
                </span>
              ) : (
                "▶ EXECUTE SCAN"
              )}
            </button>
          </div>
        </div>

        <div className="sitrep-panel mt-4 pizz-panel p-4">
          <h3 className="tac-label mb-3">Preset queries</h3>
          <div className="flex flex-wrap gap-2">
            {PRESETS.map((q, i) => (
              <button
                key={q}
                type="button"
                onClick={() => {
                  setQuery(q);
                  runScan(q);
                }}
                className="sitrep-preset tac-mono border border-[var(--border-dim)] px-2 py-1.5 text-left text-[9px] text-[var(--text-dim)] transition-all"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                {q.slice(0, 52)}…
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div className="sitrep-error tac-mono mt-4 border border-[var(--accent-red)] p-3 text-[11px] text-[var(--accent-red)]">
            {error}
          </div>
        )}

        {loading && (
          <div className="sitrep-loading mt-4 pizz-panel p-6 text-center">
            <div className="sitrep-orbit mx-auto mb-4" aria-hidden="true">
              <span>◈</span>
              <span>◇</span>
              <span>▣</span>
            </div>
            <p className="tac-mono text-[11px] tracking-widest text-[var(--accent-orange)]">
              SCANNING THE WIRE…
            </p>
            <p className="tac-mono mt-2 text-[9px] text-[var(--text-dim)]">
              live search · osint cross-ref · freedom-tech lens
            </p>
          </div>
        )}

        {result && (
          <div className="sitrep-result mt-4 pizz-panel glow-panel">
            <div className="pizz-panel-header">
              <h3 className="tac-mono text-[11px] tracking-widest text-[var(--accent-orange)]">
                ◈ GLOBAL SITREP
              </h3>
            </div>
            <div className="sitrep-result-body whitespace-pre-wrap p-4 text-[12px] leading-relaxed">
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