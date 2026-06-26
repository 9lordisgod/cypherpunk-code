"use client";

import { Suspense } from "react";
import { AnalyticsBeacon } from "@/components/AnalyticsBeacon";
import { FeedbackFloater } from "@/components/FeedbackFloater";
import { LanguageProvider } from "@/components/LanguageProvider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <LanguageProvider>
      <Suspense fallback={null}>
        <AnalyticsBeacon />
      </Suspense>
      {children}
      <FeedbackFloater />
    </LanguageProvider>
  );
}