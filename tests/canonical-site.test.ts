import { afterEach, describe, expect, it } from "vitest";
import {
  buildCanonicalRedirectUrl,
  ensureCanonicalAuthEnv,
  isLegacyHost,
  normalizeAuthHost,
} from "@/lib/canonical-site";

describe("canonical-site", () => {
  const originalAuthUrl = process.env.AUTH_URL;
  const originalNextAuthUrl = process.env.NEXTAUTH_URL;

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
  });

  it("detects legacy .ca hosts", () => {
    expect(isLegacyHost("cypherpunk-code.ca")).toBe(true);
    expect(isLegacyHost("www.cypherpunk-code.ca")).toBe(true);
    expect(isLegacyHost("cypherpunk-code.com")).toBe(false);
  });

  it("normalizes legacy hosts to the canonical .com host", () => {
    expect(normalizeAuthHost("cypherpunk-code.ca")).toBe("cypherpunk-code.com");
    expect(normalizeAuthHost("www.cypherpunk-code.ca:443")).toBe(
      "cypherpunk-code.com"
    );
  });

  it("builds canonical redirect URLs", () => {
    expect(buildCanonicalRedirectUrl("/account", "?wallet=1")).toBe(
      "https://cypherpunk-code.com/account?wallet=1"
    );
  });

  it("overrides stale AUTH_URL values that still point at .ca", () => {
    process.env.AUTH_URL = "https://cypherpunk-code.ca";
    process.env.NEXTAUTH_URL = "https://cypherpunk-code.ca";

    ensureCanonicalAuthEnv();

    expect(process.env.AUTH_URL).toBe("https://cypherpunk-code.com");
    expect(process.env.NEXTAUTH_URL).toBe("https://cypherpunk-code.com");
  });
});