"use client";

import { useMemo } from "react";
import { useLanguage } from "@/components/LanguageProvider";
import type { Difficulty, Pricing, ResourceType, Topic } from "@/lib/types";

export function useTranslatedLabels() {
  const { t } = useLanguage();

  return useMemo(() => {
    const topicLabels: Record<Topic, string> = {
      bitcoin: t("topicBitcoin"),
      monero: t("topicMonero"),
      privacy: t("topicPrivacy"),
      cryptography: t("topicCryptography"),
      opsec: t("topicOpsec"),
      cypherpunk: t("topicCypherpunk"),
      lightning: t("topicLightning"),
      mining: t("topicMining"),
      nodes: t("topicNodes"),
      wallets: t("topicWallets"),
      "general-crypto": t("topicGeneralCrypto"),
    };

    const typeLabels: Record<ResourceType, string> = {
      course: t("typeCourse"),
      book: t("typeBook"),
      paper: t("typePaper"),
      guide: t("typeGuide"),
      wiki: t("typeWiki"),
      video: t("typeVideo"),
      documentation: t("typeDocumentation"),
      manifesto: t("typeManifesto"),
      event: t("typeEvent"),
      podcast: t("typePodcast"),
      tool: t("typeTool"),
    };

    const difficultyLabels: Record<Difficulty, string> = {
      beginner: t("difficultyBeginner"),
      intermediate: t("difficultyIntermediate"),
      advanced: t("difficultyAdvanced"),
    };

    const pricingLabels: Record<Pricing, string> = {
      free: t("pricingFree"),
      paid: t("pricingPaid"),
      freemium: t("pricingFreemium"),
    };

    return { topicLabels, typeLabels, difficultyLabels, pricingLabels };
  }, [t]);
}