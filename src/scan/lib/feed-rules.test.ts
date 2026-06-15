import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  HOT_WINDOW_MS,
  INGEST_MAX_AGE_MS,
  isWithinIngestWindow,
  passesNoiseFilter,
  rankArticles,
  relevanceScore,
  scoreArticle,
} from "./feed-rules";
import type { IntelArticle } from "@/scan/types";

function article(
  overrides: Partial<IntelArticle> & Pick<IntelArticle, "id" | "title" | "sector">
): IntelArticle {
  return {
    url: `https://example.com/${overrides.id}`,
    source: "Test Source",
    feedUrl: "https://example.com/feed",
    platform: "finnhub",
    timestamp: new Date().toISOString(),
    ...overrides,
  };
}

describe("feed-rules", () => {
  it("rejects crypto noise headlines", () => {
    const noisy = article({
      id: "n1",
      title: "Bitcoin price prediction for next bull market",
      sector: "tech",
    });
    assert.equal(passesNoiseFilter(noisy), false);
  });

  it("accepts conflict-related headlines", () => {
    const signal = article({
      id: "s1",
      title: "Military strike reported near border as troops mobilize",
      sector: "conflict",
    });
    assert.equal(passesNoiseFilter(signal), true);
    assert.ok(relevanceScore(signal) > 0);
  });

  it("drops items outside ingest window", () => {
    const stale = article({
      id: "old",
      title: "Old conflict report",
      sector: "conflict",
      timestamp: new Date(Date.now() - INGEST_MAX_AGE_MS - 60_000).toISOString(),
    });
    assert.equal(isWithinIngestWindow(stale), false);
  });

  it("scores fresher articles higher than stale ones", () => {
    const fresh = article({
      id: "fresh",
      title: "Cyber breach at defense contractor",
      sector: "security",
      timestamp: new Date(Date.now() - 30 * 60_000).toISOString(),
    });
    const older = article({
      id: "older",
      title: "Cyber breach at defense contractor",
      sector: "security",
      timestamp: new Date(Date.now() - HOT_WINDOW_MS - 60_000).toISOString(),
    });
    const priorities = new Map([["Test Source", 2]]);
    assert.ok(
      scoreArticle(fresh, 2) > scoreArticle(older, 2),
      "fresh article should outrank stale"
    );
    const ranked = rankArticles([older, fresh], priorities);
    assert.equal(ranked[0]?.article.id, "fresh");
  });
});