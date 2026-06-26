"use client";

import type { Session } from "next-auth";
import { Suspense } from "react";
import { AuthSessionProvider } from "@/components/auth/SessionProvider";
import { SolanaProvider } from "@/components/auth/SolanaProvider";
import { WalletConnectFloater } from "@/components/auth/WalletConnectFloater";
import {
  useWalletConnect,
  WalletConnectProvider,
  WalletConnectRouteSync,
} from "@/components/auth/WalletConnectProvider";
import { AnalyticsBeacon } from "@/components/AnalyticsBeacon";
import { FeedbackFloater } from "@/components/FeedbackFloater";
import { LanguageProvider } from "@/components/LanguageProvider";

function WalletConnectFloaterBridge() {
  const { isOpen, sessionKey } = useWalletConnect();
  if (!isOpen) return null;
  return <WalletConnectFloater key={sessionKey} />;
}

export function Providers({
  children,
  session,
}: {
  children: React.ReactNode;
  session?: Session | null;
}) {
  return (
    <AuthSessionProvider session={session}>
      <LanguageProvider>
        <SolanaProvider>
          <WalletConnectProvider>
            <Suspense fallback={null}>
              <WalletConnectRouteSync />
              <AnalyticsBeacon />
            </Suspense>
            <WalletConnectFloaterBridge />
            {children}
            <FeedbackFloater />
          </WalletConnectProvider>
        </SolanaProvider>
      </LanguageProvider>
    </AuthSessionProvider>
  );
}