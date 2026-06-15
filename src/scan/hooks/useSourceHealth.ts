"use client";

import { useEffect, useState } from "react";
import type { SourceHealthSnapshot } from "@/scan/lib/source-health";

export function useSourceHealth(pollMs = 60_000) {
  const [health, setHealth] = useState<SourceHealthSnapshot | null>(null);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const res = await fetch("/api/health", { cache: "no-store" });
        if (!res.ok) return;
        const data = await res.json();
        if (!cancelled && data.news && data.x) {
          setHealth(data as SourceHealthSnapshot);
        }
      } catch {
        /* ignore */
      }
    };

    void load();
    const id = setInterval(() => void load(), pollMs);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, [pollMs]);

  return health;
}