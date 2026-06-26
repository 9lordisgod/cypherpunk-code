"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { ArchiveNotice } from "@/components/ArchiveNotice";
import { useLanguage } from "@/components/LanguageProvider";
import { resources, site } from "@/lib/data";

export function AboutContent() {
  const { t } = useLanguage();
  const freeCount = resources.filter((r) => r.pricing === "free").length;
  const creatorHandle = `@${site.creator.handle}`;
  const contactHandle = `@${site.contact.x.handle}`;

  useEffect(() => {
    document.title = `${t("navAbout")} · ${site.name}`;
  }, [t]);

  return (
    <div className="about-page">
      <div className="about-page-visual" aria-hidden="true">
        <Image
          src="/about-bg.jpg"
          alt=""
          fill
          priority
          className="about-page-img"
          sizes="100vw"
        />
        <div className="about-page-glow" />
        <div className="about-page-scrim" />
      </div>
      <div className="about-page-content page-content page-content--narrow">
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
              {t("aboutArchiveMission2", { handle: contactHandle })}
            </p>
          </section>

          <section id="openness">
            <h2 className="text-xl font-semibold">{t("aboutOpennessTitle")}</h2>
            <p className="mt-2 leading-relaxed text-muted">{t("aboutOpennessLead")}</p>
            <p className="mt-3 leading-relaxed text-muted">{t("aboutOpennessDataFirst")}</p>
            <p className="mt-3 leading-relaxed text-muted">{t("aboutOpennessCodeSecond")}</p>
            <p className="mt-3">
              <Link href="/doc/doc/openness-policy.html" className="text-accent hover:underline">
                {t("aboutOpennessLink")} →
              </Link>
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold">{t("aboutWhatIsThis")}</h2>
            <p className="mt-2 leading-relaxed text-muted">{t("aboutWhatIsThisText")}</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold">{t("aboutWhoBuilt")}</h2>
            <p className="mt-2 leading-relaxed text-muted">
              {t("aboutWhoBuiltText", { handle: creatorHandle })}
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
            <div className="mt-4 space-y-4 rounded-lg border border-border bg-card/90 p-6 backdrop-blur-sm">
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

          <section id="contact">
            <h2 className="text-xl font-semibold">{t("aboutContactUs")}</h2>
            <p className="mt-2 leading-relaxed text-muted">{t("aboutContactUsText")}</p>
            <p className="mt-3">
              <a
                href={site.contact.x.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent hover:underline"
              >
                {contactHandle}
              </a>
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold">{t("aboutContribute")}</h2>
            <p className="mt-2 leading-relaxed text-muted">
              {t("aboutContributeIntro")}{" "}
              <a
                href={site.contact.x.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent hover:underline"
              >
                {contactHandle}
              </a>
              . {t("aboutContributeOutro")}{" "}
              <Link href="/doc/doc/roadmap.html" className="text-accent hover:underline">
                {t("aboutRoadmapLink")}
              </Link>{" "}
              {t("aboutContributeEnd")}
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}