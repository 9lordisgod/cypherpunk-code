"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/components/LanguageProvider";
import {
  SidebarKeyIcon,
  SidebarNodeIcon,
  SidebarPrivacyIcon,
} from "@/components/preview/illustrations/PreviewIllustrations";

const docPages = [
  {
    href: "/doc/doc/mission.html",
    title: "Mission",
    description: "Why Cypherpunk Code exists and what it aims to accomplish.",
  },
  {
    href: "/doc/doc/how-to-study.html",
    title: "How to Study",
    description: "Get the most from the platform — paths, catalog, and CP Score.",
  },
  {
    href: "/doc/doc/platform-guide.html",
    title: "Platform Guide",
    description: "Feature overview and practical usage for every section.",
  },
  {
    href: "/doc/doc/openness-policy.html",
    title: "Openness Policy",
    description: "Data, documentation, and codebase openness commitments.",
  },
  {
    href: "/doc/doc/roadmap.html",
    title: "Roadmap",
    description: "Public milestones and what is shipping next.",
  },
];

const sidebarLinks = [
  { href: "/doc/", label: "Documentation" },
  { href: "/preview/lab", label: "Lab" },
  { href: "/preview/catalog", label: "Catalog" },
  { href: "/preview/about", label: "About" },
];

export function PreviewDocContent() {
  const pathname = usePathname();
  const { t } = useLanguage();

  return (
    <div className="preview-doc-layout preview-reveal">
      <aside className="preview-sidebar">
        <div className="preview-sidebar__icons" aria-hidden="true">
          <SidebarPrivacyIcon className="preview-sidebar__icon" />
          <SidebarKeyIcon className="preview-sidebar__icon" />
          <SidebarNodeIcon className="preview-sidebar__icon" />
        </div>
        <p className="preview-sidebar__title">Beacon</p>
        {sidebarLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`preview-sidebar__link ${pathname === link.href ? "preview-sidebar__link--active" : ""}`}
          >
            {link.label}
          </Link>
        ))}
        <p className="preview-sidebar__title" style={{ marginTop: 32 }}>
          Documentation
        </p>
        {docPages.map((page) => (
          <a
            key={page.href}
            href={page.href}
            className="preview-sidebar__link"
            target="_blank"
            rel="noopener noreferrer"
          >
            {page.title}
          </a>
        ))}
      </aside>

      <div className="preview-doc-content">
        <h1>Documentation</h1>
        <p>
          Guides, mission, and platform reference for cypherpunk education.
          All documentation pages use the same clean design as the main site.
        </p>

        <div className="preview-doc-list">
          {docPages.map((page) => (
            <a
              key={page.href}
              href={page.href}
              className="preview-doc-list__item"
              target="_blank"
              rel="noopener noreferrer"
            >
              <div>
                <p className="preview-doc-list__item-title">{page.title}</p>
                <p className="preview-doc-list__item-desc">{page.description}</p>
              </div>
              <span className="preview-section__link">Read →</span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}