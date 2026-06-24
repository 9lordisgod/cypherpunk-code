import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const root = resolve(__dirname, "..");

function readSource(relativePath: string) {
  return readFileSync(resolve(root, relativePath), "utf8");
}

describe("Solana provider structure", () => {
  it("uses the official wallet-adapter provider stack", () => {
    const source = readSource("src/components/auth/SolanaProvider.tsx");
    expect(source).toContain("ConnectionProvider");
    expect(source).toContain("WalletProvider");
    expect(source).toContain("WalletModalProvider");
    expect(source).toContain("@solana/wallet-adapter-react-ui/styles.css");
    expect(source).toContain("getSolanaWalletConfig");
    expect(source).not.toContain("getSolanaRpcEndpoint");
    expect(source).not.toContain("SOLANA_WALLET_NETWORK");
  });

  it("wraps the app in SolanaProvider from Providers", () => {
    const source = readSource("src/components/Providers.tsx");
    expect(source).toContain("<SolanaProvider>");
    expect(source).toContain("</SolanaProvider>");
  });

  it("exposes quick-start step states and safety callouts in the wallet panel", () => {
    const panel = readSource("src/components/auth/WalletConnectPanel.tsx");
    const strings = readSource("src/lib/i18n/pageStrings.ts");

    expect(panel).toContain('wallet-connect-steps');
    expect(panel).toContain('walletConnectSafetyWarn');
    expect(panel).toContain('walletConnectIntro1');
    expect(strings).toContain("walletConnectStepPick");
    expect(strings).not.toContain("loginWalletBitcoin");
    expect(strings).not.toContain("Xverse");
  });
});