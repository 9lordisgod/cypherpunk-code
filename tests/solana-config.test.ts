import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { describe, expect, it } from "vitest";
import {
  getSolanaRpcEndpoint,
  getSolanaWalletConfig,
  SOLANA_WALLET_ADAPTER_NAMES,
  SOLANA_WALLET_NETWORK,
} from "@/lib/wallet/solana-config";

describe("solana wallet config", () => {
  it("uses mainnet for production sign-in verification", () => {
    const config = getSolanaWalletConfig();
    expect(config.network).toBe(WalletAdapterNetwork.Mainnet);
    expect(SOLANA_WALLET_NETWORK).toBe(WalletAdapterNetwork.Mainnet);
  });

  it("exposes the official cluster RPC endpoint", () => {
    const endpoint = getSolanaRpcEndpoint();
    expect(endpoint).toContain("mainnet");
    expect(getSolanaWalletConfig().endpoint).toBe(endpoint);
  });

  it("registers Phantom and Solflare adapters with autoConnect disabled", () => {
    const config = getSolanaWalletConfig();
    expect(config.autoConnect).toBe(false);
    expect(config.adapterNames).toEqual([...SOLANA_WALLET_ADAPTER_NAMES]);
    expect(config.adapterNames).toContain("Phantom");
    expect(config.adapterNames).toContain("Solflare");
  });
});