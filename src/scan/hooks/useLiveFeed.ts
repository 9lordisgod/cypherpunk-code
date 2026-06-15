"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  FEED_REFRESH_MS,
  FEED_STORE_CAP,
} from "@/scan/lib/feed-config";
import type { SourceHealthSnapshot } from "@/scan/lib/source-health";
import type { IntelArticle } from "@/scan/types";

export const REFRESH_INTERVAL_MS = FEED_REFRESH_MS;

const FETCH_TIMEOUT_MS = 45_000;

export interface FeedResponse {
  articles: IntelArticle[];
  fetchedAt: string;
  count: number;
  live: boolean;
  health?: SourceHealthSnapshot | null;
  cached?: boolean;
}

export type RefreshStatus = "idle" | "ingesting" | "updated" | "synced" | "unchanged";

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
  const prevFetchedAt = useRef<string | null>(null);
  const hasLoaded = useRef(false);
  const abortRef = useRef<AbortController | null>(null);
  const requestSeq = useRef(0);

  const load = useCallback(async (opts?: { isPoll?: boolean }) => {
    const isPoll = opts?.isPoll ?? false;
    const seq = ++requestSeq.current;

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    const timeoutId = window.setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

    if (isPoll) setRefreshing(true);
    else if (!hasLoaded.current) setLoading(true);
    setError(null);
    setRefreshStatus("ingesting");

    try {
      const res = await fetch(`/api/feed?sector=all&_=${Date.now()}`, {
        cache: "no-store",
        signal: controller.signal,
        headers: { Accept: "application/json" },
      });

      if (!res.ok) throw new Error("Feed unavailable");

      const data: FeedResponse = await res.json();
      if (!mounted.current || seq !== requestSeq.current) return;

      const store = data.articles.slice(0, FEED_STORE_CAP);
      const arrived = new Set<string>();

      if (hasLoaded.current) {
        for (const article of store) {
          if (!prevIds.current.has(article.id)) arrived.add(article.id);
        }
      }

      const indexSynced =
        hasLoaded.current &&
        data.fetchedAt &&
        data.fetchedAt !== prevFetchedAt.current;

      prevIds.current = new Set(store.map((a) => a.id));
      prevFetchedAt.current = data.fetchedAt;
      hasLoaded.current = true;

      setArticles(store);
      setFetchedAt(data.fetchedAt);
      setIngestCount((n) => n + 1);
      setLastNewCount(arrived.size);

      if (arrived.size > 0) setRefreshStatus("updated");
      else if (indexSynced) setRefreshStatus("synced");
      else setRefreshStatus("unchanged");

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
      if (!mounted.current || seq !== requestSeq.current) return;
      if (e instanceof Error && e.name === "AbortError") {
        setError("Feed request timed out — retrying on next cycle");
      } else {
        setError(e instanceof Error ? e.message : "Failed to load");
      }
      setRefreshStatus("idle");
    } finally {
      window.clearTimeout(timeoutId);
      if (mounted.current && seq === requestSeq.current) {
        setLoading(false);
        setRefreshing(false);
      }
    }
  }, []);

  const refresh = useCallback(() => {
    void load({ isPoll: true });
  }, [load]);

  useEffect(() => {
    mounted.current = true;

    void load();

    const pollId = window.setInterval(() => {
      void load({ isPoll: true });
    }, FEED_REFRESH_MS);

    const onVisible = () => {
      if (document.visibilityState === "visible" && hasLoaded.current) {
        void load({ isPoll: true });
      }
    };

    document.addEventListener("visibilitychange", onVisible);

    return () => {
      mounted.current = false;
      abortRef.current?.abort();
      window.clearInterval(pollId);
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