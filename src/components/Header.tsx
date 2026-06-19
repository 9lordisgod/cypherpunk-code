"use client";

import Link from "next/link";
import { useLanguage } from "@/components/LanguageProvider";
import { SiteLogo } from "@/components/SiteLogo";
import { site } from "@/lib/data";
import { LOCALE_LABELS } from "@/lib/i18n/types";

const navHrefs = [
  { href: "/catalog", key: "navCatalog" as const },
  { href: "/paths", key: "navPaths" as const },
  { href: "/about", key: "navAbout" as const },
  { href: "/roadmap", key: "navRoadmap" as const },
];

export function Header() {
  const { t, openPicker, locale } = useLanguage();

  return (
    <header className="site-header sticky top-0 z-50 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <Link href="/" className="group flex items-center gap-2 no-underline text-foreground">
          <SiteLogo size="md" />
          <span className="site-logo-text">{site.name}</span>
        </Link>
        <nav className="flex items-center gap-1 sm:gap-2">
          {navHrefs.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="nav-link no-underline text-muted hover:text-foreground"
            >
              {t(item.key)}
            </Link>
          ))}
          <button
            type="button"
            onClick={openPicker}
            className="lang-toggle"
            aria-label={t("navLanguage")}
            title={t("navLanguage")}
          >
            <span aria-hidden="true">{LOCALE_LABELS[locale].flag}</span>
            <span className="hidden sm:inline">{LOCALE_LABELS[locale].native}</span>
          </button>
        </nav>
      </div>
    </header>
  );
}