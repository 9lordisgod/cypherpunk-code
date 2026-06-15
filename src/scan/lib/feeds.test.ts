import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { balanceBySector } from "./feeds";
import type { IntelArticle } from "@/scan/types";

function article(
  overrides: Partial<IntelArticle> & Pick<IntelArticle, "id" | "title" | "sector">
): IntelArticle {
  return {
    url: `https://example.com/${overrides.id}`,
    source: overrides.source ?? "Test Source",
    feedUrl: "https://example.com/feed",
    platform: overrides.platform ?? "finnhub",
    timestamp: overrides.timestamp ?? new Date().toISOString(),
    ...overrides,
  };
}

describe("balanceBySector", () => {
  it("deduplicates identical URLs", () => {
    const dup = article({
      id: "a1",
      title: "Duplicate conflict headline",
      sector: "conflict",
      url: "https://example.com/same-story",
    });
    const dup2 = article({
      id: "a2",
      title: "Duplicate conflict headline",
      sector: "conflict",
      url: "https://example.com/same-story",
      source: "Other Source",
    });
    const result = balanceBySector([dup, dup2]);
    assert.equal(result.length, 1);
  });

  it("filters crypto noise from the index", () => {
    const noise = article({
      id: "crypto",
      title: "Ethereum price prediction for meme coin traders",
      sector: "tech",
    });
    const signal = article({
      id: "signal",
      title: "NATO troops deploy amid border tensions",
      sector: "conflict",
      source: "Defense One",
    });
    const result = balanceBySector([noise, signal]);
    assert.equal(result.some((a) => a.id === "crypto"), false);
    assert.equal(result[0]?.id, "signal");
  });

  it("keeps representation across sectors when enough items exist", () => {
    const pool: IntelArticle[] = [];
    const sectors = ["conflict", "politics", "security", "freedom", "tech"] as const;
    for (const sector of sectors) {
      for (let i = 0; i < 8; i++) {
        pool.push(
          article({
            id: `${sector}-${i}`,
            title: `${sector} military cyber sanctions report ${i}`,
            sector,
            timestamp: new Date(Date.now() - i * 60_000).toISOString(),
            source: sector === "conflict" ? "Defense One" : "Test Source",
            platform: i % 2 === 0 ? "x" : "finnhub",
            authorHandle: i % 2 === 0 ? "osint" : undefined,
          })
        );
      }
    }
    const result = balanceBySector(pool);
    for (const sector of sectors) {
      assert.ok(
        result.some((a) => a.sector === sector),
        `expected sector ${sector} in balanced feed`
      );
    }
  });
});