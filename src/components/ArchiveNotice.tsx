"use client";

import Link from "next/link";
import { useLanguage } from "@/components/LanguageProvider";
import { site } from "@/lib/data";

type Variant = "compact" | "full";

export function ArchiveNotice({ variant = "compact" }: { variant?: Variant }) {
  const { t } = useLanguage();

  if (variant === "compact") {
    return (
      <p className="text-sm text-muted">
        {t("archiveNotice")}{" "}
        <a
          href={site.contact.x.url}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:underline"
          style={{ color: "var(--accent-orange)" }}
        >
          {t("archiveContact")} @{site.contact.x.handle}
        </a>
        .
      </p>
    );
  }

  return (
    <section className="pixel-panel p-6">
      <p className="footer-heading" style={{ color: "var(--accent)" }}>
        {t("archivePolicyTitle")}
      </p>
      <div className="mt-3 space-y-3 text-sm leading-relaxed text-muted">
        <p>{t("archivePolicy1", { name: site.name })}</p>
        <p>{t("archivePolicy2")}</p>
        <p>{t("archivePolicy3", { handle: `@${site.contact.x.handle}` })}</p>
      </div>
      <Link
        href="/about#policy"
        className="mt-4 inline-block text-xs hover:underline"
        style={{ color: "var(--accent-orange)" }}
      >
        {t("archiveReadPolicy")} →
      </Link>
    </section>
  );
}