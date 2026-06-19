"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  LOCALE_LABELS,
  PICKER_SEEN_KEY,
  STORAGE_KEY,
  type Locale,
} from "@/lib/i18n/types";
import { t, type TranslationStrings } from "@/lib/i18n/translations";

type LanguageContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: keyof TranslationStrings, vars?: Record<string, string | number>) => string;
  showPicker: boolean;
  openPicker: () => void;
  closePicker: () => void;
  confirmLocale: () => void;
  localeLabels: typeof LOCALE_LABELS;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

function localeToHtmlLang(locale: Locale): string {
  if (locale === "zh-CN") return "zh-Hans";
  return locale;
}

function readStoredLocale(): Locale | null {
  if (typeof window === "undefined") return null;
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === "zh-TW") return "zh-CN";
  if (stored === "en" || stored === "zh-CN" || stored === "ja" || stored === "fr") {
    return stored;
  }
  return null;
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en");
  const [showPicker, setShowPicker] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const stored = readStoredLocale();
    const seen = localStorage.getItem(PICKER_SEEN_KEY);
    if (stored) {
      setLocaleState(stored);
      document.documentElement.lang = localeToHtmlLang(stored);
      if (localStorage.getItem(STORAGE_KEY) === "zh-TW") {
        localStorage.setItem(STORAGE_KEY, "zh-CN");
      }
    }
    if (!seen) {
      setShowPicker(true);
    }
    setHydrated(true);
  }, []);

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    localStorage.setItem(STORAGE_KEY, next);
    document.documentElement.lang = localeToHtmlLang(next);
  }, []);

  const openPicker = useCallback(() => setShowPicker(true), []);
  const closePicker = useCallback(() => setShowPicker(false), []);

  const confirmLocale = useCallback(() => {
    localStorage.setItem(PICKER_SEEN_KEY, "1");
    setShowPicker(false);
  }, []);

  const translate = useCallback(
    (key: keyof TranslationStrings, vars?: Record<string, string | number>) =>
      t(locale, key, vars),
    [locale]
  );

  const value = useMemo(
    () => ({
      locale,
      setLocale,
      t: translate,
      showPicker: hydrated && showPicker,
      openPicker,
      closePicker,
      confirmLocale,
      localeLabels: LOCALE_LABELS,
    }),
    [
      locale,
      setLocale,
      translate,
      hydrated,
      showPicker,
      openPicker,
      closePicker,
      confirmLocale,
    ]
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