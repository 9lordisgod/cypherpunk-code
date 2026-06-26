"use client";

import { createContext, useCallback, useContext, useMemo } from "react";
import { t, type TranslationStrings } from "@/lib/i18n/translations";
import type { Locale } from "@/lib/i18n/types";

type LanguageContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: keyof TranslationStrings, vars?: Record<string, string | number>) => string;
  showPicker: boolean;
  openPicker: () => void;
  closePicker: () => void;
  confirmLocale: () => void;
  pickerDismissible: boolean;
};

const EN_LOCALE: Locale = "en";

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const translate = useCallback(
    (key: keyof TranslationStrings, vars?: Record<string, string | number>) =>
      t(EN_LOCALE, key, vars),
    []
  );

  const value = useMemo(
    () => ({
      locale: EN_LOCALE,
      setLocale: () => {},
      t: translate,
      showPicker: false,
      openPicker: () => {},
      closePicker: () => {},
      confirmLocale: () => {},
      pickerDismissible: true,
    }),
    [translate]
  );

  return (
    <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return ctx;
}