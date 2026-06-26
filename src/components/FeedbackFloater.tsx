"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { FeedbackBox } from "@/components/FeedbackBox";
import { useLanguage } from "@/components/LanguageProvider";

function subscribeNoop() {
  return () => {};
}

function getClientSnapshot() {
  return true;
}

function getServerSnapshot() {
  return false;
}

export function FeedbackFloater() {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  const mounted = useSyncExternalStore(subscribeNoop, getClientSnapshot, getServerSnapshot);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  if (!mounted) return null;

  return createPortal(
    <div
      className={`feedback-floater${open ? " feedback-floater--open" : ""}`}
      aria-live="polite"
    >
      {open ? (
        <div
          className="feedback-floater__panel pixel-panel"
          role="dialog"
          aria-modal="false"
          aria-label={t("feedbackTitle")}
        >
          <button
            type="button"
            className="feedback-floater__close"
            onClick={() => setOpen(false)}
            aria-label={t("feedbackClose")}
          >
            ×
          </button>
          <FeedbackBox />
        </div>
      ) : null}

      {!open ? (
        <button
          type="button"
          className="feedback-floater__trigger"
          onClick={() => setOpen(true)}
          aria-label={t("feedbackOpen")}
          aria-expanded={open}
        >
          <span className="feedback-floater__trigger-pulse" aria-hidden="true" />
          <span className="feedback-floater__trigger-label">?</span>
        </button>
      ) : null}
    </div>,
    document.body
  );
}