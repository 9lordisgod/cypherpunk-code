import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { fetchRssFeed } from "./rss";
import { RSS_SOURCES } from "./sectors";

describe("fetchRssFeed", () => {
  it("parses Guardian World without category coercion errors", async () => {
    const feed = RSS_SOURCES.find((s) => s.source === "Guardian World");
    assert.ok(feed);
    const items = await fetchRssFeed(feed, 3);
    assert.ok(items.length > 0, "expected Guardian items");
    assert.ok(items[0].url.startsWith("http"));
  });
});