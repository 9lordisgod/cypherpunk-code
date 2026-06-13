import Link from "next/link";
import { ArchiveNotice } from "@/components/ArchiveNotice";
import { ResourceCard } from "@/components/ResourceCard";
import {
  getFeaturedResources,
  getTopicCounts,
  getTypeCounts,
  learningPaths,
  resources,
  site,
} from "@/lib/data";
import { topicLabels } from "@/lib/labels";

export default function HomePage() {
  const featured = getFeaturedResources();
  const topicCounts = getTopicCounts();
  const typeCounts = getTypeCounts();

  return (
    <div>
      <section className="relative overflow-hidden border-b border-border">
        <div className="grid-bg absolute inset-0 opacity-40" />
        <div className="relative mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
          <p className="mb-4 font-mono text-xs uppercase tracking-widest text-accent">
            Cypherpunk Archive Database
          </p>
          <h1 className="max-w-3xl text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
            Learn sovereignty.
            <br />
            <span className="text-muted">Skip the trading noise.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-muted">{site.description}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/catalog"
              className="rounded bg-accent px-5 py-2.5 font-mono text-sm font-medium text-background transition-opacity hover:opacity-90"
            >
              Browse {resources.length} resources →
            </Link>
            <Link
              href="/paths"
              className="rounded border border-border px-5 py-2.5 font-mono text-sm text-foreground transition-colors hover:border-accent/40"
            >
              Learning paths
            </Link>
          </div>
          <div className="mt-6 max-w-2xl">
            <ArchiveNotice />
          </div>
          <p className="mt-3 text-sm text-muted">
            Curated by{" "}
            <a
              href={site.creator.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent hover:underline"
            >
              @{site.creator.handle}
            </a>
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-bold">Featured</h2>
            <p className="mt-1 text-sm text-muted">Highest-signal starting points</p>
          </div>
          <Link href="/catalog" className="text-sm text-accent hover:underline">
            View all
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {featured.slice(0, 6).map((resource) => (
            <ResourceCard key={resource.id} resource={resource} />
          ))}
        </div>
      </section>

      <section className="border-y border-border bg-card">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <h2 className="mb-8 text-2xl font-bold">Browse by topic</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {Object.entries(topicLabels)
              .filter(([key]) => topicCounts[key])
              .sort((a, b) => (topicCounts[b[0]] ?? 0) - (topicCounts[a[0]] ?? 0))
              .map(([key, label]) => (
                <Link
                  key={key}
                  href={`/catalog?topic=${key}`}
                  className="flex items-center justify-between rounded-lg border border-border bg-background px-4 py-3 transition-colors hover:border-accent/30"
                >
                  <span className="text-sm font-medium">{label}</span>
                  <span className="font-mono text-xs text-muted">
                    {topicCounts[key]}
                  </span>
                </Link>
              ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-bold">Learning paths</h2>
            <p className="mt-1 text-sm text-muted">
              Curated sequences — wiki-style structure, product-quality curation
            </p>
          </div>
          <Link href="/paths" className="text-sm text-accent hover:underline">
            All paths
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {learningPaths.slice(0, 3).map((path) => (
            <Link
              key={path.id}
              href={`/paths#${path.id}`}
              className="rounded-lg border border-border bg-card p-5 transition-colors hover:border-accent/30"
            >
              <h3 className="font-semibold">{path.title}</h3>
              <p className="mt-2 line-clamp-2 text-sm text-muted">
                {path.description}
              </p>
              <p className="mt-3 font-mono text-xs text-accent">
                {path.resourceIds.length} steps
              </p>
            </Link>
          ))}
        </div>
      </section>

      <section className="border-y border-border bg-[#0a100f] py-8">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="crt rounded p-6 md:p-8">
            <div className="flex flex-col items-start gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <div className="font-mono text-xs tracking-[3px] text-[#ffb347]">DEVNET USDC • SOLANA • SKIN IN THE GAME</div>
                <div className="mt-1 text-3xl font-bold tracking-tight text-[#00ff9f]">CIPHER ARENA</div>
                <div className="max-w-md text-sm text-[#d4dce6] mt-1">Retro computer game. Cryptographic adversarial training simulator. Play poker actions with real devnet USDC burns (on-chain via Phantom). Local sim of Race Protocol mechanics for the resolution.</div>
              </div>
              <Link
                href="/arena"
                className="mt-2 inline-block rounded border-2 border-[#00ff9f] bg-[#0a100f] px-8 py-3 font-mono text-sm text-[#00ff9f] hover:bg-[#00ff9f] hover:text-[#0a100f] md:mt-0"
              >
                BOOT ARENA v0.2 →
              </Link>
            </div>
            <div className="mt-3 text-[10px] text-[#8b9cb0]">Actions burn real devnet USDC. Educational sim. Tx hashes logged and auditable on devnet explorer.</div>
          </div>
        </div>
      </section>

      <section className="border-t border-border bg-card">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
          <div className="flex flex-wrap items-center justify-center gap-8 text-center">
            <div>
              <p className="font-mono text-3xl font-bold text-accent">
                {resources.length}
              </p>
              <p className="text-xs text-muted">Resources</p>
            </div>
            <div>
              <p className="font-mono text-3xl font-bold text-accent">
                {learningPaths.length}
              </p>
              <p className="text-xs text-muted">Learning paths</p>
            </div>
            <div>
              <p className="font-mono text-3xl font-bold text-accent">
                {Object.keys(typeCounts).length}
              </p>
              <p className="text-xs text-muted">Resource types</p>
            </div>
            <div>
              <p className="font-mono text-3xl font-bold text-accent">
                {resources.filter((r) => r.pricing === "free").length}
              </p>
              <p className="text-xs text-muted">Free resources</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}