"use client";

import { Suspense } from "react";
import { AuthSessionProvider } from "@/components/auth/SessionProvider";
import { WalletConnectFloater } from "@/components/auth/WalletConnectFloater";
import {
  useWalletConnect,
  WalletConnectProvider,
} from "@/components/auth/WalletConnectProvider";
import { FeedbackFloater } from "@/components/FeedbackFloater";
import { LanguagePicker } from "@/components/LanguagePicker";
import { LanguageProvider } from "@/components/LanguageProvider";

function WalletConnectLayer({ children }: { children: React.ReactNode }) {
  return (
    <WalletConnectProvider>
      <WalletConnectFloaterBridge />
      {children}
    </WalletConnectProvider>
  );
}

function WalletConnectFloaterBridge() {
  const { isOpen, sessionKey } = useWalletConnect();
  if (!isOpen) return null;
  return <WalletConnectFloater key={sessionKey} />;
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthSessionProvider>
      <LanguageProvider>
        <Suspense fallback={null}>
          <WalletConnectLayer>{children}</WalletConnectLayer>
          <FeedbackFloater />
        </Suspense>
        <LanguagePicker />
      </LanguageProvider>
    </AuthSessionProvider>
  );
}