import type { SolanaSignInInput, SolanaSignInOutput } from "@solana/wallet-standard-features";

export interface SolanaProvider {
  isPhantom?: boolean;
  isSolflare?: boolean;
  isBackpack?: boolean;
  publicKey?: { toBase58(): string };
  connect(options?: { onlyIfTrusted?: boolean }): Promise<{
    publicKey: { toBase58(): string };
  }>;
  signMessage(
    message: Uint8Array,
    display?: string
  ): Promise<{ signature: Uint8Array; publicKey?: { toBase58(): string } }>;
  signIn?: (input: SolanaSignInInput) => Promise<SolanaSignInOutput>;
}

interface SolflareProvider extends SolanaProvider {
  isSolflare: boolean;
}

interface BackpackProvider extends SolanaProvider {
  isBackpack: boolean;
}

interface UnisatProvider {
  requestAccounts(): Promise<string[]>;
  signMessage(message: string, type?: string): Promise<string>;
}

declare global {
  interface Window {
    solana?: SolanaProvider;
    phantom?: { solana?: SolanaProvider };
    solflare?: SolflareProvider;
    backpack?: BackpackProvider;
    unisat?: UnisatProvider;
    BitcoinProvider?: unknown;
    XverseProviders?: { BitcoinProvider?: unknown };
    btc_providers?: unknown[];
  }
}

export {};