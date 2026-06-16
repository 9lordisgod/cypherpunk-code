import Link from "next/link";
import { site } from "@/lib/data";

export const metadata = {
  title: "Roadmap",
};

const phases = [
  {
    id: "phase-1",
    status: "live",
    label: "Phase 1 — Launch",
    period: "Now",
    items: [
      "67+ curated resources across Bitcoin, Monero, OpSec & cypherpunk history",
      "Searchable catalog with Cypherpunk Score filter",
      "6 structured learning paths",
      "Open archive — free to browse, no accounts required",
      "Deploy at cypherpunk-code.ca",
    ],
  },
  {
    id: "phase-2",
    status: "next",
    label: "Phase 2 — Grow the database",
    period: "Next",
    items: [
      "Expand catalog with community submissions",
      "Resource submission form (no X scraping required)",
      "More Monero & Bitcoin privacy resources",
      "Periodic automated checks for broken links",
      "Changelog page for database updates",
    ],
  },
  {
    id: "phase-3",
    status: "planned",
    label: "Phase 3 — Better discovery",
    period: "Future",
    items: [
      "Multilingual resource tags",
      "RSS / feed for new catalog entries",
      "Improved learning path builder",
      "Contributor credits for submitted resources",
      "Export catalog data (JSON/CSV)",
    ],
  },
  {
    id: "phase-4",
    status: "planned",
    label: "Phase 4 — Ecosystem tools",
    period: "Future",
    items: [
      "Public API for developers",
      "Nostr-based update notifications",
      "Community curation workflow",
      "Mirror-friendly static archive dumps",
    ],
  },
];

const statusStyles = {
  live: "border-accent/40 bg-accent/10 text-accent",
  next: "border-accent-blue/40 bg-accent-blue/10 text-accent-blue",
  planned: "border-border bg-background text-muted",
};

export default function RoadmapPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-bold">Project Roadmap</h1>
      <p className="mt-4 text-lg text-muted">
        Where {site.name} is headed — focused on learners and the open archive,
        not monetization.
      </p>

      <p className="mt-6 rounded-lg border border-border bg-card p-4 text-sm text-muted">
        This page replaces an internal business-model draft. Learners don&apos;t
        need pricing strategy — they need a reliable, growing index. See{" "}
        <Link href="/about" className="text-accent hover:underline">
          About
        </Link>{" "}
        for how the archive is maintained.
      </p>

      <div className="mt-10 space-y-6">
        {phases.map((phase) => (
          <section
            key={phase.id}
            id={phase.id}
            className="scroll-mt-24 rounded-lg border border-border bg-card p-6"
          >
            <div className="flex flex-wrap items-center gap-3">
              <span
                className={`rounded border px-2 py-0.5 font-mono text-xs uppercase ${statusStyles[phase.status as keyof typeof statusStyles]}`}
              >
                {phase.status === "live"
                  ? "Live"
                  : phase.status === "next"
                    ? "Up next"
                    : "Planned"}
              </span>
              <span className="text-xs text-muted">{phase.period}</span>
            </div>
            <h2 className="mt-3 text-lg font-semibold">{phase.label}</h2>
            <ul className="mt-4 space-y-2">
              {phase.items.map((item) => (
                <li key={item} className="flex gap-2 text-sm text-muted">
                  <span className="text-accent">→</span>
                  {item}
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      <section className="mt-10 rounded-lg border border-border bg-card p-6">
        <h2 className="font-semibold">Suggest a milestone</h2>
        <p className="mt-2 text-sm text-muted">
          Have an idea for the roadmap or a resource to add? Reach out to{" "}
          <a
            href={site.creator.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent hover:underline"
          >
            @{site.creator.handle}
          </a>
          .
        </p>
      </section>
    </div>
  );
}