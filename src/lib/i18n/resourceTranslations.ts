import type { Locale } from "./types";
import resourcesFr from "@/data/i18n/resources.fr.json";
import resourcesJa from "@/data/i18n/resources.ja.json";
import resourcesZhCN from "@/data/i18n/resources.zh-CN.json";

export type ResourceTranslation = {
  title: string;
  description: string;
  provider?: string;
};

type ResourceTranslationMap = Record<string, ResourceTranslation>;

const maps: Record<Exclude<Locale, "en">, ResourceTranslationMap> = {
  "zh-CN": resourcesZhCN,
  ja: resourcesJa,
  fr: resourcesFr,
};

export function getResourceTranslation(
  locale: Locale,
  id: string
): ResourceTranslation | undefined {
  if (locale === "en") return undefined;
  return maps[locale][id];
}