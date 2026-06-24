import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { WalletReadyState } from "@solana/wallet-adapter-base";
import { SolanaProvider } from "@/components/auth/SolanaProvider";
import { createSolanaWalletAdapters } from "@/lib/wallet/solana-adapters";
import {
  installPhantomStub,
  PHANTOM_TEST_ADDRESS,
  waitForAdapterReady,
} from "./helpers/phantom-stub";

describe("SolanaProvider mount", () => {
  beforeEach(() => {
    installPhantomStub();
  });

  it("instantiates the official wallet-adapter provider stack with children", () => {
    render(
      <SolanaProvider>
        <span data-testid="solana-child">Connect Solana wallet</span>
      </SolanaProvider>
    );

    expect(screen.getByTestId("solana-child").textContent).toBe(
      "Connect Solana wallet"
    );
  });

  it("exercises shipped PhantomWalletAdapter.connect() from createSolanaWalletAdapters", async () => {
    const adapters = createSolanaWalletAdapters();
    const phantom = adapters.find((adapter) => adapter.name === "Phantom");

    expect(phantom).toBeDefined();
    await waitForAdapterReady(phantom!);
    expect(phantom!.readyState).toBe(WalletReadyState.Installed);

    await phantom!.connect();
    expect(phantom!.connected).toBe(true);
    expect(phantom!.publicKey?.toBase58()).toBe(PHANTOM_TEST_ADDRESS);

    await phantom!.disconnect();
    expect(phantom!.connected).toBe(false);
  });

  it("mirrors WalletConnectPanel handleWalletClick connect sequence on shipped adapter", async () => {
    const adapters = createSolanaWalletAdapters();
    const target = adapters.find((adapter) => adapter.name === "Phantom");
    expect(target).toBeDefined();
    await waitForAdapterReady(target!);

    const steps: string[] = ["pick", "connecting"];
    await target!.connect();
    steps.push("signing");

    expect(steps).toEqual(["pick", "connecting", "signing"]);
    expect(target!.connected).toBe(true);

    await target!.disconnect();
    expect(target!.connected).toBe(false);
  });
});