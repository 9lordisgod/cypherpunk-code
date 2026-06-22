import { describe, expect, it } from "vitest";
import resources from "@/data/resources.json";
import { defaultFilters, filterResources } from "@/lib/filters";
import type { Resource } from "@/lib/types";

const catalog = resources as Resource[];

describe("filterResources", () => {
  it("returns all resources with default filters", () => {
    expect(filterResources(catalog, defaultFilters)).toHaveLength(catalog.length);
  });

  it("filters by minimum cypherpunk score", () => {
    const filtered = filterResources(catalog, {
      ...defaultFilters,
      minCypherpunkScore: 9,
    });
    expect(filtered.every((r) => r.cypherpunkScore >= 9)).toBe(true);
    expect(filtered.length).toBeGreaterThan(0);
    expect(filtered.length).toBeLessThan(catalog.length);
  });

  it("filters by topic", () => {
    const filtered = filterResources(catalog, {
      ...defaultFilters,
      topics: ["monero"],
    });
    expect(filtered.every((r) => r.topics.includes("monero"))).toBe(true);
  });

  it("sorts by title", () => {
    const filtered = filterResources(catalog, {
      ...defaultFilters,
      sort: "title",
    });
    const titles = filtered.map((r) => r.title);
    expect(titles).toEqual([...titles].sort((a, b) => a.localeCompare(b)));
  });
});