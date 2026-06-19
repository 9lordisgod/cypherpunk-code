"use client";

import Link from "next/link";
import { useEffect } from "react";
import { ArchiveNotice } from "@/components/ArchiveNotice";
import { DiscordIcon } from "@/components/DiscordCommunity";
import { useLanguage } from "@/components/LanguageProvider";
import { resources, site } from "@/lib/data";

export function AboutContent() {
  const { t } = useLanguage();
  const freeCount = resources.filter((r) => r.pricing === "free").length;
  const handle = `@${site.creator.handle}`;

  useEffect(() => {
    document.title = `${t("navAbout")} · ${site.name}`;
  }, [t]);

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="section-title text-2xl sm:text-3xl">
        {t("aboutPageTitle", { name: site.name })}
      </h1>
      <p className="mt-4 text-lg text-muted">{t("footerTagline")}</p>

      <div className="mt-8">
        <ArchiveNotice variant="full" />
      </div>

      <div className="prose-cypher mt-10 space-y-6 text-foreground">
        <section id="policy">
          <h2 className="text-xl font-semibold">{t("aboutArchiveMission")}</h2>
          <p className="mt-2 leading-relaxed text-muted">
            {t("aboutArchiveMission1", { name: site.name })}
          </p>
          <p className="mt-3 leading-relaxed text-muted">
            {t("aboutArchiveMission2", { handle })}
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold">{t("aboutWhatIsThis")}</h2>
          <p className="mt-2 leading-relaxed text-muted">{t("aboutWhatIsThisText")}</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold">{t("aboutWhoBuilt")}</h2>
          <p className="mt-2 leading-relaxed text-muted">
            {t("aboutWhoBuiltText", { handle })}
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold">{t("aboutCpScore")}</h2>
          <p className="mt-2 leading-relaxed text-muted">{t("aboutCpScoreText")}</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold">{t("aboutStats")}</h2>
          <ul className="mt-2 space-y-1 text-muted">
            <li>{t("aboutStatsResources", { count: resources.length })}</li>
            <li>{t("aboutStatsFree", { free: freeCount })}</li>
            <li>{t("aboutStatsCoverage")}</li>
            <li>{t("aboutStatsNoTracking")}</li>
          </ul>
        </section>

        <section id="donate">
          <h2 className="text-xl font-semibold">{t("aboutSupport")}</h2>
          <p className="mt-2 leading-relaxed text-muted">
            {t("aboutSupportText", { name: site.name })}
          </p>
          <div className="mt-4 space-y-4 rounded-lg border border-border bg-card p-6">
            <div>
              <p className="font-mono text-xs uppercase tracking-wider text-accent-orange">
                {t("aboutBitcoin")}
              </p>
              <p className="mt-1 break-all font-mono text-sm">
                <a
                  href={`bitcoin:${site.donations.bitcoin}`}
                  className="text-accent hover:underline"
                >
                  {site.donations.bitcoin}
                </a>
              </p>
            </div>
            <div>
              <p className="font-mono text-xs uppercase tracking-wider text-accent-orange">
                {t("aboutMonero")}
              </p>
              <p className="mt-1 break-all font-mono text-sm">{site.donations.monero}</p>
            </div>
          </div>
        </section>

        <section id="community">
          <h2 className="text-xl font-semibold">{t("aboutCommunitySection")}</h2>
          <p className="mt-2 leading-relaxed text-muted">
            {t("aboutCommunityText", { label: site.discord.label })}
          </p>
          <a
            href={site.discord.url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-3 rounded-lg border border-border bg-card px-4 py-3 text-sm transition-colors hover:border-[#5865F2]/50 hover:text-[#5865F2]"
          >
            <DiscordIcon className="h-5 w-5 shrink-0 text-[#5865F2]" />
            <span>{site.discord.url.replace("https://", "")}</span>
          </a>
        </section>

        <section>
          <h2 className="text-xl font-semibold">{t("aboutContribute")}</h2>
          <p className="mt-2 leading-relaxed text-muted">
            {t("aboutContributeIntro")}{" "}
            <a
              href={site.creator.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent hover:underline"
            >
              {handle}
            </a>
            . {t("aboutContributeOutro")}{" "}
            <Link href="/roadmap" className="text-accent hover:underline">
              {t("aboutRoadmapLink")}
            </Link>{" "}
            {t("aboutContributeEnd")}
          </p>
        </section>
      </div>
    </div>
  );
}