"use client";

import Link from "next/link";
import { useLanguage } from "@/components/LanguageProvider";
import { resources, site } from "@/lib/data";
import type { LearningPath, Resource } from "@/lib/types";
import { usePathText } from "@/lib/i18n/usePathText";
import { useTranslatedLabels } from "@/lib/i18n/useTranslatedLabels";

type HomeContentPreviewProps = {
  featured: Resource[];
  learningPaths: LearningPath[];
  resourceCount: number;
};

function PreviewResourceCard({ resource }: { resource: Resource }) {
  const { typeLabels: types } = useTranslatedLabels();

  return (
    <Link
      href={`/resource/${resource.id}`}
      className="preview-card preview-card--premium preview-inview"
    >
      <div className="preview-card__top">
        <span className="preview-card__meta">{types[resource.type]}</span>
        <span className="preview-card__score">CP {resource.cypherpunkScore}</span>
      </div>
      <h3 className="preview-card__title">{resource.title}</h3>
      <p className="preview-card__desc">{resource.description}</p>
      <span className="preview-card__footer">View resource</span>
    </Link>
  );
}

export function HomeContentPreview({
  featured,
  learningPaths,
  resourceCount,
}: HomeContentPreviewProps) {
  const { t } = useLanguage();
  const { getPathTitle, getPathDescription } = usePathText();

  const freeCount = resources.filter((r) => r.pricing === "free").length;
  const typeCount = new Set(resources.map((r) => r.type)).size;

  const stats = [
    { label: t("statResources"), value: resourceCount },
    { label: t("statPaths"), value: learningPaths.length },
    { label: t("statTypes"), value: typeCount },
    { label: t("statFree"), value: freeCount },
  ];

  const exploreLinks: {
    href: string;
    label: string;
    desc: string;
    external?: boolean;
  }[] = [
    { href: "/catalog", label: t("navCatalog"), desc: `${resourceCount} curated resources` },
    { href: "/paths", label: t("navPaths"), desc: "Structured learning sequences" },
    { href: "/doc", label: t("navDoc"), desc: "Documentation & mission", external: true },
    { href: "/about", label: t("navAbout"), desc: "Project & policy" },
  ];

  return (
    <>
      <section className="preview-hero preview-hero--centered preview-inview">
        <p className="preview-hero__eyebrow">{t("heroBadge")}</p>
        <h1 className="preview-hero__title preview-hero__title--static">
          <span className="preview-hero__title-line">{t("heroTitle1")}</span>
          <span className="preview-hero__title-line preview-hero__title-accent">
            {t("heroTitle2")}
          </span>
        </h1>
        <p className="preview-hero__subtitle">{t("heroDescription")}</p>
        <Link
          href="/catalog"
          className="preview-btn preview-btn--solid preview-hero__cta"
        >
          {t("heroBrowse", { count: resourceCount })}
        </Link>
        <p className="preview-hero__curator">
          {t("heroCuratedBy")}{" "}
          <a
            href={site.creator.url}
            target="_blank"
            rel="noopener noreferrer"
            className="preview-hero__curator-link"
          >
            {site.creator.handle}
          </a>
        </p>
      </section>

      <section className="preview-stats preview-inview" aria-label="Platform metrics">
        <div className="preview-stats__inner">
          {stats.map((stat) => (
            <div key={stat.label} className="preview-stat">
              <p className="preview-stat__value">{stat.value}</p>
              <p className="preview-stat__label">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="preview-section preview-section--premium preview-inview">
        <div className="preview-section__inner">
          <header className="preview-section__header preview-section__header--row">
            <div>
              <p className="preview-section__eyebrow">{t("featuredSubtitle")}</p>
              <h2 className="preview-section__title">{t("featuredTitle")}</h2>
            </div>
            <Link href="/catalog" className="preview-section__link">
              {t("viewAll")}
            </Link>
          </header>
          <div className="preview-grid preview-grid--3">
            {featured.slice(0, 3).map((resource) => (
              <PreviewResourceCard key={resource.id} resource={resource} />
            ))}
          </div>
        </div>
      </section>

      <section className="preview-section preview-section--premium preview-section--surface preview-inview">
        <div className="preview-section__inner">
          <header className="preview-section__header preview-section__header--row">
            <div>
              <p className="preview-section__eyebrow">Curriculum</p>
              <h2 className="preview-section__title">{t("learningPathsTitle")}</h2>
              <p className="preview-section__desc">{t("learningPathsSubtitle")}</p>
            </div>
            <Link href="/paths" className="preview-section__link">
              {t("allPaths")}
            </Link>
          </header>
          <div className="preview-path-list preview-path-list--compact">
            {learningPaths.map((path) => (
              <Link
                key={path.id}
                href={`/paths#${path.id}`}
                className="preview-path-item preview-path-item--premium preview-inview"
              >
                <div className="preview-path-item__body">
                  <p className="preview-path-item__title">
                    {getPathTitle(path.id, path.title)}
                  </p>
                  <p className="preview-path-item__desc">
                    {getPathDescription(path.id, path.description)}
                  </p>
                </div>
                <span className="preview-path-item__steps">
                  {t("steps", { count: path.resourceIds.length })}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="preview-explore preview-inview">
        <div className="preview-explore__inner">
          <h2 className="preview-explore__title">Explore the platform</h2>
          <div className="preview-explore__grid">
            {exploreLinks.map((link) =>
              link.external ? (
                <a key={link.href} href={link.href} className="preview-explore__card">
                  <span className="preview-explore__card-label">{link.label}</span>
                  <span className="preview-explore__card-desc">{link.desc}</span>
                </a>
              ) : (
                <Link key={link.href} href={link.href} className="preview-explore__card">
                  <span className="preview-explore__card-label">{link.label}</span>
                  <span className="preview-explore__card-desc">{link.desc}</span>
                </Link>
              )
            )}
          </div>
        </div>
      </section>
    </>
  );
}