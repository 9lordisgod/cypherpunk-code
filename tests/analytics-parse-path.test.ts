import { describe, expect, it } from "vitest";
import { isValidVisitorId, parseAnalyticsPath } from "@/lib/analytics/parse-path";

describe("analytics parse-path", () => {
  it("parses catalog resource and course paths", () => {
    expect(parseAnalyticsPath("/resource/bitcoin-whitepaper")).toEqual({
      path: "/resource/bitcoin-whitepaper",
      resourceId: "bitcoin-whitepaper",
      courseSlug: null,
      chapterSlug: null,
    });

    expect(parseAnalyticsPath("/courses/bitcoin/module-1")).toEqual({
      path: "/courses/bitcoin/module-1",
      resourceId: null,
      courseSlug: "bitcoin",
      chapterSlug: "module-1",
    });
  });

  it("validates visitor ids", () => {
    expect(isValidVisitorId("abc12345")).toBe(true);
    expect(isValidVisitorId("bad id")).toBe(false);
  });
});