"use client";

import { LanguagePicker } from "@/components/LanguagePicker";
import { LanguageProvider } from "@/components/LanguageProvider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <LanguageProvider>
      <LanguagePicker />
      {children}
    </LanguageProvider>
  );
}