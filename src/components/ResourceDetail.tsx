"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useLanguage } from "@/components/LanguageProvider";
import { ScoreBadge } from "@/components/ScoreBadge";
import { TopicBadge } from "@/components/TopicBadge";
import { useResourceText } from "@/lib/i18n/useResourceText";
import { useTranslatedLabels } from "@/lib/i18n/useTranslatedLabels";
import type { Resource } from "@/lib/types";
import { site } from "@/lib/data";

export function ResourceDetail({ resource }: { resource: Resource }) {
  const { t } = useLanguage();
  const { typeLabels, pricingLabels, difficultyLabels } = useTranslatedLabels();
  const {
    getResourceTitle,
    getResourceDescription,
    getResourceProvider,
    getResourceDuration,
    getResourceLanguage,
  } = useResourceText();

  const title = getResourceTitle(resource.id, resource.title);
  const description = getResourceDescription(resource.id, resource.description);
  const provider = getResourceProvider(resource.id, resource.provider);

  useEffect(() => {
    document.title = `${title} · ${site.name}`;
  }, [title, t]);

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <Link
        href="/catalog"
        className="mb-6 inline-block text-sm text-muted hover:text-accent"
      >
        {t("backToCatalog")}
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

      <h1 className="text-2xl font-bold leading-tight sm:text-3xl">{title}</h1>
      <p className="mt-2 text-muted">{provider}</p>

      <p className="mt-6 text-lg leading-relaxed">{description}</p>

      <div className="mt-6 flex flex-wrap gap-2">
        {resource.topics.map((topic) => (
          <TopicBadge key={topic} topic={topic} />
        ))}
      </div>

      {resource.tags.length > 0 && (
        <div className="mt-6">
          <p className="mb-2 font-mono text-xs uppercase tracking-wider text-muted">
            {t("tagsLabel")}
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
            <dt className="text-xs text-muted">{t("durationLabel")}</dt>
            <dd className="mt-1 text-sm">
              {getResourceDuration(resource.duration)}
            </dd>
          </div>
        )}
        <div>
          <dt className="text-xs text-muted">{t("languageLabel")}</dt>
          <dd className="mt-1 text-sm">
            {getResourceLanguage(resource.language)}
          </dd>
        </div>
        <div>
          <dt className="text-xs text-muted">{t("cpScoreLabel")}</dt>
          <dd className="mt-1 text-sm">
            {t("cpScoreDetail", { score: resource.cypherpunkScore })}
          </dd>
        </div>
      </dl>

      <a
        href={resource.url}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-8 inline-flex items-center gap-2 rounded bg-accent px-6 py-3 font-mono text-sm font-medium text-background transition-opacity hover:opacity-90"
      >
        {t("openResource")}
      </a>
    </div>
  );
}