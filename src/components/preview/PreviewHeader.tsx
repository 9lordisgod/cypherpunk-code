"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { PreviewSiteLogo } from "@/components/preview/PreviewSiteLogo";
import { site } from "@/lib/data";

type NavItem = {
  href: string;
  label: string;
  external?: boolean;
};

const navItems: NavItem[] = [
  { href: "/catalog", label: "Catalog" },
  { href: "/paths", label: "Learning Path" },
  { href: "/doc", label: "Beacon", external: true },
  { href: "/about", label: "About" },
];

function isNavActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  if (href === "/doc") return pathname.startsWith("/doc");
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function PreviewHeader() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuPath, setMenuPath] = useState<string | null>(null);
  const menuOpen = menuPath === pathname;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.classList.toggle("preview-menu-open", menuOpen);
    return () => document.body.classList.remove("preview-menu-open");
  }, [menuOpen]);

  useEffect(() => {
    if (!menuOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuPath(null);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [menuOpen]);

  const navLinkClass = (href: string) =>
    `preview-nav-link ${
      isNavActive(pathname, href) ? "preview-nav-link--active" : ""
    }`;

  return (
    <header
      className={`preview-header${scrolled ? " preview-header--scrolled" : ""}${menuOpen ? " preview-header--menu-open" : ""}`}
    >
      <div className="preview-header__inner">
        <Link href="/" className="preview-header__brand">
          <PreviewSiteLogo size="xl" />
          <span className="preview-header__name">{site.name}</span>
        </Link>

        <nav className="preview-header__nav" aria-label="Main">
          <div className="preview-header__nav-pill">
            {navItems.map((item) =>
              item.external ? (
                <a
                  key={item.href}
                  href={item.href}
                  className={navLinkClass(item.href)}
                >
                  {item.label}
                </a>
              ) : (
                <Link
                  key={item.href}
                  href={item.href}
                  className={navLinkClass(item.href)}
                >
                  {item.label}
                </Link>
              )
            )}
          </div>
        </nav>

        <button
          type="button"
          className={`preview-header__menu-btn${menuOpen ? " preview-header__menu-btn--open" : ""}`}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          aria-controls="preview-mobile-nav"
          onClick={() => setMenuPath(menuOpen ? null : pathname)}
        >
          <span className="preview-header__menu-icon" aria-hidden="true">
            <span className="preview-header__menu-bar" />
            <span className="preview-header__menu-bar" />
            <span className="preview-header__menu-bar" />
          </span>
        </button>
      </div>

      <div
        id="preview-mobile-nav"
        className={`preview-mobile-nav${menuOpen ? " preview-mobile-nav--open" : ""}`}
        hidden={!menuOpen}
      >
        <nav className="preview-mobile-nav__inner" aria-label="Mobile">
          {navItems.map((item) =>
            item.external ? (
              <a
                key={item.href}
                href={item.href}
                className={`preview-mobile-nav__link ${
                  isNavActive(pathname, item.href)
                    ? "preview-mobile-nav__link--active"
                    : ""
                }`}
                onClick={() => setMenuPath(null)}
              >
                {item.label}
              </a>
            ) : (
              <Link
                key={item.href}
                href={item.href}
                className={`preview-mobile-nav__link ${
                  isNavActive(pathname, item.href)
                    ? "preview-mobile-nav__link--active"
                    : ""
                }`}
                onClick={() => setMenuPath(null)}
              >
                {item.label}
              </Link>
            )
          )}
        </nav>
      </div>
    </header>
  );
}