"use client";

import Link from "next/link";
import { useLanguage } from "@/components/LanguageProvider";
import { PreviewVisualDivider } from "@/components/preview/PreviewVisualDivider";
import {
  HeroIllustration,
  ProtocolsIllustration,
} from "@/components/preview/illustrations/PreviewIllustrations";
import { site } from "@/lib/data";
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
    <Link href={`/resource/${resource.id}`} className="preview-card">
      <p className="preview-card__meta">{types[resource.type]}</p>
      <h3 className="preview-card__title">{resource.title}</h3>
      <p className="preview-card__desc">{resource.description}</p>
      <p className="preview-card__footer">Read more →</p>
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

  return (
    <>
      <section className="preview-hero preview-hero--split">
        <div className="preview-hero__content">
          <p className="preview-hero__brand">{site.name}</p>
          <h1 className="preview-hero__title">
            {t("heroTitle1")} {t("heroTitle2")}
          </h1>
          <p className="preview-hero__subtitle">{t("heroDescription")}</p>
          <Link href="/catalog" className="preview-btn preview-hero__cta">
            {t("heroBrowse", { count: resourceCount })}
          </Link>
        </div>
        <div className="preview-hero__visual preview-reveal" aria-hidden="true">
          <HeroIllustration className="preview-hero__illus" />
        </div>
      </section>

      <PreviewVisualDivider variant="nodes" />

      <section className="preview-section preview-section--split preview-reveal">
        <div className="preview-section__inner">
          <div className="preview-section__header preview-section__header--with-visual">
            <div>
              <p className="preview-section__eyebrow">Learning Path</p>
              <h2 className="preview-section__title">{t("learningPathsTitle")}</h2>
              <p className="preview-section__desc">{t("learningPathsSubtitle")}</p>
              <Link href="/paths" className="preview-section__link">
                {t("allPaths")} →
              </Link>
            </div>
            <div className="preview-section__visual preview-section__visual--compact">
              <ProtocolsIllustration className="preview-section__illus" />
            </div>
          </div>
          <div className="preview-path-list">
            {learningPaths.slice(0, 3).map((path) => (
              <Link
                key={path.id}
                href={`/paths#${path.id}`}
                className="preview-path-item"
              >
                <div>
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

      <PreviewVisualDivider variant="encryption" />

      <section className="preview-section preview-section--surface preview-reveal">
        <div className="preview-section__inner">
          <div className="preview-section__header preview-section__header--center">
            <h2 className="preview-section__title">{t("featuredTitle")}</h2>
            <p className="preview-section__desc">{t("featuredSubtitle")}</p>
          </div>
          <div className="preview-grid preview-grid--3">
            {featured.slice(0, 3).map((resource) => (
              <PreviewResourceCard key={resource.id} resource={resource} />
            ))}
          </div>
          <div className="preview-section__cta-center">
            <Link href="/catalog" className="preview-btn">
              {t("viewAll")} →
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}