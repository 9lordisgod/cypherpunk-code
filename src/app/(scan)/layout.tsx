import type { Metadata } from "next";
import { ScanFooter } from "@/scan/components/ScanFooter";
import { ScanHeader } from "@/scan/components/ScanHeader";
import "./scan-globals.css";

export const metadata: Metadata = {
  title: "Cypherscan",
  description:
    "SITREP Scanner — Grok-powered situation analysis with live search. BYOK, session-only API keys.",
};

export default function ScanLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="scan-app flex min-h-full flex-col" data-scroll-behavior="smooth">
      <ScanHeader />
      <main className="flex-1">{children}</main>
      <ScanFooter />
    </div>
  );
}