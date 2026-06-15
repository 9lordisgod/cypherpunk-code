import Link from "next/link";

export function CypherScanBeta() {
  return (
    <section className="relative border-b border-amber-500/25 bg-amber-500/5">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div className="max-w-2xl">
            <p className="mb-2 font-mono text-xs uppercase tracking-widest text-amber-400">
              Beta · it might go wrong
            </p>
            <h2 className="text-2xl font-bold tracking-tight">
              CypherScan — Live OSINT Intel Monitor
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              Beyond the static archive: a live feed that ingests verified RSS and
              OSINT X timelines, ranks signals by recency and relevance, and filters
              trading noise. Auto-updates every 60 seconds. No keys required for the
              intel index — sovereignty-grade situational awareness for learners who
              want the world picture, not price chatter.
            </p>
            <ul className="mt-4 space-y-1 font-mono text-xs text-muted">
              <li>· 32 RSS + 17 X sources · rule-based algo · sector-balanced index</li>
              <li>· Conflict · geopolitics · cyber · freedom-tech · policy</li>
              <li>· Optional BYOK SITREP scanner (xAI) — feed runs without any API key</li>
            </ul>
          </div>
          <div className="flex flex-col gap-2 sm:items-end">
            <Link
              href="/scan"
              className="rounded bg-accent px-5 py-2.5 font-mono text-sm font-medium text-background transition-opacity hover:opacity-90"
            >
              Open live feed →
            </Link>
            <Link
              href="/resource/cypherscan-intel-feed"
              className="rounded border border-border px-5 py-2.5 font-mono text-sm text-foreground transition-colors hover:border-accent/40"
            >
              Archive entry
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}