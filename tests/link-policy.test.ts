import { describe, expect, it } from "vitest";
import {
  assertCatalogUrl,
  isBlockedCatalogUrl,
} from "@/lib/security/link-policy";

describe("link-policy", () => {
  it("blocks cypherpunkschool.com", () => {
    expect(isBlockedCatalogUrl("https://cypherpunkschool.com/lessons/")).toBe(
      true
    );
    expect(isBlockedCatalogUrl("https://www.cypherpunkschool.com/privacy-101/")).toBe(
      true
    );
  });

  it("allows legitimate HTTPS resources", () => {
    expect(isBlockedCatalogUrl("https://bitcoin.org/bitcoin.pdf")).toBe(false);
    expect(isBlockedCatalogUrl("https://ssd.eff.org/")).toBe(false);
  });

  it("rejects invalid URLs", () => {
    expect(isBlockedCatalogUrl("not-a-url")).toBe(true);
    expect(() => assertCatalogUrl("https://cypherpunkschool.com/")).toThrow(
      /Blocked catalog URL/
    );
  });
});