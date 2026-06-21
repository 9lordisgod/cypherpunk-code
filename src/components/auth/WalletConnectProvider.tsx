"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

type WalletConnectContextValue = {
  isOpen: boolean;
  sessionKey: number;
  openWalletConnect: () => void;
  closeWalletConnect: () => void;
};

const WalletConnectContext = createContext<WalletConnectContextValue | null>(null);

export function WalletConnectProvider({ children }: { children: React.ReactNode }) {
  const [manualOpen, setManualOpen] = useState(false);
  const [autoDismissed, setAutoDismissed] = useState(false);
  const [sessionKey, setSessionKey] = useState(0);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  const autoOpen =
    !autoDismissed && (pathname === "/login" || searchParams.get("wallet") === "1");
  const isOpen = manualOpen || autoOpen;

  const openWalletConnect = useCallback(() => {
    setAutoDismissed(false);
    setManualOpen(true);
  }, []);

  const closeWalletConnect = useCallback(() => {
    setManualOpen(false);
    setAutoDismissed(true);
    setSessionKey((value) => value + 1);
  }, []);

  useEffect(() => {
    if (pathname === "/login") {
      router.replace("/");
      return;
    }

    if (searchParams.get("wallet") === "1") {
      const nextParams = new URLSearchParams(searchParams.toString());
      nextParams.delete("wallet");
      const query = nextParams.toString();
      router.replace(query ? `${pathname}?${query}` : pathname);
    }
  }, [pathname, router, searchParams]);

  const value = useMemo(
    () => ({ isOpen, sessionKey, openWalletConnect, closeWalletConnect }),
    [isOpen, sessionKey, openWalletConnect, closeWalletConnect]
  );

  return (
    <WalletConnectContext.Provider value={value}>{children}</WalletConnectContext.Provider>
  );
}

export function useWalletConnect() {
  const context = useContext(WalletConnectContext);
  if (!context) {
    throw new Error("useWalletConnect must be used within WalletConnectProvider");
  }
  return context;
}