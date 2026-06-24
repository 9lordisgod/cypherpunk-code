import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { clusterApiUrl } from "@solana/web3.js";

export const SOLANA_WALLET_NETWORK = WalletAdapterNetwork.Mainnet;

export const SOLANA_WALLET_ADAPTER_NAMES = ["Phantom", "Solflare"] as const;

export function getSolanaRpcEndpoint(network = SOLANA_WALLET_NETWORK) {
  return clusterApiUrl(network);
}

export function getSolanaWalletConfig() {
  return {
    network: SOLANA_WALLET_NETWORK,
    endpoint: getSolanaRpcEndpoint(SOLANA_WALLET_NETWORK),
    autoConnect: false,
    adapterNames: [...SOLANA_WALLET_ADAPTER_NAMES],
  } as const;
}

/** Provider tree matching @solana/wallet-adapter-react official layout. */
export function getSolanaProviderSpec() {
  return {
    providers: ["ConnectionProvider", "WalletProvider", "WalletModalProvider"] as const,
    stylesheets: ["@solana/wallet-adapter-react-ui/styles.css"] as const,
    config: getSolanaWalletConfig(),
  } as const;
}