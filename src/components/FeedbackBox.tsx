"use client";

import { useState } from "react";
import { useLanguage } from "@/components/LanguageProvider";
import { HONEYPOT_FIELD } from "@/lib/security/constants";

export function FeedbackBox() {
  const { t } = useLanguage();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [xHandle, setXHandle] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setStatus("sending");
    try {
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          xHandle,
          message,
          [HONEYPOT_FIELD]: honeypot,
        }),
      });
      if (!response.ok) throw new Error("Failed");
      setStatus("sent");
      setMessage("");
    } catch {
      setStatus("error");
    }
  };

  return (
    <form onSubmit={submit} className="feedback-form space-y-4">
      <div>
        <h2 className="text-lg font-semibold">{t("feedbackTitle")}</h2>
        <p className="mt-1 text-sm text-muted">{t("feedbackSubtitle")}</p>
      </div>
      <input
        type="text"
        name={HONEYPOT_FIELD}
        value={honeypot}
        onChange={(e) => setHoneypot(e.target.value)}
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute -left-[9999px] h-0 w-0 opacity-0"
      />
      <label className="block text-sm">
        <span className="text-muted">{t("feedbackName")}</span>
        <input
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="auth-input mt-1 w-full"
        />
      </label>
      <label className="block text-sm">
        <span className="text-muted">{t("feedbackEmail")}</span>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="auth-input mt-1 w-full"
        />
      </label>
      <label className="block text-sm">
        <span className="text-muted">{t("feedbackX")}</span>
        <input
          type="text"
          value={xHandle}
          onChange={(e) => setXHandle(e.target.value)}
          className="auth-input mt-1 w-full"
          placeholder="@handle"
        />
      </label>
      <label className="block text-sm">
        <span className="text-muted">{t("feedbackMessage")}</span>
        <textarea
          required
          rows={4}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="auth-input mt-1 w-full resize-y"
        />
      </label>
      <button
        type="submit"
        disabled={status === "sending"}
        className="pixel-btn pixel-btn--accent text-sm disabled:opacity-60"
      >
        {status === "sending" ? t("feedbackSending") : t("feedbackSubmit")}
      </button>
      <p aria-live="polite" className="min-h-[1.25rem]">
        {status === "sent" ? (
          <span className="text-sm" style={{ color: "var(--accent)" }}>
            {t("feedbackThanks")}
          </span>
        ) : null}
        {status === "error" ? (
          <span className="text-sm text-red-400">{t("feedbackError")}</span>
        ) : null}
      </p>
    </form>
  );
}