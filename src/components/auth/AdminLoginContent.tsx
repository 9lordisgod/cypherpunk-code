"use client";

import Link from "next/link";
import { signIn } from "next-auth/react";
import { useEffect, useState } from "react";
import { useLanguage } from "@/components/LanguageProvider";
import { site } from "@/lib/data";

export function AdminLoginContent() {
  const { t } = useLanguage();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    document.title = `${t("adminLoginTitle")} · ${site.name}`;
  }, [t]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    const result = await signIn("admin", {
      email,
      password,
      redirect: false,
      callbackUrl: "/admin",
    });
    if (result?.error) {
      setError(t("adminLoginError"));
      return;
    }
    window.location.href = "/admin";
  };

  return (
    <div className="mx-auto max-w-md px-4 py-12 sm:px-6">
      <h1 className="section-title text-2xl">{t("adminLoginTitle")}</h1>
      <p className="mt-3 text-sm text-muted">{t("adminLoginSubtitle")}</p>
      <form onSubmit={handleSubmit} className="mt-8 pixel-panel space-y-4 p-5">
        <label className="block text-sm">
          <span className="text-muted">{t("feedbackEmail")}</span>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="auth-input mt-1 w-full"
          />
        </label>
        <label className="block text-sm">
          <span className="text-muted">{t("adminPassword")}</span>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="auth-input mt-1 w-full"
          />
        </label>
        {error ? <p className="text-sm text-red-400">{error}</p> : null}
        <button type="submit" className="pixel-btn pixel-btn--planb w-full text-sm">
          {t("adminLoginButton")}
        </button>
      </form>
      <p className="mt-6 text-center text-sm text-muted">
        <Link href="/?wallet=1" className="hover:underline">
          {t("adminBackToLearnerLogin")}
        </Link>
      </p>
    </div>
  );
}