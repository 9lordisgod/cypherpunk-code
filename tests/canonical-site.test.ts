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

  it("uses www as the canonical host", () => {
    expect(getCanonicalHost()).toBe("www.cypherpunk-code.com");
  });

  it("detects legacy .ca hosts", () => {
    expect(isLegacyHost("cypherpunk-code.ca")).toBe(true);
    expect(isLegacyHost("www.cypherpunk-code.ca")).toBe(true);
    expect(isLegacyHost("www.cypherpunk-code.com")).toBe(false);
  });

  it("redirects apex and legacy hosts in production", () => {
    process.env.NODE_ENV = "production";
    expect(shouldRedirectToCanonicalHost("cypherpunk-code.com")).toBe(true);
    expect(shouldRedirectToCanonicalHost("cypherpunk-code.ca")).toBe(true);
    expect(shouldRedirectToCanonicalHost("www.cypherpunk-code.com")).toBe(false);
    expect(shouldRedirectToCanonicalHost("localhost")).toBe(false);
  });

  it("builds canonical redirect URLs", () => {
    expect(buildCanonicalRedirectUrl("/catalog", "?q=bitcoin")).toBe(
      "https://www.cypherpunk-code.com/catalog?q=bitcoin"
    );
  });
});