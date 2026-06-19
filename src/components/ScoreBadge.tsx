"use client";

import { useLanguage } from "@/components/LanguageProvider";

export function ScoreBadge({ score }: { score: number }) {
  const { t } = useLanguage();

  const color =
    score >= 9
      ? "text-accent border-accent/40 bg-accent/10"
      : score >= 7
        ? "text-accent-blue border-accent-blue/40 bg-accent-blue/10"
        : score >= 5
          ? "text-accent-orange border-accent-orange/40 bg-accent-orange/10"
          : "text-muted border-border bg-card";

  const label = t("cpScoreTooltip");

  return (
    <span
      className={`inline-flex items-center gap-1 rounded border px-2 py-0.5 font-mono text-xs ${color}`}
      title={label}
      aria-label={`${label}: ${score}`}
    >
      <span className="opacity-60">CP</span>
      {score}
    </span>
  );
}