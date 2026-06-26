import { describe, expect, it } from "vitest";
import paths from "@/data/paths.json";
import removedResources from "@/data/removed-resources.json";
import resources from "@/data/resources.json";
import {
  BLOCKED_CATALOG_DOMAINS,
  isBlockedCatalogUrl,
} from "@/lib/security/link-policy";
import type { Resource } from "@/lib/types";

const catalog = resources as Resource[];
const resourceIds = new Set(catalog.map((r) => r.id));

describe("catalog integrity", () => {
  it("has unique resource ids", () => {
    expect(resourceIds.size).toBe(catalog.length);
  });

  it("uses HTTPS for every external resource URL", () => {
    for (const resource of catalog) {
      expect(resource.url.startsWith("https://"), `${resource.id} must use HTTPS`).toBe(
        true
      );
    }
  });

  it("excludes blocked fake or unverified domains", () => {
    for (const resource of catalog) {
      expect(
        isBlockedCatalogUrl(resource.url),
        `${resource.id} points to a blocked domain`
      ).toBe(false);
    }

    expect(BLOCKED_CATALOG_DOMAINS).toContain("cypherpunkschool.com");
  });

  it("keeps learning paths aligned with the catalog", () => {
    for (const path of paths) {
      for (const id of path.resourceIds) {
        expect(resourceIds.has(id), `missing resource ${id} in ${path.id}`).toBe(
          true
        );
      }
    }
  });

  it("does not list removed catalog entries", () => {
    for (const id of removedResources) {
      expect(resourceIds.has(id), `removed resource still in catalog: ${id}`).toBe(
        false
      );
    }
  });

  it("tracks the expected live catalog size", () => {
    expect(catalog.length).toBe(68);
  });
});