"use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { useLanguage } from "@/components/LanguageProvider";
import { useWalletConnect } from "@/components/auth/WalletConnectProvider";

export function AuthButton({ mobile = false }: { mobile?: boolean }) {
  const { data: session, status } = useSession();
  const { t } = useLanguage();
  const { openWalletConnect } = useWalletConnect();

  if (status === "loading") {
    return <span className="auth-box auth-box--loading text-xs text-muted">…</span>;
  }

  if (!session?.user) {
    return (
      <button
        type="button"
        onClick={openWalletConnect}
        className={`auth-box__signin${mobile ? " auth-box__signin--mobile" : ""}`}
      >
        <span className="auth-box__glow" aria-hidden="true" />
        <span className="auth-box__label">{t("navLogin")}</span>
      </button>
    );
  }

  const label =
    session.user.role === "admin" ? t("navAdmin") : t("navMyLearning");

  return (
    <div
      className={`auth-box auth-box--signed-in${mobile ? " auth-box--mobile" : ""}`}
    >
      <span className="auth-box__glow" aria-hidden="true" />
      <Link
        href={session.user.role === "admin" ? "/admin" : "/account"}
        className="auth-box__link"
      >
        {label}
      </Link>
      <span className="auth-box__divider" aria-hidden="true" />
      <button
        type="button"
        onClick={() => signOut({ callbackUrl: "/" })}
        className="auth-box__signout"
      >
        {t("navSignOut")}
      </button>
    </div>
  );
}