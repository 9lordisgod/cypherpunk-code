"use client";

import { Suspense } from "react";
import { CatalogClient } from "@/components/CatalogClient";
import { useLanguage } from "@/components/LanguageProvider";
import type { Resource } from "@/lib/types";

export function CatalogPageContent({ resources }: { resources: Resource[] }) {
  const { t } = useLanguage();

  return (
    <div className="page-content">
      <header className="page-header">
        <p className="page-header__eyebrow">Resource Index</p>
        <h1 className="section-title page-header__title">{t("catalogTitle")}</h1>
        <p className="page-header__desc">
          {t("catalogDescription", { count: resources.length })}
        </p>
      </header>
      <Suspense
        fallback={
          <div className="pixel-panel p-12 text-center text-muted">
            {t("catalogLoading")}
          </div>
        }
      >
        <CatalogClient resources={resources} />
      </Suspense>
    </div>
  );
}