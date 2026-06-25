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
    return <p className="mx-auto max-w-3xl px-4 py-12 text-muted">{t("accountLoading")}</p>;
  }

  if (!session?.user) {
    return (
      <div className="mx-auto max-w-md px-4 py-12 text-center">
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
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="section-title text-2xl">{t("accountTitle")}</h1>
      <p className="mt-2 text-muted">
        {t("accountWelcome", {
          name: session.user.name ?? session.user.email ?? "Learner",
        })}
      </p>
    </div>
  );
}