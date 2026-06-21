"use client";

import { useLanguage } from "@/components/LanguageProvider";
import { site } from "@/lib/data";

export function XIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={className}
      fill="currentColor"
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

type DiscordCommunityProps = {
  variant?: "section" | "compact";
};

export function DiscordCommunity({ variant = "section" }: DiscordCommunityProps) {
  const { t } = useLanguage();
  const { handle, url } = site.creator;
  const handleLabel = `@${handle}`;

  if (variant === "compact") {
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 text-muted transition-colors hover:text-foreground no-underline"
      >
        <XIcon className="h-4 w-4 shrink-0" />
        <span>{t("discordLabel")}</span>
      </a>
    );
  }

  return (
    <section className="border-y-4 border-border bg-card">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="community-pixel-card group flex flex-col items-center gap-6 rounded-none bg-background p-6 transition-all sm:flex-row sm:p-8 no-underline"
        >
          <div
            className="flex h-16 w-16 shrink-0 items-center justify-center text-accent-orange transition-colors group-hover:bg-accent-orange/25"
            style={{
              border: "3px solid var(--accent-orange)",
              background: "rgba(255, 140, 0, 0.15)",
              boxShadow: "3px 3px 0 var(--pixel-shadow)",
            }}
          >
            <XIcon className="h-9 w-9" />
          </div>
          <div className="min-w-0 flex-1 text-center sm:text-left">
            <p className="footer-heading text-accent-orange">
              {t("discordCommunity")}
            </p>
            <h2 className="section-title mt-2 text-base sm:text-lg">
              {t("discordTitle", { label: site.name })}
            </h2>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted sm:text-base">
              {t("discordDescription", { handle: handleLabel })}
            </p>
          </div>
          <span
            className="community-join-btn pixel-btn shrink-0 text-accent-orange no-underline"
            style={{
              borderColor: "var(--accent-orange)",
              background: "rgba(255, 140, 0, 0.15)",
            }}
          >
            {t("discordJoin", { handle: handleLabel })} →
          </span>
        </a>
      </div>
    </section>
  );
}