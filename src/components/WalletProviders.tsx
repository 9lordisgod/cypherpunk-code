'use client';

import React, { useMemo } from 'react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-phantom';
import { clusterApiUrl } from '@solana/web3.js';

// Default styles that can be overridden by your app
import '@solana/wallet-adapter-react-ui/styles.css';

export function WalletProviders({ children }: { children: React.ReactNode }) {
  const network = WalletAdapterNetwork.Devnet;

  // Support custom RPC for reliability (recommended for interactive txs like burns during play).
  // Priority: NEXT_PUBLIC_SOLANA_RPC_URL > NEXT_PUBLIC_HELIUS_API_KEY (devnet helius) > public clusterApiUrl.
  // If you have a Helius key (free tier ok for devnet), set NEXT_PUBLIC_HELIUS_API_KEY=yourkey in .env.local or Vercel.
  // Example Helius devnet endpoint: https://devnet.helius-rpc.com/?api-key=YOUR_KEY
  const endpoint = useMemo(() => {
    const custom = process.env.NEXT_PUBLIC_SOLANA_RPC_URL;
    if (custom) return custom;

    const heliusKey = process.env.NEXT_PUBLIC_HELIUS_API_KEY;
    if (heliusKey) {
      return `https://devnet.helius-rpc.com/?api-key=${heliusKey}`;
    }
    return clusterApiUrl(network);
  }, [network]);

  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
    ],
    []
  );

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          {children}
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}
