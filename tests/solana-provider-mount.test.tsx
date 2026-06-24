/**
 * @vitest-environment happy-dom
 */
import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

class MockWalletAdapter {
  name: string;
  url: string;
  icon: string;
  connecting = false;
  connected = false;
  private listeners = new Map<string, Set<() => void>>();

  constructor(name: string, url: string) {
    this.name = name;
    this.url = url;
    this.icon = "data:image/svg+xml,<svg/>";
  }

  on(event: string, handler: () => void) {
    if (!this.listeners.has(event)) this.listeners.set(event, new Set());
    this.listeners.get(event)!.add(handler);
  }

  off(event: string, handler: () => void) {
    this.listeners.get(event)?.delete(handler);
  }

  async connect() {
    this.connected = true;
  }

  async disconnect() {
    this.connected = false;
  }
}

vi.mock("@/lib/wallet/solana-adapters", () => ({
  createSolanaWalletAdapters: () => [
    new MockWalletAdapter("Phantom", "https://phantom.app"),
    new MockWalletAdapter("Solflare", "https://solflare.com"),
  ],
}));

import { SolanaProvider } from "@/components/auth/SolanaProvider";

const storage = new Map<string, string>();

beforeEach(() => {
  storage.clear();
  vi.stubGlobal("localStorage", {
    getItem: (key: string) => storage.get(key) ?? null,
    setItem: (key: string, value: string) => storage.set(key, value),
    removeItem: (key: string) => storage.delete(key),
    clear: () => storage.clear(),
    key: () => null,
    length: 0,
  });
});

describe("SolanaProvider mount", () => {
  it("instantiates the official wallet-adapter provider stack with children", () => {
    render(
      <SolanaProvider>
        <span data-testid="solana-child">Connect Solana wallet</span>
      </SolanaProvider>
    );

    expect(screen.getByTestId("solana-child").textContent).toBe("Connect Solana wallet");
  });
});