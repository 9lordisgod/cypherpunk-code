"use client";

import { useCallback } from "react";
import { useLanguage } from "@/components/LanguageProvider";
import type { Locale } from "./types";
import { getResourceTranslation } from "./resourceTranslations";

function translateDuration(duration: string, locale: Locale): string {
  if (locale === "en") return duration;

  const weekMatch = duration.match(/^(\d+(?:\.\d+)?)\s+weeks?$/i);
  if (weekMatch) {
    const n = weekMatch[1];
    if (locale === "zh-CN") return `${n} 周`;
    if (locale === "ja") return `${n}週間`;
    if (locale === "fr") return `${n} semaine${parseFloat(n) > 1 ? "s" : ""}`;
  }

  const hourMatch = duration.match(/^(\d+(?:\.\d+)?)\s+hours?$/i);
  if (hourMatch) {
    const n = hourMatch[1];
    if (locale === "zh-CN") return `${n} 小时`;
    if (locale === "ja") return `${n}時間`;
    if (locale === "fr") return `${n} heure${parseFloat(n) > 1 ? "s" : ""}`;
  }

  return duration;
}

function translateLanguage(language: string, locale: Locale): string {
  if (locale === "en") return language;
  if (language.toLowerCase() === "english") {
    if (locale === "zh-CN") return "英语";
    if (locale === "ja") return "英語";
    if (locale === "fr") return "Anglais";
  }
  return language;
}

export function useResourceText() {
  const { locale } = useLanguage();

  const getResourceTitle = useCallback(
    (id: string, fallback: string) => {
      const t = getResourceTranslation(locale, id);
      return t?.title ?? fallback;
    },
    [locale]
  );

  const getResourceDescription = useCallback(
    (id: string, fallback: string) => {
      const t = getResourceTranslation(locale, id);
      return t?.description ?? fallback;
    },
    [locale]
  );

  const getResourceProvider = useCallback(
    (id: string, fallback: string) => {
      const t = getResourceTranslation(locale, id);
      return t?.provider ?? fallback;
    },
    [locale]
  );

  const getResourceDuration = useCallback(
    (duration: string | undefined) => {
      if (!duration) return undefined;
      return translateDuration(duration, locale);
    },
    [locale]
  );

  const getResourceLanguage = useCallback(
    (language: string) => translateLanguage(language, locale),
    [locale]
  );

  const getSearchableText = useCallback(
    (id: string, resource: { title: string; description: string; provider: string }) => {
      const t = getResourceTranslation(locale, id);
      return [
        resource.title,
        resource.description,
        resource.provider,
        t?.title,
        t?.description,
        t?.provider,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
    },
    [locale]
  );

  return {
    getResourceTitle,
    getResourceDescription,
    getResourceProvider,
    getResourceDuration,
    getResourceLanguage,
    getSearchableText,
    locale,
  };
}