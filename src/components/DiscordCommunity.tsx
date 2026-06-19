"use client";

import { useLanguage } from "@/components/LanguageProvider";
import { site } from "@/lib/data";

export function DiscordIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={className}
      fill="currentColor"
    >
      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
    </svg>
  );
}

type DiscordCommunityProps = {
  variant?: "section" | "compact";
};

export function DiscordCommunity({ variant = "section" }: DiscordCommunityProps) {
  const { t } = useLanguage();
  const { url, label } = site.discord;

  if (variant === "compact") {
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 text-muted transition-colors hover:text-[#5865F2] no-underline"
      >
        <DiscordIcon className="h-4 w-4 shrink-0" />
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
          className="discord-pixel-card group flex flex-col items-center gap-6 rounded-none bg-background p-6 transition-all sm:flex-row sm:p-8 no-underline"
        >
          <div className="flex h-16 w-16 shrink-0 items-center justify-center border-3 border-[#5865F2] bg-[#5865F2]/15 text-[#5865F2] transition-colors group-hover:bg-[#5865F2]/25"
            style={{ border: "3px solid #5865F2", boxShadow: "3px 3px 0 #3c45a5" }}
          >
            <DiscordIcon className="h-9 w-9" />
          </div>
          <div className="min-w-0 flex-1 text-center sm:text-left">
            <p className="footer-heading text-[#5865F2]">
              {t("discordCommunity")}
            </p>
            <h2 className="section-title mt-2 text-base sm:text-lg">
              {t("discordTitle", { label })}
            </h2>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted sm:text-base">
              {t("discordDescription")}
            </p>
          </div>
          <span
            className="pixel-btn shrink-0 text-[#5865F2] no-underline"
            style={{ borderColor: "#5865F2", background: "rgba(88, 101, 242, 0.15)" }}
          >
            {t("discordJoin")} →
          </span>
        </a>
      </div>
    </section>
  );
}