"use client";

import Link from "next/link";
import { useResourceText } from "@/lib/i18n/useResourceText";
import { useTranslatedLabels } from "@/lib/i18n/useTranslatedLabels";
import type { Resource } from "@/lib/types";
import { ScoreBadge } from "./ScoreBadge";
import { TopicBadge } from "./TopicBadge";

export function ResourceCard({ resource }: { resource: Resource }) {
  const { typeLabels, pricingLabels, difficultyLabels } = useTranslatedLabels();
  const { getResourceTitle, getResourceDescription, getResourceProvider } =
    useResourceText();

  return (
    <Link
      href={`/resource/${resource.id}`}
      className="pixel-card group flex flex-col p-5 no-underline text-foreground"
    >
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          <span
            className="px-2 py-0.5 text-xs text-muted"
            style={{
              border: "2px solid var(--border)",
              fontFamily: "var(--font-pixel)",
              fontSize: "7px",
            }}
          >
            {typeLabels[resource.type]}
          </span>
          <span className="rounded bg-background px-2 py-0.5 text-xs text-muted">
            {pricingLabels[resource.pricing]}
          </span>
        </div>
        <ScoreBadge score={resource.cypherpunkScore} />
      </div>

      <h3
        className="mb-2 text-base font-semibold leading-snug group-hover:text-accent"
        style={{ fontFamily: "var(--font-pixel)", fontSize: "9px", lineHeight: 1.8 }}
      >
        {getResourceTitle(resource.id, resource.title)}
      </h3>

      <p className="mb-4 line-clamp-2 flex-1 text-sm text-muted">
        {getResourceDescription(resource.id, resource.description)}
      </p>

      <div className="mb-3 flex flex-wrap gap-1.5">
        {resource.topics.slice(0, 3).map((topic) => (
          <TopicBadge key={topic} topic={topic} />
        ))}
        {resource.topics.length > 3 && (
          <span className="text-xs text-muted">+{resource.topics.length - 3}</span>
        )}
      </div>

      <div className="flex items-center justify-between border-t-2 border-border pt-3 text-xs text-muted">
        <span>{getResourceProvider(resource.id, resource.provider)}</span>
        <span>{difficultyLabels[resource.difficulty]}</span>
      </div>
    </Link>
  );
}