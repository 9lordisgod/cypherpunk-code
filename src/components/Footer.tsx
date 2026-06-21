"use client";

import Link from "next/link";
import { useLanguage } from "@/components/LanguageProvider";
import { PixelCanadaFlag } from "@/components/pixel/PixelCanadaFlag";
import { SiteLogo } from "@/components/SiteLogo";
import { site } from "@/lib/data";

export function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="site-footer mt-auto">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <SiteLogo size="sm" />
              <p className="site-logo-text">{site.name}</p>
            </div>
            <p className="mt-1 text-xs" style={{ color: "var(--accent-orange)" }}>
              {site.domain}
            </p>
            <p className="mt-1 max-w-sm text-sm text-muted">{t("footerTagline")}</p>
            <p className="mt-3 flex items-center gap-2 text-xs text-muted">
              <PixelCanadaFlag className="h-3 w-6" />
              {t("heroCanadaProud")}
            </p>
            <p className="mt-4 text-xs text-muted">
              {t("heroCuratedBy")}{" "}
              <a
                href={site.creator.url}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
                style={{ color: "var(--accent-orange)" }}
              >
                @{site.creator.handle}
              </a>
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 text-sm min-[400px]:grid-cols-2 sm:grid-cols-3 sm:gap-8">
            <div>
              <p className="footer-heading mb-2">{t("footerExplore")}</p>
              <ul className="space-y-1">
                <li>
                  <Link href="/catalog" className="text-muted hover:text-foreground no-underline">
                    {t("navCatalog")}
                  </Link>
                </li>
                <li>
                  <Link href="/paths" className="text-muted hover:text-foreground no-underline">
                    {t("navPaths")}
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="text-muted hover:text-foreground no-underline">
                    {t("navAbout")}
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <p className="footer-heading mb-2">{t("footerCommunity")}</p>
              <ul className="space-y-1">
                <li>
                  <a
                    href={site.creator.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted hover:text-foreground no-underline"
                  >
                    @{site.creator.handle}
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <p className="footer-heading mb-2">{t("footerSupport")}</p>
              <ul className="space-y-1">
                <li>
                  <Link href="/about#donate" className="text-muted hover:text-foreground no-underline">
                    {t("footerDonate")}
                  </Link>
                </li>
                <li>
                  <Link href="/roadmap" className="text-muted hover:text-foreground no-underline">
                    {t("navRoadmap")}
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <p className="mt-8 border-t-2 border-border pt-6 text-center text-xs leading-relaxed text-muted">
          {t("footerBottom")}
        </p>
      </div>
    </footer>
  );
}