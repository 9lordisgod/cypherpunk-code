import { describe, expect, it } from "vitest";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { getTopicSeo, isTopicSlug } from "@/lib/seo/topics";

describe("seo metadata", () => {
  it("builds canonical and social metadata for public pages", () => {
    const metadata = buildPageMetadata({
      title: "Bitcoin Learning Resources",
      description: "Curated Bitcoin education.",
      path: "/topics/bitcoin",
      keywords: ["bitcoin course"],
    });

    expect(metadata.alternates?.canonical).toBe(
      "http://localhost:3000/topics/bitcoin"
    );
    expect(metadata.openGraph?.url).toBe(
      "http://localhost:3000/topics/bitcoin"
    );
    expect(metadata.openGraph?.title).toBe("Bitcoin Learning Resources");
    expect(metadata.robots).toEqual({ index: true, follow: true });
  });

  it("marks private pages as noindex", () => {
    const metadata = buildPageMetadata({
      title: "Admin",
      description: "Private page",
      path: "/admin",
      noIndex: true,
    });

    expect(metadata.robots).toEqual({ index: false, follow: false });
  });

  it("exposes topic SEO entries for all catalog topics", () => {
    expect(isTopicSlug("bitcoin")).toBe(true);
    expect(isTopicSlug("not-a-topic")).toBe(false);
    expect(getTopicSeo("monero")?.title).toContain("Monero");
  });
});