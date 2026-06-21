"use client";

import { useLanguage } from "@/components/LanguageProvider";

export function PreviewBanner() {
  const { t } = useLanguage();

  return (
    <div className="preview-banner" role="status">
      <p className="text-sm">
        <span className="preview-banner__badge">{t("coursesPreviewBadge")}</span>
        {t("coursesPreviewNotice")}
      </p>
    </div>
  );
}