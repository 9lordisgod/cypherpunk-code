"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useLanguage } from "@/components/LanguageProvider";
import { site } from "@/lib/data";

const phases = [
  {
    id: "phase-1",
    status: "live" as const,
    labelKey: "roadmapPhase1Label" as const,
    periodKey: "roadmapPeriodNow" as const,
    itemKeys: [
      "roadmapPhase1Item1",
      "roadmapPhase1Item2",
      "roadmapPhase1Item3",
      "roadmapPhase1Item4",
      "roadmapPhase1Item5",
      "roadmapPhase1Item6",
    ] as const,
  },
  {
    id: "phase-2",
    status: "next" as const,
    labelKey: "roadmapPhase2Label" as const,
    periodKey: "roadmapPeriodNext" as const,
    itemKeys: [
      "roadmapPhase2Item1",
      "roadmapPhase2Item2",
      "roadmapPhase2Item3",
      "roadmapPhase2Item4",
      "roadmapPhase2Item5",
    ] as const,
  },
  {
    id: "phase-3",
    status: "planned" as const,
    labelKey: "roadmapPhase3Label" as const,
    periodKey: "roadmapPeriodFuture" as const,
    itemKeys: [
      "roadmapPhase3Item1",
      "roadmapPhase3Item2",
      "roadmapPhase3Item3",
      "roadmapPhase3Item4",
      "roadmapPhase3Item5",
    ] as const,
  },
  {
    id: "phase-4",
    status: "planned" as const,
    labelKey: "roadmapPhase4Label" as const,
    periodKey: "roadmapPeriodFuture" as const,
    itemKeys: [
      "roadmapPhase4Item1",
      "roadmapPhase4Item2",
      "roadmapPhase4Item3",
      "roadmapPhase4Item4",
    ] as const,
  },
];

const statusStyles = {
  live: "border-accent/40 bg-accent/10 text-accent",
  next: "border-accent-blue/40 bg-accent-blue/10 text-accent-blue",
  planned: "border-border bg-background text-muted",
};

export function RoadmapContent() {
  const { t } = useLanguage();
  const handle = `@${site.creator.handle}`;

  useEffect(() => {
    document.title = `${t("roadmapTitle")} · ${site.name}`;
  }, [t]);

  const statusLabel = (status: "live" | "next" | "planned") => {
    if (status === "live") return t("roadmapStatusLive");
    if (status === "next") return t("roadmapStatusNext");
    return t("roadmapStatusPlanned");
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="section-title text-2xl sm:text-3xl">{t("roadmapTitle")}</h1>
      <p className="mt-4 text-lg text-muted">
        {t("roadmapSubtitle", { name: site.name })}
      </p>

      <p className="mt-6 rounded-lg border border-border bg-card p-4 text-sm text-muted">
        {t("roadmapNoticeBefore")}{" "}
        <Link href="/about" className="text-accent hover:underline">
          {t("roadmapAboutLink")}
        </Link>{" "}
        {t("roadmapNoticeAfter")}
      </p>

      <div className="mt-10 space-y-6">
        {phases.map((phase) => (
          <section
            key={phase.id}
            id={phase.id}
            className="scroll-mt-24 rounded-lg border border-border bg-card p-6"
          >
            <div className="flex flex-wrap items-center gap-3">
              <span
                className={`rounded border px-2 py-0.5 font-mono text-xs uppercase ${statusStyles[phase.status]}`}
              >
                {statusLabel(phase.status)}
              </span>
              <span className="text-xs text-muted">{t(phase.periodKey)}</span>
            </div>
            <h2 className="mt-3 text-lg font-semibold">{t(phase.labelKey)}</h2>
            <ul className="mt-4 space-y-2">
              {phase.itemKeys.map((itemKey) => (
                <li key={itemKey} className="flex gap-2 text-sm text-muted">
                  <span className="text-accent">→</span>
                  {t(itemKey)}
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      <section className="mt-10 rounded-lg border border-border bg-card p-6">
        <h2 className="font-semibold">{t("roadmapSuggestTitle")}</h2>
        <p className="mt-2 text-sm text-muted">{t("roadmapSuggestText", { handle })}</p>
      </section>
    </div>
  );
}