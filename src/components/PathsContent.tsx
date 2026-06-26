"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useLanguage } from "@/components/LanguageProvider";
import { ScoreBadge } from "@/components/ScoreBadge";
import { TopicBadge } from "@/components/TopicBadge";
import { getResourcesByIds, learningPaths, site } from "@/lib/data";
import { usePathText } from "@/lib/i18n/usePathText";
import { useResourceText } from "@/lib/i18n/useResourceText";

export function PathsContent() {
  const { t } = useLanguage();
  const { getPathTitle, getPathDescription } = usePathText();
  const { getResourceTitle, getResourceDescription } = useResourceText();

  useEffect(() => {
    document.title = `${t("pathsPageTitle")} · ${site.name}`;
  }, [t]);

  return (
    <div className="page-content">
      <header className="page-header">
        <p className="page-header__eyebrow">Curriculum</p>
        <h1 className="section-title page-header__title">{t("pathsPageTitle")}</h1>
        <p className="page-header__desc">{t("pathsPageDescription")}</p>
      </header>

      <div className="space-y-12">
        {learningPaths.map((path) => {
          const pathResources = getResourcesByIds(path.resourceIds);
          return (
            <section
              key={path.id}
              id={path.id}
              className="scroll-mt-24 rounded-lg border border-border bg-card p-6 sm:p-8"
            >
              <div className="mb-6">
                <h2 className="text-xl font-bold">{getPathTitle(path.id, path.title)}</h2>
                <p className="mt-2 text-sm text-muted">
                  {getPathDescription(path.id, path.description)}
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {path.topics.map((topic) => (
                    <TopicBadge key={topic} topic={topic} />
                  ))}
                </div>
              </div>

              <ol className="space-y-3">
                {pathResources.map((resource, i) => (
                  <li key={resource.id}>
                    <Link
                      href={`/resource/${resource.id}`}
                      className="group flex items-start gap-4 rounded-lg border border-border bg-background p-4 transition-colors hover:border-accent/30"
                    >
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-border font-mono text-xs text-muted group-hover:border-accent/40 group-hover:text-accent">
                        {i + 1}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-medium group-hover:text-accent">
                            {getResourceTitle(resource.id, resource.title)}
                          </h3>
                          <ScoreBadge score={resource.cypherpunkScore} />
                        </div>
                        <p className="mt-1 line-clamp-1 text-sm text-muted">
                          {getResourceDescription(resource.id, resource.description)}
                        </p>
                      </div>
                    </Link>
                  </li>
                ))}
              </ol>
            </section>
          );
        })}
      </div>
    </div>
  );
}