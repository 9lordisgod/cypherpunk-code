"use client";

import { WalletReadyState } from "@solana/wallet-adapter-base";
import { useWallet } from "@solana/wallet-adapter-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useLanguage } from "@/components/LanguageProvider";
import { SolanaIcon } from "@/components/auth/WalletChainIcon";
import { loginAdminWithSolanaWallet } from "@/lib/wallet/admin-session";
import {
  fetchSolanaNonce,
  type SolanaNoncePayload,
} from "@/lib/wallet/nonce-client";
import { loginWithSolanaWallet } from "@/lib/wallet/session";

type Step = "pick" | "connecting" | "signing";

type WalletConnectPanelProps = {
  mode: "learner" | "admin";
  bare?: boolean;
  onSuccess?: () => void;
  showAdminLink?: boolean;
  onAdminLinkClick?: () => void;
};

export function WalletConnectPanel({
  mode,
  bare = false,
  onSuccess,
  showAdminLink = false,
  onAdminLinkClick,
}: WalletConnectPanelProps) {
  const { t } = useLanguage();
  const { wallets, disconnect } = useWallet();
  const [error, setError] = useState("");
  const [step, setStep] = useState<Step>("pick");
  const [activeId, setActiveId] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [solanaNonce, setSolanaNonce] = useState<SolanaNoncePayload | null>(null);
  const [nonceLoading, setNonceLoading] = useState(false);
  const [noncesReady, setNoncesReady] = useState(false);

  const walletOptions = useMemo(
    () =>
      wallets.map((wallet) => ({
        name: wallet.adapter.name,
        icon: wallet.adapter.icon,
        installUrl: wallet.adapter.url,
        installed: wallet.readyState === WalletReadyState.Installed,
      })),
    [wallets]
  );

  const stepLabels = [
    { id: "pick" as const, label: t("walletConnectStepPick") },
    { id: "connecting" as const, label: t("walletConnectStepConnectLabel") },
    { id: "signing" as const, label: t("walletConnectStepSignLabel") },
  ];

  useEffect(() => {
    let cancelled = false;

    const timeout = window.setTimeout(() => {
      setNonceLoading(true);
      setNoncesReady(false);
      setSolanaNonce(null);

      fetchSolanaNonce()
        .then((payload) => {
          if (cancelled) return;
          setSolanaNonce(payload);
          setNoncesReady(true);
        })
        .catch(() => {
          if (!cancelled) {
            setNoncesReady(false);
            setError(mode === "admin" ? t("adminLoginError") : t("loginError"));
          }
        })
        .finally(() => {
          if (!cancelled) setNonceLoading(false);
        });
    }, 0);

    return () => {
      cancelled = true;
      window.clearTimeout(timeout);
    };
  }, [mode, refreshKey, t]);

  const handleWalletClick = (walletName: string) => {
    setError("");

    const target = wallets.find((wallet) => wallet.adapter.name === walletName);
    if (!target) return;

    if (target.readyState !== WalletReadyState.Installed) {
      if (target.adapter.url) {
        window.open(target.adapter.url, "_blank", "noopener,noreferrer");
      }
      setError(t("loginWalletInstallFirst"));
      return;
    }

    if (!solanaNonce) {
      setError(mode === "admin" ? t("adminLoginError") : t("loginError"));
      return;
    }

    setActiveId(walletName);
    setStep("connecting");

    const authPromise = (async () => {
      await target.adapter.connect();
      setStep("signing");

      if (mode === "admin") {
        await loginAdminWithSolanaWallet(target.adapter, solanaNonce);
      } else {
        await loginWithSolanaWallet(target.adapter, solanaNonce);
      }

      await target.adapter.disconnect().catch(() => undefined);
    })();

    void authPromise
      .then(() => {
        if (onSuccess) {
          onSuccess();
        } else {
          window.location.href = mode === "admin" ? "/admin" : "/account";
        }
      })
      .catch((caught) => {
        const code = caught instanceof Error ? caught.message : "UNKNOWN";
        if (code === "WALLET_NOT_INSTALLED") {
          setError(t("loginWalletInstallFirst"));
        } else if (code === "USER_REJECTED") {
          setError(t("loginWalletUserRejected"));
        } else if (code === "WALLET_VERIFY_FAILED" || code === "ADMIN_WALLET_VERIFY_FAILED") {
          setError(t("loginWalletVerifyFailed"));
        } else {
          setError(mode === "admin" ? t("adminLoginError") : t("loginError"));
        }
        setStep("pick");
        setActiveId(null);
        setRefreshKey((value) => value + 1);
        void disconnect().catch(() => undefined);
      });
  };

  const renderWalletRow = (
    wallet: (typeof walletOptions)[number],
    installedLabel: string,
    installLabel: string
  ) => {
    const isActive = activeId === wallet.name;
    const isLoading = isActive && step !== "pick";

    return (
      <button
        key={wallet.name}
        type="button"
        disabled={step !== "pick" || nonceLoading || !noncesReady}
        onClick={() => handleWalletClick(wallet.name)}
        className={`wallet-option${isActive ? " wallet-option--active" : ""}`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={wallet.icon} alt="" className="wallet-option__icon" />
        <span className="wallet-option__name">{wallet.name}</span>
        <span className="wallet-option__status">
          {isLoading
            ? step === "connecting"
              ? t("walletConnectStepConnect")
              : t("walletConnectStepSign")
            : wallet.installed
              ? installedLabel
              : installLabel}
        </span>
      </button>
    );
  };

  const title = mode === "admin" ? t("adminLoginTitle") : t("loginTitle");
  const subtitle =
    mode === "admin" ? t("walletConnectPickWalletAdmin") : t("walletConnectPickWallet");

  const content = (
    <>
      <h2 className="wallet-connect-title">{title}</h2>
      <p className="wallet-connect-subtitle">{subtitle}</p>

      <ul className="wallet-connect-intro" aria-label="Sign-in steps overview">
        <li>{t("walletConnectIntro1")}</li>
        <li>{t("walletConnectIntro2")}</li>
        <li>{t("walletConnectIntro3")}</li>
      </ul>

      <ol className="wallet-connect-steps" aria-label="Current sign-in progress">
        {stepLabels.map((entry) => (
          <li
            key={entry.id}
            className={`wallet-connect-steps__item${
              step === entry.id ? " wallet-connect-steps__item--active" : ""
            }${stepLabels.findIndex((item) => item.id === step) > stepLabels.findIndex((item) => item.id === entry.id) ? " wallet-connect-steps__item--done" : ""}`}
          >
            {entry.label}
          </li>
        ))}
      </ol>

      {nonceLoading ? (
        <p className="wallet-connect-preparing">{t("walletConnectPreparing")}</p>
      ) : null}

      <div className="wallet-connect-callout wallet-connect-callout--warn" role="note">
        {t("walletConnectSafetyWarn")}
      </div>

      <div className="wallet-connect-section">
        <div className="wallet-connect-section__head">
          <SolanaIcon className="wallet-connect-section__logo" />
          <span>Solana</span>
        </div>
        <div className="wallet-connect-grid">
          {walletOptions.map((wallet) =>
            renderWalletRow(
              wallet,
              t("walletConnectInstalled"),
              t("walletConnectInstall")
            )
          )}
        </div>
      </div>

      <p className="wallet-connect-note">
        {mode === "admin" ? t("adminLoginWalletNote") : t("loginWalletNote")}
      </p>
      <div className="wallet-connect-callout wallet-connect-callout--info" role="note">
        {t("walletConnectSafetyInfo")}
      </div>
      {mode === "learner" ? (
        <p className="wallet-connect-privacy">{t("loginWalletPrivacy")}</p>
      ) : null}

      {error ? <p className="wallet-connect-error">{error}</p> : null}

      <div className="wallet-connect-footer">
        <button
          type="button"
          className="wallet-connect-refresh"
          onClick={() => setRefreshKey((value) => value + 1)}
          disabled={step !== "pick"}
        >
          {t("walletConnectRefresh")}
        </button>
        {showAdminLink ? (
          <Link href="/admin/login" className="hover:underline" onClick={onAdminLinkClick}>
            {t("loginAdminLink")}
          </Link>
        ) : null}
      </div>
    </>
  );

  if (bare) return content;

  return (
    <div
      className={
        mode === "admin"
          ? "wallet-connect-card wallet-connect-card--inline pixel-panel"
          : "wallet-connect-card pixel-panel"
      }
    >
      {content}
    </div>
  );
}