"use client";

import type { Session } from "next-auth";
import { Suspense } from "react";
import { AuthSessionProvider } from "@/components/auth/SessionProvider";
import { AnalyticsBeacon } from "@/components/AnalyticsBeacon";
import { FeedbackFloater } from "@/components/FeedbackFloater";
import { LanguageProvider } from "@/components/LanguageProvider";

export function Providers({
  children,
  session,
}: {
  children: React.ReactNode;
  session?: Session | null;
}) {
  return (
    <AuthSessionProvider session={session}>
      <LanguageProvider>
        <Suspense fallback={null}>
          <AnalyticsBeacon />
        </Suspense>
        {children}
        <FeedbackFloater />
      </LanguageProvider>
    </AuthSessionProvider>
  );
}