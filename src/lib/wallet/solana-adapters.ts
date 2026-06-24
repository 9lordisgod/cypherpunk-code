import { PhantomWalletAdapter } from "@solana/wallet-adapter-phantom";
import { SolflareWalletAdapter } from "@solana/wallet-adapter-solflare";

export function createSolanaWalletAdapters() {
  return [new PhantomWalletAdapter(), new SolflareWalletAdapter()];
}