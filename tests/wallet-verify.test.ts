import { describe, expect, it } from "vitest";
import { verifyBitcoinSignature } from "@/lib/wallet/verify-bitcoin";

describe("verifyBitcoinSignature", () => {
  it("rejects invalid signatures", () => {
    expect(
      verifyBitcoinSignature(
        "bc1qre5ureack5s6alknv8s7etza5z0rjupwkzctg6",
        "Sign in to Cypherpunk Code",
        "not-a-valid-signature"
      )
    ).toBe(false);
  });

  it("rejects empty signature", () => {
    expect(verifyBitcoinSignature("bc1qtest", "message", "")).toBe(false);
  });
});