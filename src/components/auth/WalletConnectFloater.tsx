"use client";

import { useEffect } from "react";
import { useLanguage } from "@/components/LanguageProvider";
import { WalletConnectPanel } from "@/components/auth/WalletConnectPanel";
import { navigateToAppPath } from "@/lib/navigation";
import { useWalletConnect } from "@/components/auth/WalletConnectProvider";

export function WalletConnectFloater() {
  const { closeWalletConnect } = useWalletConnect();
  const { t } = useLanguage();

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeWalletConnect();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [closeWalletConnect]);

  return (
    <div
      className="wallet-connect-overlay"
      role="dialog"
      aria-modal="true"
      aria-label={t("loginTitle")}
      onClick={closeWalletConnect}
    >
      <div
        className="wallet-connect-card pixel-panel"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          className="wallet-connect-close"
          onClick={closeWalletConnect}
          aria-label={t("walletConnectClose")}
        >
          ×
        </button>
        <WalletConnectPanel
          bare
          mode="learner"
          showAdminLink
          onAdminLinkClick={closeWalletConnect}
          onSuccess={() => {
            closeWalletConnect();
            navigateToAppPath("/account");
          }}
        />
      </div>
    </div>
  );
}