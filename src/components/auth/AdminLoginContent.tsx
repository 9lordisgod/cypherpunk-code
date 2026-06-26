"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useLanguage } from "@/components/LanguageProvider";
import { WalletConnectPanel } from "@/components/auth/WalletConnectPanel";
import { site } from "@/lib/data";

export function AdminLoginContent() {
  const { t } = useLanguage();

  useEffect(() => {
    document.title = `${t("adminLoginTitle")} · ${site.name}`;
  }, [t]);

  return (
    <div className="page-content page-content--narrow">
      <p className="text-center text-sm text-muted">{t("adminLoginSubtitle")}</p>
      <div className="mt-6">
        <WalletConnectPanel mode="admin" />
      </div>
      <p className="mt-6 text-center text-sm text-muted">
        <Link href="/?wallet=1" className="hover:underline">
          {t("adminBackToLearnerLogin")}
        </Link>
      </p>
    </div>
  );
}