import { WalletReadyState } from "@solana/wallet-adapter-base";

export const SolanaMobileWalletAdapterWalletName = "Solana Mobile";

export function createDefaultAddressSelector() {
  return async () => {
    throw new Error("Solana Mobile Wallet Adapter is disabled (desktop-only build)");
  };
}

export function createDefaultAuthorizationResultCache() {
  return {
    clear() {},
    get() {
      return undefined;
    },
    set() {},
  };
}

export function createDefaultWalletNotFoundHandler() {
  return () => {};
}

/** No-op stub — never registered on desktop web builds. */
export class SolanaMobileWalletAdapter {
  name = SolanaMobileWalletAdapterWalletName;
  url = "https://solana.com";
  icon = "";
  readyState = WalletReadyState.Unsupported;
  connecting = false;
  connected = false;
  publicKey = null;

  async connect() {
    throw new Error("Solana Mobile Wallet Adapter is disabled (desktop-only build)");
  }

  async disconnect() {}

  on() {}

  off() {}
}