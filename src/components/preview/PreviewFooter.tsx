"use client";

import Link from "next/link";
import { PreviewSiteLogo } from "@/components/preview/PreviewSiteLogo";
import { site } from "@/lib/data";

const footerLinks = [
  { href: "/catalog", label: "Catalog" },
  { href: "/paths", label: "Learning Path" },
  { href: "/doc/", label: "Beacon" },
  { href: "/about", label: "About" },
];

export function PreviewFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="preview-footer">
      <div className="preview-footer__inner">
        <div className="preview-footer__brand-block">
          <div className="preview-footer__brand">
            <PreviewSiteLogo size="md" />
            <div>
              <span className="preview-footer__name">{site.name}</span>
              <p className="preview-footer__tagline">{site.tagline}</p>
            </div>
          </div>
          <p className="preview-footer__desc">{site.description}</p>
        </div>
        <nav className="preview-footer__links" aria-label="Footer">
          {footerLinks.map((link) => (
            <Link key={link.href} href={link.href} className="preview-footer__link">
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
      <p className="preview-footer__bottom">
        © {year} {site.name}. Cryptographic research &amp; freedom education.
      </p>
    </footer>
  );
}