import { afterEach, describe, expect, it } from "vitest";
import {
  buildCanonicalRedirectUrl,
  getCanonicalHost,
  isLegacyHost,
  shouldRedirectToCanonicalHost,
} from "@/lib/canonical-site";

describe("canonical-site", () => {
  const originalNodeEnv = process.env.NODE_ENV;

  afterEach(() => {
    process.env.NODE_ENV = originalNodeEnv;
  });

  it("uses site.json as the canonical host by default", () => {
    expect(getCanonicalHost()).toBe("localhost:3000");
  });

  it("detects legacy .ca hosts", () => {
    expect(isLegacyHost("cypherpunk-code.ca")).toBe(true);
    expect(isLegacyHost("www.cypherpunk-code.ca")).toBe(true);
    expect(isLegacyHost("localhost:3000")).toBe(false);
  });

  it("redirects legacy hosts in production", () => {
    process.env.NODE_ENV = "production";
    expect(shouldRedirectToCanonicalHost("cypherpunk-code.ca")).toBe(true);
    expect(shouldRedirectToCanonicalHost("www.cypherpunk-code.ca")).toBe(true);
    expect(shouldRedirectToCanonicalHost("localhost")).toBe(false);
    expect(shouldRedirectToCanonicalHost("localhost:3000")).toBe(false);
  });

  it("builds canonical redirect URLs", () => {
    expect(buildCanonicalRedirectUrl("/catalog", "?q=bitcoin")).toBe(
      "http://localhost:3000/catalog?q=bitcoin"
    );
  });
});