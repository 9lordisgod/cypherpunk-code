"use client";

import Link from "next/link";

const labItems = [
  {
    status: "Active",
    title: "CP Score Research",
    description:
      "Editorial scoring methodology for ranking cypherpunk relevance across the resource catalog.",
  },
  {
    status: "In progress",
    title: "Learning Path Engine",
    description:
      "Structured curriculum sequencing from foundations through Bitcoin sovereignty and Monero privacy.",
  },
  {
    status: "Planned",
    title: "Resource Submission",
    description:
      "Community-driven catalog expansion with review workflow and metadata standards.",
  },
  {
    status: "Planned",
    title: "Open Data Layer",
    description:
      "Publish catalog, paths, and site metadata under an open license for researchers and builders.",
  },
];

export function PreviewLabContent() {
  return (
    <div className="preview-doc-layout">
      <aside className="preview-sidebar">
        <p className="preview-sidebar__title">Lab</p>
        <Link href="/preview/doc" className="preview-sidebar__link">
          Beacon
        </Link>
        <Link href="/preview/lab" className="preview-sidebar__link preview-sidebar__link--active">
          Research Lab
        </Link>
        <Link href="/preview/catalog" className="preview-sidebar__link">
          Catalog
        </Link>
        <Link href="/preview/paths" className="preview-sidebar__link">
          Learning Path
        </Link>
      </aside>

      <div className="preview-doc-content">
        <h1>Lab</h1>
        <p>
          Experimental research and platform infrastructure. The lab hosts
          methodology, data standards, and tools that power the education index.
        </p>

        <div className="preview-lab-grid">
          {labItems.map((item) => (
            <div key={item.title} className="preview-lab-card">
              <p className="preview-lab-card__status">{item.status}</p>
              <h2 className="preview-lab-card__title">{item.title}</h2>
              <p className="preview-lab-card__desc">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}