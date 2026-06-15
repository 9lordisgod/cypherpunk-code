import type { IntelArticle } from "@/scan/types";

export interface WatchconStatus {
  level: number;
  label: string;
  detail: string;
  className: string;
}

export function computeWatchcon(articles: IntelArticle[]): WatchconStatus {
  const hot = articles.filter(
    (a) => a.sector === "conflict" || a.sector === "security"
  ).length;
  const recent = articles.filter((a) => {
    const age = Date.now() - new Date(a.timestamp).getTime();
    return age < 2 * 60 * 60 * 1000;
  }).length;

  if (hot >= 10 || recent >= 18) {
    return {
      level: 3,
      label: "INCREASED WATCH",
      detail: "Elevated conflict & cyber signal density",
      className: "status-critical",
    };
  }
  if (hot >= 6 || recent >= 12) {
    return {
      level: 4,
      label: "DOUBLE TAKE",
      detail: "Above-baseline geopolitical activity",
      className: "status-elevated",
    };
  }
  return {
    level: 5,
    label: "ROUTINE MONITOR",
    detail: "Standard OSINT ingest — no surge detected",
    className: "status-operational",
  };
}

export function formatZuluTime(iso: string): string {
  const d = new Date(iso);
  const h = d.getUTCHours().toString().padStart(2, "0");
  const m = d.getUTCMinutes().toString().padStart(2, "0");
  return `${h}:${m} Z`;
}