"use client";

import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect, useRef } from "react";
import { getOrCreateVisitorId } from "@/lib/analytics/visitor";

const DEDUPE_MS = 30_000;

export function AnalyticsBeacon() {
  const pathname = usePathname();
  const { status } = useSession();
  const lastSent = useRef<{ path: string; at: number } | null>(null);

  useEffect(() => {
    if (!pathname || pathname.startsWith("/admin")) return;
    if (status === "loading") return;

    const now = Date.now();
    if (
      lastSent.current?.path === pathname &&
      now - lastSent.current.at < DEDUPE_MS
    ) {
      return;
    }

    const visitorId = getOrCreateVisitorId();
    if (!visitorId) return;

    lastSent.current = { path: pathname, at: now };

    void fetch("/api/analytics/view", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ visitorId, path: pathname }),
      keepalive: true,
    });
  }, [pathname, status]);

  return null;
}