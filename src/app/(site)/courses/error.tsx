"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useLanguage } from "@/components/LanguageProvider";

export default function CoursesError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const { t } = useLanguage();

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 text-center sm:px-6">
      <h1 className="section-title text-xl">{t("coursesErrorTitle")}</h1>
      <p className="mt-4 text-muted leading-relaxed">{t("coursesErrorDescription")}</p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <button type="button" onClick={reset} className="pixel-btn pixel-btn--accent text-sm">
          {t("coursesErrorRetry")}
        </button>
        <Link href="/courses" className="pixel-btn pixel-btn--ghost no-underline text-sm">
          {t("coursesErrorBack")}
        </Link>
      </div>
    </div>
  );
}