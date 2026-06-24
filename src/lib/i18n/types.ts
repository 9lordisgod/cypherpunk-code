export type Locale = "en" | "zh-CN" | "ja" | "fr";

export type TranslationKey = keyof (typeof import("./translations").translations)["en"];

export const LOCALES: Locale[] = ["en", "zh-CN", "ja", "fr"];

export const LOCALE_LABELS: Record<
  Locale,
  { native: string; english: string; flag: string }
> = {
  en: { native: "English", english: "English", flag: "🇬🇧" },
  "zh-CN": { native: "简体中文", english: "Chinese (Simplified)", flag: "🇨🇳" },
  ja: { native: "日本語", english: "Japanese", flag: "🇯🇵" },
  fr: { native: "Français", english: "French", flag: "🇫🇷" },
};

export const STORAGE_KEY = "cypherpunk-code-locale";
export const PICKER_SEEN_KEY = "cypherpunk-code-lang-picker-seen";