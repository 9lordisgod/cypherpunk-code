"use client";

import { useCallback } from "react";
import { useLanguage } from "@/components/LanguageProvider";
import { getPathDescKey, getPathTitleKey } from "./pathTranslations";
import type { TranslationStrings } from "./translations";

export function usePathText() {
  const { t } = useLanguage();

  const getPathTitle = useCallback(
    (pathId: string, fallback: string) => {
      const key = getPathTitleKey(pathId);
      return key ? t(key) : fallback;
    },
    [t]
  );

  const getPathDescription = useCallback(
    (pathId: string, fallback: string) => {
      const key = getPathDescKey(pathId);
      return key ? t(key) : fallback;
    },
    [t]
  );

  return { getPathTitle, getPathDescription, t };
}

export type { TranslationStrings };