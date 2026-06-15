import Link from "next/link";
import { notFound } from "next/navigation";
import { ScoreBadge } from "@/components/ScoreBadge";
import { TopicBadge } from "@/components/TopicBadge";
import { getResourceById, resources } from "@/lib/data";
import {
  difficultyLabels,
  pricingLabels,
  typeLabels,
} from "@/lib/labels";

export function generateStaticParams() {
  return resources.map((r) => ({ id: r.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const resource = getResourceById(id);
  if (!resource) return { title: "Not Found" };
  return {
    title: resource.title,
    description: resource.description,
  };
}

export default async function ResourcePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const resource = getResourceById(id);
  if (!resource) notFound();

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <Link
        href="/catalog"
        className="mb-6 inline-block text-sm text-muted hover:text-accent"
      >
        ← Back to catalog
      </Link>

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <span className="rounded bg-card px-2 py-0.5 font-mono text-xs text-muted">
          {typeLabels[resource.type]}
        </span>
        <span className="rounded bg-card px-2 py-0.5 text-xs text-muted">
          {pricingLabels[resource.pricing]}
        </span>
        <span className="rounded bg-card px-2 py-0.5 text-xs text-muted">
          {difficultyLabels[resource.difficulty]}
        </span>
        <ScoreBadge score={resource.cypherpunkScore} />
      </div>

      <h1 className="text-3xl font-bold leading-tight">{resource.title}</h1>
      <p className="mt-2 text-muted">{resource.provider}</p>

      <p className="mt-6 text-lg leading-relaxed">{resource.description}</p>

      <div className="mt-6 flex flex-wrap gap-2">
        {resource.topics.map((topic) => (
          <TopicBadge key={topic} topic={topic} />
        ))}
      </div>

      {resource.tags.length > 0 && (
        <div className="mt-6">
          <p className="mb-2 font-mono text-xs uppercase tracking-wider text-muted">
            Tags
          </p>
          <div className="flex flex-wrap gap-2">
            {resource.tags.map((tag) => (
              <span
                key={tag}
                className="rounded border border-border px-2 py-0.5 font-mono text-xs text-muted"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      )}

      <dl className="mt-8 grid gap-4 rounded-lg border border-border bg-card p-6 sm:grid-cols-2">
        {resource.duration && (
          <div>
            <dt className="text-xs text-muted">Duration</dt>
            <dd className="mt-1 text-sm">{resource.duration}</dd>
          </div>
        )}
        <div>
          <dt className="text-xs text-muted">Language</dt>
          <dd className="mt-1 text-sm">{resource.language}</dd>
        </div>
        <div>
          <dt className="text-xs text-muted">Cypherpunk Score</dt>
          <dd className="mt-1 text-sm">
            {resource.cypherpunkScore}/10 — editorial relevance to privacy,
            sovereignty, and cryptography (not trading).
          </dd>
        </div>
      </dl>

      <a
        href={resource.url}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-8 inline-flex items-center gap-2 rounded bg-accent px-6 py-3 font-mono text-sm font-medium text-background transition-opacity hover:opacity-90"
      >
        Open resource ↗
      </a>
    </div>
  );
}