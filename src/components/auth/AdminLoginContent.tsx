"use client";

import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useLanguage } from "@/components/LanguageProvider";
import { site } from "@/lib/data";

export function AdminLoginContent() {
  const { t } = useLanguage();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.title = `${t("adminLoginTitle")} · ${site.name}`;
  }, [t]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await signIn("admin", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError(t("adminLoginError"));
        return;
      }

      router.push("/admin");
      router.refresh();
    } catch {
      setError(t("adminLoginError"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page-content page-content--narrow">
      <h1 className="section-title text-2xl text-center">{t("adminLoginTitle")}</h1>
      <p className="mt-2 text-center text-sm text-muted">{t("adminLoginSubtitle")}</p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4 rounded-lg border border-border bg-card p-6">
        <div>
          <label htmlFor="admin-email" className="mb-1 block text-xs text-muted">
            {t("adminLoginEmailLabel")}
          </label>
          <input
            id="admin-email"
            name="email"
            type="email"
            autoComplete="username"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="w-full rounded border border-border bg-background px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label htmlFor="admin-password" className="mb-1 block text-xs text-muted">
            {t("adminLoginPasswordLabel")}
          </label>
          <input
            id="admin-password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="w-full rounded border border-border bg-background px-3 py-2 text-sm"
          />
        </div>

        {error ? <p className="text-sm text-accent-orange">{error}</p> : null}

        <button
          type="submit"
          disabled={loading}
          className="preview-btn preview-btn--solid w-full disabled:opacity-60"
        >
          {loading ? t("adminLoginSubmitting") : t("adminLoginSubmit")}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-muted">
        <Link href="/" className="hover:underline">
          {t("adminBackToSite")}
        </Link>
      </p>
    </div>
  );
}