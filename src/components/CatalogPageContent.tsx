"use client";

import { Suspense } from "react";
import { CatalogClient } from "@/components/CatalogClient";
import { useLanguage } from "@/components/LanguageProvider";
import type { Resource } from "@/lib/types";

export function CatalogPageContent({ resources }: { resources: Resource[] }) {
  const { t } = useLanguage();

  return (
    <div className="page-content">
      <div className="mb-8">
        <h1 className="section-title text-2xl sm:text-3xl">{t("catalogTitle")}</h1>
        <p className="mt-2 max-w-2xl text-muted">
          {t("catalogDescription", { count: resources.length })}
        </p>
      </div>
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