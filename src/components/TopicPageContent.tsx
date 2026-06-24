import Link from "next/link";
import { ResourceCard } from "@/components/ResourceCard";
import type { Resource, Topic } from "@/lib/types";
import type { TopicSeo } from "@/lib/seo/topics";

export function TopicPageContent({
  topic,
  seo,
  resources,
}: {
  topic: Topic;
  seo: TopicSeo;
  resources: Resource[];
}) {
  const sorted = [...resources].sort(
    (a, b) => b.cypherpunkScore - a.cypherpunkScore || a.title.localeCompare(b.title)
  );

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <nav className="mb-6 text-sm text-muted" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-accent no-underline">
          Home
        </Link>
        <span className="mx-2">/</span>
        <Link href="/catalog" className="hover:text-accent no-underline">
          Catalog
        </Link>
        <span className="mx-2">/</span>
        <span className="text-foreground">{seo.label}</span>
      </nav>

      <div className="mb-8">
        <h1 className="section-title text-2xl sm:text-3xl">{seo.title}</h1>
        <p className="mt-3 max-w-3xl text-lg leading-relaxed text-muted">
          {seo.description}
        </p>
        <p className="mt-3 text-sm text-muted">
          {sorted.length} curated {seo.label.toLowerCase()} resources — ranked by
          Cypherpunk relevance, not trading hype.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {sorted.map((resource) => (
          <ResourceCard key={resource.id} resource={resource} />
        ))}
      </div>

      <div className="mt-10 flex flex-wrap gap-3">
        <Link
          href={`/catalog?topic=${topic}`}
          className="inline-flex rounded border border-border px-4 py-2 font-mono text-sm text-muted no-underline transition-colors hover:text-foreground"
        >
          Filter in catalog →
        </Link>
        <Link
          href="/paths"
          className="inline-flex rounded border border-border px-4 py-2 font-mono text-sm text-muted no-underline transition-colors hover:text-foreground"
        >
          Learning paths →
        </Link>
      </div>
    </div>
  );
}