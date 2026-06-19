"use client";

import { useEffect, useState } from "react";
import { useLanguage } from "@/components/LanguageProvider";
import { SiteLogo } from "@/components/SiteLogo";
import { LOCALES, type Locale } from "@/lib/i18n/types";

export function LanguagePicker() {
  const {
    showPicker,
    locale,
    setLocale,
    confirmLocale,
    closePicker,
    pickerDismissible,
    t,
    localeLabels,
  } = useLanguage();
  const [bouncing, setBouncing] = useState<Locale | null>(null);

  useEffect(() => {
    if (!showPicker || !pickerDismissible) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closePicker();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [showPicker, pickerDismissible, closePicker]);

  if (!showPicker) return null;

  const handleSelect = (code: Locale) => {
    setLocale(code);
    setBouncing(code);
    window.setTimeout(() => setBouncing(null), 400);
  };

  const handleOverlayClick = () => {
    if (pickerDismissible) closePicker();
  };

  return (
    <div
      className="lang-picker-overlay"
      role="dialog"
      aria-modal="true"
      aria-label={t("langPickerTitle")}
      onClick={handleOverlayClick}
    >
      <div className="lang-picker-stars" aria-hidden="true" />
      <div
        className="lang-picker-card pixel-panel"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="lang-picker-header">
          <SiteLogo size="lg" className="lang-picker-logo" />
          <div>
            <h2 className="lang-picker-title">{t("langPickerTitle")}</h2>
            <p className="lang-picker-subtitle">{t("langPickerSubtitle")}</p>
          </div>
        </div>

        <div className="lang-picker-grid">
          {LOCALES.map((code) => {
            const { native, english, flag } = localeLabels[code];
            const isSelected = locale === code;
            const isBouncing = bouncing === code;
            return (
              <button
                key={code}
                type="button"
                onClick={() => handleSelect(code)}
                className={`lang-option pixel-btn ${isSelected ? "lang-option--selected" : ""} ${isBouncing ? "lang-option--bounce" : ""}`}
                aria-pressed={isSelected}
              >
                <span className="lang-option-flag" aria-hidden="true">
                  {flag}
                </span>
                <span className="lang-option-native">{native}</span>
                <span className="lang-option-english">{english}</span>
                {isSelected && (
                  <span className="lang-option-check" aria-hidden="true">
                    ✓
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={confirmLocale}
          className="lang-picker-continue pixel-btn pixel-btn--primary"
        >
          {t("langPickerContinue")} →
        </button>

        <p className="lang-picker-made-in">{t("langPickerMadeIn")}</p>
      </div>
    </div>
  );
}