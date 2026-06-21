"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useLanguage } from "@/components/LanguageProvider";
import { BitcoinIcon, SolanaIcon } from "@/components/auth/WalletChainIcon";
import { useWalletConnect } from "@/components/auth/WalletConnectProvider";
import {
  listBitcoinWallets,
  type BitcoinWalletId,
  type BitcoinWalletOption,
} from "@/lib/wallet/bitcoin-connect";
import {
  fetchBitcoinNonce,
  fetchSolanaNonce,
  type BitcoinNoncePayload,
  type SolanaNoncePayload,
} from "@/lib/wallet/nonce-client";
import {
  listSolanaWallets,
  type SolanaWalletId,
  type SolanaWalletOption,
} from "@/lib/wallet/solana-connect";
import {
  loginWithBitcoinWallet,
  loginWithSolanaWallet,
} from "@/lib/wallet/session";

type WalletTarget =
  | { chain: "solana"; wallet: SolanaWalletOption }
  | { chain: "bitcoin"; wallet: BitcoinWalletOption };

type Step = "pick" | "connecting" | "signing";

export function WalletConnectFloater() {
  const { closeWalletConnect } = useWalletConnect();
  const { t } = useLanguage();
  const [error, setError] = useState("");
  const [step, setStep] = useState<Step>("pick");
  const [activeId, setActiveId] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [solanaNonce, setSolanaNonce] = useState<SolanaNoncePayload | null>(null);
  const [bitcoinNonce, setBitcoinNonce] = useState<BitcoinNoncePayload | null>(null);
  const [nonceLoading, setNonceLoading] = useState(false);
  const [noncesReady, setNoncesReady] = useState(false);

  const solanaWallets = useMemo(() => listSolanaWallets(), [refreshKey]); // eslint-disable-line react-hooks/exhaustive-deps -- refreshKey forces wallet redetection
  const bitcoinWallets = useMemo(() => listBitcoinWallets(), [refreshKey]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    let cancelled = false;

    const timeout = window.setTimeout(() => {
      setNonceLoading(true);
      setNoncesReady(false);
      setSolanaNonce(null);
      setBitcoinNonce(null);

      Promise.all([fetchSolanaNonce(), fetchBitcoinNonce()])
        .then(([solana, bitcoin]) => {
          if (cancelled) return;
          setSolanaNonce(solana);
          setBitcoinNonce(bitcoin);
          setNoncesReady(true);
        })
        .catch(() => {
          if (!cancelled) {
            setNoncesReady(false);
            setError(t("loginError"));
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
  }, [refreshKey, t]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && step === "pick") closeWalletConnect();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [step, closeWalletConnect]);

  const handleWalletClick = (target: WalletTarget) => {
    const walletId = `${target.chain}:${target.wallet.id}`;
    setError("");

    if (!target.wallet.installed) {
      window.open(target.wallet.installUrl, "_blank", "noopener,noreferrer");
      setError(t("loginWalletInstallFirst"));
      return;
    }

    const nonce =
      target.chain === "solana" ? solanaNonce : bitcoinNonce;

    if (!nonce) {
      setError(t("loginError"));
      return;
    }

    // Invoke the wallet extension immediately while the click user-gesture is active.
    const authPromise =
      target.chain === "solana"
        ? loginWithSolanaWallet(
            target.wallet.id as SolanaWalletId,
            nonce as SolanaNoncePayload
          )
        : loginWithBitcoinWallet(
            target.wallet.id as BitcoinWalletId,
            nonce as BitcoinNoncePayload
          );

    setActiveId(walletId);
    setStep("connecting");

    void authPromise
      .then(() => {
        setStep("signing");
        closeWalletConnect();
        window.location.href = "/account";
      })
      .catch((caught) => {
        const code = caught instanceof Error ? caught.message : "UNKNOWN";
        if (code === "WALLET_NOT_INSTALLED") {
          setError(t("loginWalletInstallFirst"));
        } else if (code === "USER_REJECTED") {
          setError(t("loginWalletUserRejected"));
        } else if (code === "WALLET_VERIFY_FAILED") {
          setError(t("loginWalletVerifyFailed"));
        } else {
          setError(t("loginError"));
        }
        setStep("pick");
        setActiveId(null);
        setRefreshKey((value) => value + 1);
      });
  };

  const renderWalletRow = (
    target: WalletTarget,
    installedLabel: string,
    installLabel: string
  ) => {
    const walletId = `${target.chain}:${target.wallet.id}`;
    const isActive = activeId === walletId;
    const isLoading = isActive && step !== "pick";

    return (
      <button
        key={walletId}
        type="button"
        disabled={step !== "pick" || nonceLoading || !noncesReady}
        onClick={() => handleWalletClick(target)}
        className={`wallet-option${isActive ? " wallet-option--active" : ""}`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={target.wallet.icon} alt="" className="wallet-option__icon" />
        <span className="wallet-option__name">{target.wallet.name}</span>
        <span className="wallet-option__status">
          {isLoading
            ? step === "connecting"
              ? t("walletConnectStepConnect")
              : t("walletConnectStepSign")
            : target.wallet.installed
              ? installedLabel
              : installLabel}
        </span>
      </button>
    );
  };

  return (
    <div
      className="wallet-connect-overlay"
      role="dialog"
      aria-modal="true"
      aria-label={t("loginTitle")}
      onClick={step === "pick" ? closeWalletConnect : undefined}
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

        <h2 className="wallet-connect-title">{t("loginTitle")}</h2>
        <p className="wallet-connect-subtitle">{t("walletConnectPickWallet")}</p>

        {nonceLoading ? (
          <p className="wallet-connect-preparing">{t("walletConnectPreparing")}</p>
        ) : null}

        <div className="wallet-connect-section">
          <div className="wallet-connect-section__head">
            <SolanaIcon className="wallet-connect-section__logo" />
            <span>Solana</span>
          </div>
          <div className="wallet-connect-grid">
            {solanaWallets.map((wallet) =>
              renderWalletRow(
                { chain: "solana", wallet },
                t("walletConnectInstalled"),
                t("walletConnectInstall")
              )
            )}
          </div>
        </div>

        <div className="wallet-connect-section">
          <div className="wallet-connect-section__head">
            <BitcoinIcon className="wallet-connect-section__logo" />
            <span>Bitcoin</span>
          </div>
          <div className="wallet-connect-grid">
            {bitcoinWallets.map((wallet) =>
              renderWalletRow(
                { chain: "bitcoin", wallet },
                t("walletConnectInstalled"),
                t("walletConnectInstall")
              )
            )}
          </div>
        </div>

        <p className="wallet-connect-note">{t("loginWalletNote")}</p>
        <p className="wallet-connect-privacy">{t("loginWalletPrivacy")}</p>

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
          <Link href="/admin/login" className="hover:underline" onClick={closeWalletConnect}>
            {t("loginAdminLink")}
          </Link>
        </div>
      </div>
    </div>
  );
}