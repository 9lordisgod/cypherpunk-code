import { afterEach, describe, expect, it } from "vitest";
import {
  getAdminSolanaAddresses,
  isAdminSolanaAddress,
} from "@/lib/wallet/admin-whitelist";

const ADMIN_ADDRESS = "6fjNtoBhMkghY6CDfUof4dPvYiYrv68SRyHQimdCqm8w";

describe("admin Solana whitelist", () => {
  afterEach(() => {
    delete process.env.ADMIN_SOLANA_WALLETS;
  });

  it("includes the default admin address", () => {
    expect(getAdminSolanaAddresses()).toContain(ADMIN_ADDRESS);
    expect(isAdminSolanaAddress(ADMIN_ADDRESS)).toBe(true);
  });

  it("rejects non-whitelisted addresses", () => {
    expect(isAdminSolanaAddress("NotARealSolanaAddress1111111111111111111")).toBe(false);
  });

  it("reads comma-separated env overrides", () => {
    process.env.ADMIN_SOLANA_WALLETS = "AddrOne1111111111111111111111111111111111, AddrTwo2222222222222222222222222222222222";
    expect(getAdminSolanaAddresses()).toEqual([
      "AddrOne1111111111111111111111111111111111",
      "AddrTwo2222222222222222222222222222222222",
    ]);
    expect(isAdminSolanaAddress(ADMIN_ADDRESS)).toBe(false);
  });
});