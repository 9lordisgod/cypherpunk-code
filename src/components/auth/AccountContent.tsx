"use client";

import { useSession } from "next-auth/react";
import { useWalletConnect } from "@/components/auth/WalletConnectProvider";
import { useEffect } from "react";
import { useLanguage } from "@/components/LanguageProvider";

import { site } from "@/lib/data";

export function AccountContent() {
  const { data: session, status } = useSession();
  const { t } = useLanguage();
  const { openWalletConnect } = useWalletConnect();

  useEffect(() => {
    document.title = `${t("accountTitle")} · ${site.name}`;
  }, [t]);

  if (status === "loading") {
    return <p className="page-content page-content--narrow text-muted">{t("accountLoading")}</p>;
  }

  if (!session?.user) {
    return (
      <div className="page-content page-content--narrow text-center">
        <p className="text-muted">{t("accountSignInRequired")}</p>
        <button
          type="button"
          onClick={openWalletConnect}
          className="pixel-btn pixel-btn--planb mt-4 text-sm"
        >
          {t("navLogin")}
        </button>
      </div>
    );
  }

  return (
    <div className="page-content page-content--narrow">
      <h1 className="section-title text-2xl">{t("accountTitle")}</h1>
      <p className="mt-2 text-muted">
        {t("accountWelcome", {
          name: session.user.name ?? session.user.email ?? "Learner",
        })}
      </p>
    </div>
  );
}