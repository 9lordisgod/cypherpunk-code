"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { PreviewSiteLogo } from "@/components/preview/PreviewSiteLogo";
import { site } from "@/lib/data";

const navItems = [
  { href: "/doc/", label: "Beacon" },
  { href: "/catalog", label: "Catalog" },
  { href: "/paths", label: "Learning Path" },
  { href: "/about", label: "About" },
];

export function PreviewHeader() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`preview-header${scrolled ? " preview-header--scrolled" : ""}`}
    >
      <div className="preview-header__inner">
        <Link href="/" className="preview-header__brand">
          <PreviewSiteLogo size="lg" />
          <span className="preview-header__name">{site.name}</span>
        </Link>
        <nav className="preview-header__nav" aria-label="Main">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`preview-nav-link ${
                pathname === item.href || pathname.startsWith(`${item.href}/`)
                  ? "preview-nav-link--active"
                  : ""
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}