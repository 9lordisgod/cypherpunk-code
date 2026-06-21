"use client";

import { useSession } from "next-auth/react";
import { useState } from "react";
import { useLanguage } from "@/components/LanguageProvider";

export function FeedbackBox() {
  const { data: session } = useSession();
  const { t } = useLanguage();
  const [name, setName] = useState(session?.user?.name ?? "");
  const [email, setEmail] = useState(session?.user?.email ?? "");
  const [xHandle, setXHandle] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setStatus("sending");
    try {
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, xHandle, message }),
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
      {status === "sent" ? (
        <p className="text-sm" style={{ color: "var(--accent)" }}>
          {t("feedbackThanks")}
        </p>
      ) : null}
      {status === "error" ? (
        <p className="text-sm text-red-400">{t("feedbackError")}</p>
      ) : null}
    </form>
  );
}