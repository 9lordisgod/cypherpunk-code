export interface SourceHealthSnapshot {
  news: { live: number; total: number; failed: string[] };
  x: { live: number; total: number; failed: string[] };
  checkedAt: string;
}

let snapshot: SourceHealthSnapshot | null = null;

export function setSourceHealth(health: SourceHealthSnapshot): void {
  snapshot = health;
}

export function getSourceHealth(): SourceHealthSnapshot | null {
  return snapshot;
}