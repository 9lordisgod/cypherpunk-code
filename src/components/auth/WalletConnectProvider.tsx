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
  triggerAutoOpen: () => void;
};

const WalletConnectContext = createContext<WalletConnectContextValue | null>(null);

export function WalletConnectProvider({ children }: { children: React.ReactNode }) {
  const [manualOpen, setManualOpen] = useState(false);
  const [routeAutoOpen, setRouteAutoOpen] = useState(false);
  const [autoDismissed, setAutoDismissed] = useState(false);
  const [sessionKey, setSessionKey] = useState(0);

  const openWalletConnect = useCallback(() => {
    setAutoDismissed(false);
    setManualOpen(true);
  }, []);

  const triggerAutoOpen = useCallback(() => {
    setAutoDismissed(false);
    setRouteAutoOpen(true);
  }, []);

  const closeWalletConnect = useCallback(() => {
    setManualOpen(false);
    setRouteAutoOpen(false);
    setAutoDismissed(true);
    setSessionKey((value) => value + 1);
  }, []);

  const isOpen = manualOpen || (!autoDismissed && routeAutoOpen);

  const value = useMemo(
    () => ({
      isOpen,
      sessionKey,
      openWalletConnect,
      closeWalletConnect,
      triggerAutoOpen,
    }),
    [isOpen, sessionKey, openWalletConnect, closeWalletConnect, triggerAutoOpen]
  );

  return (
    <WalletConnectContext.Provider value={value}>{children}</WalletConnectContext.Provider>
  );
}

export function WalletConnectRouteSync() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { triggerAutoOpen } = useWalletConnect();

  useEffect(() => {
    if (pathname === "/login") {
      router.replace("/");
      triggerAutoOpen();
      return;
    }

    if (searchParams.get("wallet") === "1") {
      triggerAutoOpen();
      const nextParams = new URLSearchParams(searchParams.toString());
      nextParams.delete("wallet");
      const query = nextParams.toString();
      router.replace(query ? `${pathname}?${query}` : pathname);
    }
  }, [pathname, router, searchParams, triggerAutoOpen]);

  return null;
}

export function useWalletConnect() {
  const context = useContext(WalletConnectContext);
  if (!context) {
    throw new Error("useWalletConnect must be used within WalletConnectProvider");
  }
  return context;
}