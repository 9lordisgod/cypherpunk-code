"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  FEED_REFRESH_MS,
  FEED_STORE_CAP,
} from "@/scan/lib/feed-config";
import type { SourceHealthSnapshot } from "@/scan/lib/source-health";
import type { IntelArticle } from "@/scan/types";

export const REFRESH_INTERVAL_MS = FEED_REFRESH_MS;

export interface FeedResponse {
  articles: IntelArticle[];
  fetchedAt: string;
  count: number;
  live: boolean;
  health?: SourceHealthSnapshot | null;
}

export type RefreshStatus = "idle" | "ingesting" | "updated" | "unchanged";

export function useLiveFeed() {
  const [articles, setArticles] = useState<IntelArticle[]>([]);
  const [fetchedAt, setFetchedAt] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newIds, setNewIds] = useState<Set<string>>(new Set());
  const [ingestCount, setIngestCount] = useState(0);
  const [lastNewCount, setLastNewCount] = useState(0);
  const [refreshStatus, setRefreshStatus] = useState<RefreshStatus>("idle");

  const mounted = useRef(true);
  const prevIds = useRef<Set<string>>(new Set());
  const hasLoaded = useRef(false);
  const pollTimer = useRef<number | null>(null);
  const loadingRef = useRef(false);
  const scheduleRef = useRef<(delay?: number) => void>(() => {});
  const loadRef = useRef<
    (opts?: { isPoll?: boolean; force?: boolean; attempt?: number }) => Promise<void>
  >(async () => {});

  const load = useCallback(async (opts?: { isPoll?: boolean; force?: boolean; attempt?: number }) => {
    const isPoll = opts?.isPoll ?? false;
    const force = opts?.force ?? false;
    const attempt = opts?.attempt ?? 0;

    if (loadingRef.current && !force) return;
    loadingRef.current = true;

    if (isPoll || force) setRefreshing(true);
    else if (!hasLoaded.current) setLoading(true);
    setError(null);
    setRefreshStatus("ingesting");

    try {
      const res = await fetch(
        `/api/feed?sector=all&fresh=1&_=${Date.now()}`,
        { cache: "no-store" }
      );
      if (res.status === 429) {
        const body = await res.json().catch(() => ({}));
        const retryMs =
          typeof body.retryAfterMs === "number" ? body.retryAfterMs : 30_000;
        if (attempt < 3 && mounted.current) {
          window.setTimeout(() => {
            void loadRef.current({ isPoll, force, attempt: attempt + 1 });
          }, retryMs);
          return;
        }
        throw new Error("Feed busy — try again shortly");
      }
      if (!res.ok) throw new Error("Feed unavailable");

      const data: FeedResponse = await res.json();
      if (!mounted.current) return;

      const store = data.articles.slice(0, FEED_STORE_CAP);
      const arrived = new Set<string>();

      if (hasLoaded.current) {
        for (const article of store) {
          if (!prevIds.current.has(article.id)) arrived.add(article.id);
        }
      }

      prevIds.current = new Set(store.map((a) => a.id));
      hasLoaded.current = true;

      setArticles(store);
      setFetchedAt(data.fetchedAt);
      setIngestCount((n) => n + 1);
      setLastNewCount(arrived.size);
      setRefreshStatus(arrived.size > 0 ? "updated" : "unchanged");

      if (arrived.size > 0) {
        setNewIds(arrived);
        window.setTimeout(() => {
          if (mounted.current) setNewIds(new Set());
        }, 2500);
      } else {
        setNewIds(new Set());
      }

      window.setTimeout(() => {
        if (mounted.current) setRefreshStatus("idle");
      }, 4000);
    } catch (e) {
      if (mounted.current) {
        setError(e instanceof Error ? e.message : "Failed to load");
        setRefreshStatus("idle");
      }
    } finally {
      loadingRef.current = false;
      if (mounted.current) {
        setLoading(false);
        setRefreshing(false);
      }
    }
  }, []);

  useEffect(() => {
    loadRef.current = load;
  }, [load]);

  const refresh = useCallback(() => {
    if (pollTimer.current) window.clearTimeout(pollTimer.current);
    void load({ isPoll: true, force: true }).then(() => {
      if (mounted.current) scheduleRef.current(FEED_REFRESH_MS);
    });
  }, [load]);

  useEffect(() => {
    mounted.current = true;
    let cancelled = false;

    const schedule = (delay = FEED_REFRESH_MS) => {
      if (pollTimer.current) window.clearTimeout(pollTimer.current);
      pollTimer.current = window.setTimeout(() => {
        if (cancelled || !mounted.current) return;
        void load({ isPoll: true }).then(() => {
          if (!cancelled && mounted.current) schedule(FEED_REFRESH_MS);
        });
      }, delay);
    };

    scheduleRef.current = schedule;

    const initial = window.setTimeout(() => {
      void load().then(() => {
        if (!cancelled && mounted.current) schedule(FEED_REFRESH_MS);
      });
    }, 0);

    const onVisible = () => {
      if (document.visibilityState !== "visible" || !hasLoaded.current) return;
      if (pollTimer.current) window.clearTimeout(pollTimer.current);
      void load({ isPoll: true, force: true }).then(() => {
        if (!cancelled && mounted.current) schedule(FEED_REFRESH_MS);
      });
    };

    document.addEventListener("visibilitychange", onVisible);

    return () => {
      cancelled = true;
      mounted.current = false;
      window.clearTimeout(initial);
      if (pollTimer.current) window.clearTimeout(pollTimer.current);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [load]);

  return {
    articles,
    fetchedAt,
    loading,
    refreshing,
    error,
    refresh,
    newIds,
    ingestCount,
    lastNewCount,
    refreshStatus,
  };
}