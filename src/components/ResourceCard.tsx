import Link from "next/link";
import { difficultyLabels, pricingLabels, typeLabels } from "@/lib/labels";
import type { Resource } from "@/lib/types";
import { ScoreBadge } from "./ScoreBadge";
import { TopicBadge } from "./TopicBadge";

export function ResourceCard({ resource }: { resource: Resource }) {
  return (
    <Link
      href={`/resource/${resource.id}`}
      className="group flex flex-col rounded-lg border border-border bg-card p-5 transition-all hover:border-accent/30 hover:bg-card-hover"
    >
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          <span className="rounded bg-background px-2 py-0.5 font-mono text-xs text-muted">
            {typeLabels[resource.type]}
          </span>
          <span className="rounded bg-background px-2 py-0.5 text-xs text-muted">
            {pricingLabels[resource.pricing]}
          </span>
        </div>
        <ScoreBadge score={resource.cypherpunkScore} />
      </div>

      <h3 className="mb-2 text-base font-semibold leading-snug group-hover:text-accent">
        {resource.title}
      </h3>

      <p className="mb-4 line-clamp-2 flex-1 text-sm text-muted">
        {resource.description}
      </p>

      <div className="mb-3 flex flex-wrap gap-1.5">
        {resource.topics.slice(0, 3).map((topic) => (
          <TopicBadge key={topic} topic={topic} />
        ))}
        {resource.topics.length > 3 && (
          <span className="text-xs text-muted">+{resource.topics.length - 3}</span>
        )}
      </div>

      <div className="flex items-center justify-between border-t border-border pt-3 text-xs text-muted">
        <span>{resource.provider}</span>
        <span>{difficultyLabels[resource.difficulty]}</span>
      </div>
    </Link>
  );
}