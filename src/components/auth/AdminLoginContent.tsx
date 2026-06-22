"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useLanguage } from "@/components/LanguageProvider";
import { SolanaIcon } from "@/components/auth/WalletChainIcon";
import { site } from "@/lib/data";
import { loginAdminWithSolanaWallet } from "@/lib/wallet/admin-session";
import { fetchSolanaNonce } from "@/lib/wallet/nonce-client";
import {
  listSolanaWallets,
  type SolanaWalletId,
  type SolanaWalletOption,
} from "@/lib/wallet/solana-connect";

export function AdminLoginContent() {
  const { t } = useLanguage();
  const [refreshKey, setRefreshKey] = useState(0);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [noncePayload, setNoncePayload] = useState<Awaited<ReturnType<typeof fetchSolanaNonce>> | null>(
    null
  );
  const [error, setError] = useState("");

  const solanaWallets = useMemo(() => listSolanaWallets(), [refreshKey]);

  useEffect(() => {
    document.title = `${t("adminLoginTitle")} · ${site.name}`;
  }, [t]);

  useEffect(() => {
    let cancelled = false;
    fetchSolanaNonce()
      .then((payload) => {
        if (!cancelled) setNoncePayload(payload);
      })
      .catch(() => {
        if (!cancelled) setError(t("adminLoginError"));
      });
    return () => {
      cancelled = true;
    };
  }, [refreshKey, t]);

  const handleWalletClick = useCallback(
    async (wallet: SolanaWalletOption) => {
      if (!noncePayload) return;
      setError("");
      setActiveId(wallet.id);

      try {
        await loginAdminWithSolanaWallet(wallet.id as SolanaWalletId, noncePayload);
        window.location.href = "/admin";
      } catch (caught) {
        const code = caught instanceof Error ? caught.message : "";
        if (code === "USER_REJECTED") {
          setError(t("loginWalletUserRejected"));
        } else if (code === "WALLET_NOT_INSTALLED") {
          window.open(wallet.installUrl, "_blank", "noopener,noreferrer");
        } else {
          setError(t("adminLoginError"));
        }
      } finally {
        setActiveId(null);
        setRefreshKey((value) => value + 1);
      }
    },
    [noncePayload, t]
  );

  return (
    <div className="mx-auto max-w-md px-4 py-12 sm:px-6">
      <h1 className="section-title text-2xl">{t("adminLoginTitle")}</h1>
      <p className="mt-3 text-sm text-muted">{t("adminLoginSubtitle")}</p>

      <div className="mt-8 pixel-panel p-5">
        <div className="wallet-connect-section__head">
          <SolanaIcon className="wallet-connect-section__logo" />
          <span className="text-sm font-semibold">{t("adminLoginSolanaOnly")}</span>
        </div>

        {!noncePayload ? (
          <p className="mt-4 text-sm text-muted">{t("walletConnectPreparing")}</p>
        ) : (
          <div className="wallet-connect-grid mt-4">
            {solanaWallets.map((wallet) => {
              const isActive = activeId === wallet.id;
              return (
                <button
                  key={wallet.id}
                  type="button"
                  disabled={Boolean(activeId)}
                  onClick={() => handleWalletClick(wallet)}
                  className={`wallet-option${isActive ? " wallet-option--active" : ""}`}
                >
                  <img src={wallet.icon} alt="" className="wallet-option__icon" />
                  <span className="wallet-option__name">{wallet.name}</span>
                  <span className="wallet-option__status">
                    {isActive
                      ? t("walletConnectStepSign")
                      : wallet.installed
                        ? t("walletConnectInstalled")
                        : t("walletConnectInstall")}
                  </span>
                </button>
              );
            })}
          </div>
        )}

        <p className="mt-4 text-xs text-muted">{t("adminLoginWalletNote")}</p>
        {error ? <p className="mt-3 text-sm text-red-400">{error}</p> : null}

        <button
          type="button"
          className="wallet-connect-refresh mt-4"
          onClick={() => setRefreshKey((value) => value + 1)}
        >
          {t("walletConnectRefresh")}
        </button>
      </div>

      <p className="mt-6 text-center text-sm text-muted">
        <Link href="/?wallet=1" className="hover:underline">
          {t("adminBackToLearnerLogin")}
        </Link>
      </p>
    </div>
  );
}