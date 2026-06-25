"use client";

import { useEffect } from "react";
import { PICKER_SEEN_KEY, STORAGE_KEY } from "@/lib/i18n/types";

export function PreviewChromeHider() {
  useEffect(() => {
    document.body.dataset.preview = "true";
    localStorage.setItem(STORAGE_KEY, "en");
    localStorage.setItem(PICKER_SEEN_KEY, "1");
    document.documentElement.lang = "en";
    window.dispatchEvent(new Event("cypherpunk-locale-change"));
    window.dispatchEvent(new Event("cypherpunk-picker-change"));

    return () => {
      delete document.body.dataset.preview;
    };
  }, []);

  return null;
}