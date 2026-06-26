"use client";

import Link from "next/link";
import { useLanguage } from "@/components/LanguageProvider";
import { PreviewPageWrap } from "@/components/preview/PreviewPageWrap";

export default function NotFound() {
  const { t } = useLanguage();

  return (
    <PreviewPageWrap>
    <div className="page-content page-content--narrow text-center">
      <h1 className="section-title text-2xl">{t("notFoundTitle")}</h1>
      <p className="mt-4 text-muted">{t("notFoundDescription")}</p>
      <div className="mt-8 flex flex-wrap justify-center gap-4">
        <Link
          href="/"
          className="inline-block rounded bg-accent px-6 py-3 font-mono text-sm text-background no-underline transition-opacity hover:opacity-90"
        >
          {t("notFoundBackHome")}
        </Link>
        <Link
          href="/catalog"
          className="inline-block rounded border border-border px-6 py-3 font-mono text-sm text-muted no-underline transition-colors hover:text-foreground"
        >
          {t("navCatalog")}
        </Link>
      </div>
    </div>
    </PreviewPageWrap>
  );
}