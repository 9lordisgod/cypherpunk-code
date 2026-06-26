"use client";

import { useEffect } from "react";

export function PreviewChromeHider() {
  useEffect(() => {
    document.body.dataset.preview = "true";

    return () => {
      delete document.body.dataset.preview;
    };
  }, []);

  return null;
}