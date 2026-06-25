import { describe, expect, it } from "vitest";
import { isValidVisitorId, parseAnalyticsPath } from "@/lib/analytics/parse-path";

describe("analytics parse-path", () => {
  it("parses catalog resource paths", () => {
    expect(parseAnalyticsPath("/resource/bitcoin-whitepaper")).toEqual({
      path: "/resource/bitcoin-whitepaper",
      resourceId: "bitcoin-whitepaper",
    });
  });

  it("validates visitor ids", () => {
    expect(isValidVisitorId("abc12345")).toBe(true);
    expect(isValidVisitorId("bad id")).toBe(false);
  });
});