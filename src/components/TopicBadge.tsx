"use client";

import { useTranslatedLabels } from "@/lib/i18n/useTranslatedLabels";
import type { Topic } from "@/lib/types";

const topicColors: Partial<Record<Topic, string>> = {
  bitcoin: "text-accent-orange border-accent-orange/30",
  monero: "text-accent-orange border-accent-orange/30",
  cypherpunk: "text-accent border-accent/30",
  privacy: "text-accent-purple border-accent-purple/30",
  cryptography: "text-accent-blue border-accent-blue/30",
  opsec: "text-accent-purple border-accent-purple/30",
};

export function TopicBadge({ topic }: { topic: Topic }) {
  const { topicLabels } = useTranslatedLabels();
  const color = topicColors[topic] ?? "text-muted border-border";
  return (
    <span className={`rounded border px-2 py-0.5 text-xs ${color}`}>
      {topicLabels[topic]}
    </span>
  );
}