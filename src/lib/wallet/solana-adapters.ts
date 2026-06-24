import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
} from "@solana/wallet-adapter-wallets";

export function createSolanaWalletAdapters() {
  return [new PhantomWalletAdapter(), new SolflareWalletAdapter()];
}