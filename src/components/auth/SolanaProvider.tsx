"use client";

import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { useMemo, type ReactNode } from "react";
import { createSolanaWalletAdapters } from "@/lib/wallet/solana-adapters";
import { getSolanaWalletConfig } from "@/lib/wallet/solana-config";

import "@solana/wallet-adapter-react-ui/styles.css";

interface SolanaProviderProps {
  children: ReactNode;
}

export function SolanaProvider({ children }: SolanaProviderProps) {
  const { endpoint, autoConnect } = useMemo(() => getSolanaWalletConfig(), []);
  const wallets = useMemo(() => createSolanaWalletAdapters(), []);

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect={autoConnect}>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}