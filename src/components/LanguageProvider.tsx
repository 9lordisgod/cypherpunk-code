"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
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

const LOCALE_CHANGE_EVENT = "cypherpunk-locale-change";
const PICKER_CHANGE_EVENT = "cypherpunk-picker-change";

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

function migrateLegacyLocale() {
  if (localStorage.getItem(STORAGE_KEY) === "zh-TW") {
    localStorage.setItem(STORAGE_KEY, "zh-CN");
  }
}

function subscribeLocale(onStoreChange: () => void) {
  if (typeof window === "undefined") return () => {};
  migrateLegacyLocale();
  const handler = () => onStoreChange();
  window.addEventListener("storage", handler);
  window.addEventListener(LOCALE_CHANGE_EVENT, handler);
  return () => {
    window.removeEventListener("storage", handler);
    window.removeEventListener(LOCALE_CHANGE_EVENT, handler);
  };
}

function getLocaleSnapshot(): Locale {
  return readStoredLocale() ?? "en";
}

function subscribePicker(onStoreChange: () => void) {
  if (typeof window === "undefined") return () => {};
  const handler = () => onStoreChange();
  window.addEventListener(PICKER_CHANGE_EVENT, handler);
  return () => window.removeEventListener(PICKER_CHANGE_EVENT, handler);
}

function getPickerSeenSnapshot(): boolean {
  return localStorage.getItem(PICKER_SEEN_KEY) === "1";
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const locale = useSyncExternalStore(
    subscribeLocale,
    getLocaleSnapshot,
    () => "en" as Locale
  );

  const pickerSeen = useSyncExternalStore(
    subscribePicker,
    getPickerSeenSnapshot,
    () => true
  );

  const [pickerOpen, setPickerOpen] = useState(false);

  useEffect(() => {
    document.documentElement.lang = localeToHtmlLang(locale);
  }, [locale]);

  const setLocale = useCallback((next: Locale) => {
    localStorage.setItem(STORAGE_KEY, next);
    document.documentElement.lang = localeToHtmlLang(next);
    window.dispatchEvent(new Event(LOCALE_CHANGE_EVENT));
  }, []);

  const openPicker = useCallback(() => setPickerOpen(true), []);
  const closePicker = useCallback(() => setPickerOpen(false), []);

  const confirmLocale = useCallback(() => {
    localStorage.setItem(PICKER_SEEN_KEY, "1");
    setPickerOpen(false);
    window.dispatchEvent(new Event(PICKER_CHANGE_EVENT));
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
      showPicker: pickerOpen || !pickerSeen,
      openPicker,
      closePicker,
      confirmLocale,
      localeLabels: LOCALE_LABELS,
    }),
    [
      locale,
      setLocale,
      translate,
      pickerOpen,
      pickerSeen,
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