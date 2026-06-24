import Link from "next/link";
import type { Session } from "next-auth";
import { t } from "@/lib/i18n/translations";

export function AuthButtonShell({
  session,
  mobile = false,
  locale = "en",
}: {
  session: Session | null;
  mobile?: boolean;
  locale?: "en" | "zh-CN" | "ja" | "fr";
}) {
  if (!session?.user) {
    return (
      <a
        href="/?wallet=1"
        className={`auth-box__signin auth-box__signin--ssr${mobile ? " auth-box__signin--mobile" : ""}`}
      >
        <span className="auth-box__glow" aria-hidden="true" />
        <span className="auth-box__label">{t(locale, "navLogin")}</span>
      </a>
    );
  }

  const label = session.user.role === "admin" ? t(locale, "navAdmin") : t(locale, "navMyLearning");

  return (
    <div
      className={`auth-box auth-box--signed-in auth-box--ssr${mobile ? " auth-box--mobile" : ""}`}
    >
      <span className="auth-box__glow" aria-hidden="true" />
      <Link
        href={session.user.role === "admin" ? "/admin" : "/account"}
        className="auth-box__link"
      >
        {label}
      </Link>
    </div>
  );
}