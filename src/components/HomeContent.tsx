"use client";

import Link from "next/link";
import { ArchiveNotice } from "@/components/ArchiveNotice";
import { useLanguage } from "@/components/LanguageProvider";
import { ResourceCard } from "@/components/ResourceCard";
import { HeroAnimeFigure } from "@/components/HeroAnimeFigure";
import { SiteLogo } from "@/components/SiteLogo";
import type { LearningPath, Resource } from "@/lib/types";
import { usePathText } from "@/lib/i18n/usePathText";
import { useTranslatedLabels } from "@/lib/i18n/useTranslatedLabels";
import { site } from "@/lib/data";
import { useEffect } from "react";

type HomeContentProps = {
  featured: Resource[];
  topicCounts: Record<string, number>;
  typeCounts: Record<string, number>;
  learningPaths: LearningPath[];
  resourceCount: number;
  freeCount: number;
  creatorHandle: string;
  creatorUrl: string;
};

export function HomeContent({
  featured,
  topicCounts,
  typeCounts,
  learningPaths,
  resourceCount,
  freeCount,
  creatorHandle,
  creatorUrl,
}: HomeContentProps) {
  const { t } = useLanguage();
  const { topicLabels } = useTranslatedLabels();
  const { getPathTitle, getPathDescription } = usePathText();

  useEffect(() => {
    document.title = site.name;
  }, [t]);

  return (
    <div>
      <section className="hero-section scanline-overlay relative">
        <div className="grid-bg absolute inset-0 opacity-50" />
        <div className="relative mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-16 lg:py-24">
          <div className="hero-inner">
            <div className="hero-content">
              <p className="hero-badge">
                <SiteLogo size="sm" />
                <span>{t("heroBadge")}</span>
              </p>
              <h1 className="hero-title max-w-3xl">
                {t("heroTitle1")}
                <br />
                <span className="hero-title-muted">{t("heroTitle2")}</span>
              </h1>
              <p className="mt-6 max-w-2xl text-lg text-muted leading-relaxed">
                {t("heroDescription")}
              </p>
              <div className="hero-actions mt-8">
                <Link
                  href="/courses"
                  className="pixel-btn pixel-btn--planb no-underline"
                >
                  {t("heroCourses")} →
                </Link>
                <Link
                  href="/catalog"
                  className="pixel-btn pixel-btn--accent no-underline"
                >
                  {t("heroBrowse", { count: resourceCount })} →
                </Link>
                <Link href="/paths" className="pixel-btn pixel-btn--ghost no-underline">
                  {t("heroPaths")}
                </Link>
              </div>
              <div className="mt-6 max-w-2xl">
                <ArchiveNotice />
              </div>
              <p className="mt-3 text-sm text-muted">
                {t("heroCuratedBy")}{" "}
                <a
                  href={creatorUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                  style={{ color: "var(--accent-orange)" }}
                >
                  @{creatorHandle}
                </a>
              </p>
            </div>
            <HeroAnimeFigure />
          </div>
        </div>
      </section>

      <section className="border-y-4 border-border bg-card">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="max-w-2xl">
              <p
                className="font-mono text-xs uppercase tracking-wider"
                style={{ color: "var(--accent-orange)" }}
              >
                DOC
              </p>
              <h2 className="section-title mt-2 text-xl sm:text-2xl">
                {t("docBannerTitle")}
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-muted">
                {t("docBannerDescription")}
              </p>
            </div>
            <Link
              href="/doc/"
              className="pixel-btn pixel-btn--accent shrink-0 no-underline self-start sm:self-center"
            >
              {t("docBannerCta")}
            </Link>
          </div>
        </div>
      </section>

      <section className="border-b-4 border-border bg-card">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <p className="courses-hero__eyebrow">{t("homeCourseEyebrow")}</p>
              <h2 className="section-title text-lg sm:text-xl">{t("homeCourseTitle")}</h2>
              <p className="mt-3 text-muted leading-relaxed">{t("homeCourseSubtitle")}</p>
            </div>
            <Link href="/courses" className="pixel-btn pixel-btn--planb no-underline shrink-0">
              {t("coursesStartJourney")} →
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="section-header mb-8">
          <div>
            <h2 className="section-title">{t("featuredTitle")}</h2>
            <p className="mt-2 text-sm text-muted">{t("featuredSubtitle")}</p>
          </div>
          <Link
            href="/catalog"
            className="section-header-link text-sm hover:underline"
            style={{ color: "var(--accent-orange)" }}
          >
            {t("viewAll")}
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {featured.slice(0, 6).map((resource) => (
            <ResourceCard key={resource.id} resource={resource} />
          ))}
        </div>
      </section>

      <section className="border-y-4 border-border bg-card">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <h2 className="section-title mb-8">{t("browseByTopic")}</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {Object.entries(topicLabels)
              .filter(([key]) => topicCounts[key])
              .sort((a, b) => (topicCounts[b[0]] ?? 0) - (topicCounts[a[0]] ?? 0))
              .map(([key, label]) => (
                <Link
                  key={key}
                  href={`/topics/${key}`}
                  className="topic-pill flex items-center justify-between no-underline text-foreground"
                >
                  <span>{label}</span>
                  <span className="text-muted">{topicCounts[key]}</span>
                </Link>
              ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="section-header mb-8">
          <div>
            <h2 className="section-title">{t("learningPathsTitle")}</h2>
            <p className="mt-2 text-sm text-muted">{t("learningPathsSubtitle")}</p>
          </div>
          <Link
            href="/paths"
            className="section-header-link text-sm hover:underline"
            style={{ color: "var(--accent-orange)" }}
          >
            {t("allPaths")}
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {learningPaths.slice(0, 3).map((path) => (
            <Link
              key={path.id}
              href={`/paths#${path.id}`}
              className="pixel-card block p-5 no-underline text-foreground"
            >
              <h3 className="font-semibold" style={{ fontFamily: "var(--font-pixel)", fontSize: "10px", lineHeight: 1.8 }}>
                {getPathTitle(path.id, path.title)}
              </h3>
              <p className="mt-2 line-clamp-2 text-sm text-muted">
                {getPathDescription(path.id, path.description)}
              </p>
              <p className="mt-3 text-xs" style={{ color: "var(--accent)" }}>
                {t("steps", { count: path.resourceIds.length })}
              </p>
            </Link>
          ))}
        </div>
      </section>

      <section className="border-t-4 border-border bg-card">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
          <div className="stats-grid text-center">
            <div className="stat-box">
              <p className="stat-number">{resourceCount}</p>
              <p className="mt-1 text-xs text-muted">{t("statResources")}</p>
            </div>
            <div className="stat-box">
              <p className="stat-number">{learningPaths.length}</p>
              <p className="mt-1 text-xs text-muted">{t("statPaths")}</p>
            </div>
            <div className="stat-box">
              <p className="stat-number">{Object.keys(typeCounts).length}</p>
              <p className="mt-1 text-xs text-muted">{t("statTypes")}</p>
            </div>
            <div className="stat-box">
              <p className="stat-number">{freeCount}</p>
              <p className="mt-1 text-xs text-muted">{t("statFree")}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}