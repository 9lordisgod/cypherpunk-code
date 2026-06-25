"use client";

import Link from "next/link";
import { PreviewSiteLogo } from "@/components/preview/PreviewSiteLogo";
import { site } from "@/lib/data";

export function PreviewFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="preview-footer">
      <div className="preview-footer__inner">
        <div>
          <div className="preview-footer__brand">
            <PreviewSiteLogo size="sm" />
            <span className="preview-footer__name">{site.name}</span>
          </div>
        </div>
        <div className="preview-footer__links">
          <Link href="/catalog" className="preview-footer__link">
            Catalog
          </Link>
          <Link href="/paths" className="preview-footer__link">
            Learning Path
          </Link>
          <Link href="/about" className="preview-footer__link">
            About
          </Link>
        </div>
      </div>
      <p className="preview-footer__bottom">
        © {year} {site.name}. All rights reserved.
      </p>
    </footer>
  );
}