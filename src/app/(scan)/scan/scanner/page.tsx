"use client";

import { useState } from "react";
import { UtcClock } from "@/scan/components/UtcClock";
import { getStoredApiKey } from "@/scan/lib/api-key";
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

export default function ScannerPage() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [citations, setCitations] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const runScan = async (q?: string) => {
    const scanQuery = q ?? query;
    if (!scanQuery.trim()) return;

    if (!getStoredApiKey()) {
      setError("Configure your xAI API key first (header → AI KEY)");
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
    <div className="scan-grid mx-auto max-w-7xl px-4 py-6">
      <section className="mb-6">
        <p className="tac-mono mb-3 text-[10px] tracking-[0.3em] text-[var(--accent-orange)]">
          # SITREP SCANNER
        </p>
        <h1 className="text-2xl font-bold leading-none tracking-tight text-[var(--text-bright)] sm:text-3xl">
          SITUATION ANALYSIS
        </h1>
        <p className="tac-mono mt-2 text-[11px] tracking-wide text-[var(--text-dim)]">
          Grok + live search · cross-referenced against OSINT ingest
        </p>
      </section>

      <div className="pizz-panel">
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
            className="tac-mono mb-3 w-full resize-none border border-[var(--border-dim)] bg-[var(--bg-inset)] px-3 py-2 text-[12px] outline-none focus:border-[var(--accent-orange)]"
          />
          <button
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
        <div className="mt-4 pizz-panel">
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
            Verify all claims. AI output can reflect recency bias and state
            narratives. Cross-check with primary OSINT sources.
          </div>
        </div>
      )}
    </div>
  );
}