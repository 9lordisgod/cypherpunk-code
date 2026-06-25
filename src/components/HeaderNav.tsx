"use client";

import Link from "next/link";
import type { Session } from "next-auth";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AuthButton } from "@/components/auth/AuthButton";
import { useLanguage } from "@/components/LanguageProvider";
import { SiteLogo } from "@/components/SiteLogo";
import { site } from "@/lib/data";
import { LOCALE_LABELS } from "@/lib/i18n/types";

const navHrefs = [
  { href: "/doc/", key: "navDoc" as const, highlight: true },
  { href: "/catalog", key: "navCatalog" as const },
  { href: "/paths", key: "navPaths" as const },
  { href: "/about", key: "navAbout" as const },
];

export function HeaderNav({
  session,
  desktopAuthShell,
  mobileAuthShell,
}: {
  session: Session | null;
  desktopAuthShell: React.ReactNode;
  mobileAuthShell: React.ReactNode;
}) {
  const { t, openPicker, locale } = useLanguage();
  const pathname = usePathname();
  const [menuState, setMenuState] = useState({ path: pathname, open: false });

  const menuOpen = menuState.open && menuState.path === pathname;

  const toggleMenu = () => {
    setMenuState((current) =>
      current.open && current.path === pathname
        ? { path: pathname, open: false }
        : { path: pathname, open: true }
    );
  };

  const closeMenu = () => setMenuState({ path: pathname, open: false });

  useEffect(() => {
    document.body.classList.toggle("mobile-menu-open", menuOpen);
    return () => document.body.classList.remove("mobile-menu-open");
  }, [menuOpen]);

  return (
    <header className="site-header sticky top-0 z-50 backdrop-blur-md">
      <div className="mx-auto max-w-6xl px-4 py-3 sm:px-6">
        <div className="flex items-center justify-between gap-3">
          <Link
            href="/"
            className="group flex flex-1 items-center gap-2 no-underline text-foreground"
          >
            <SiteLogo size="md" />
            <span className="site-logo-text leading-snug whitespace-normal">
              {site.name}
            </span>
          </Link>

          <nav
            className="hidden items-center gap-1 md:flex md:gap-2"
            aria-label="Main"
          >
            {navHrefs.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`nav-link no-underline hover:text-foreground ${
                  "highlight" in item && item.highlight
                    ? "text-accent-orange font-semibold"
                    : "text-muted"
                }`}
              >
                {t(item.key)}
              </Link>
            ))}
            <div className="auth-slot" suppressHydrationWarning>
              {desktopAuthShell}
              <AuthButton initialSession={session} />
            </div>
            <button
              type="button"
              onClick={openPicker}
              className="lang-toggle"
              aria-label={t("navLanguage")}
              title={t("navLanguage")}
            >
              <span aria-hidden="true">{LOCALE_LABELS[locale].flag}</span>
              <span>{LOCALE_LABELS[locale].native}</span>
            </button>
          </nav>

          <div className="flex shrink-0 items-center gap-1 md:hidden">
            <button
              type="button"
              onClick={openPicker}
              className="lang-toggle"
              aria-label={t("navLanguage")}
              title={t("navLanguage")}
            >
              <span aria-hidden="true">{LOCALE_LABELS[locale].flag}</span>
            </button>
            <button
              type="button"
              onClick={toggleMenu}
              className="mobile-menu-btn"
              aria-expanded={menuOpen}
              aria-controls="mobile-nav"
              aria-label={menuOpen ? t("navMenuClose") : t("navMenuOpen")}
            >
              <span className="mobile-menu-btn__bar" />
              <span className="mobile-menu-btn__bar" />
              <span className="mobile-menu-btn__bar" />
            </button>
          </div>
        </div>

        {menuOpen && (
          <nav
            id="mobile-nav"
            className="mobile-nav"
            aria-label="Main"
          >
            {navHrefs.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href === "/doc/" && pathname.startsWith("/doc"));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`mobile-nav-link no-underline ${isActive ? "mobile-nav-link--active" : ""} ${
                    "highlight" in item && item.highlight ? "text-accent-orange" : ""
                  }`}
                  onClick={closeMenu}
                >
                  {t(item.key)}
                </Link>
              );
            })}
            <div className="auth-slot auth-slot--mobile" suppressHydrationWarning>
              {mobileAuthShell}
              <AuthButton mobile initialSession={session} />
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}