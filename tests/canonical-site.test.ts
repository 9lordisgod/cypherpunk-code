import { afterEach, describe, expect, it } from "vitest";
import {
  buildCanonicalRedirectUrl,
  ensureCanonicalAuthEnv,
  getCanonicalHost,
  isLegacyHost,
  normalizeAuthHost,
  shouldRedirectToCanonicalHost,
} from "@/lib/canonical-site";

describe("canonical-site", () => {
  const originalAuthUrl = process.env.AUTH_URL;
  const originalNextAuthUrl = process.env.NEXTAUTH_URL;
  const originalNodeEnv = process.env.NODE_ENV;

  afterEach(() => {
    if (originalAuthUrl === undefined) {
      delete process.env.AUTH_URL;
    } else {
      process.env.AUTH_URL = originalAuthUrl;
    }

    if (originalNextAuthUrl === undefined) {
      delete process.env.NEXTAUTH_URL;
    } else {
      process.env.NEXTAUTH_URL = originalNextAuthUrl;
    }

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

  it("normalizes legacy and apex hosts to the canonical www host", () => {
    expect(normalizeAuthHost("cypherpunk-code.ca")).toBe("www.cypherpunk-code.com");
    expect(normalizeAuthHost("cypherpunk-code.com")).toBe("www.cypherpunk-code.com");
    expect(normalizeAuthHost("www.cypherpunk-code.ca:443")).toBe(
      "www.cypherpunk-code.com"
    );
  });

  it("builds canonical redirect URLs", () => {
    expect(buildCanonicalRedirectUrl("/account", "?wallet=1")).toBe(
      "https://www.cypherpunk-code.com/account?wallet=1"
    );
  });

  it("overrides stale AUTH_URL values that still point at legacy domains", () => {
    process.env.AUTH_URL = "https://cypherpunk-code.ca";
    process.env.NEXTAUTH_URL = "https://cypherpunk-code.com";

    ensureCanonicalAuthEnv();

    expect(process.env.AUTH_URL).toBe("https://www.cypherpunk-code.com");
    expect(process.env.NEXTAUTH_URL).toBe("https://www.cypherpunk-code.com");
  });
});