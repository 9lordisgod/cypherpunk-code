import type { Metadata } from "next";
import { ScanFooter } from "@/scan/components/ScanFooter";
import { ScanHeader } from "@/scan/components/ScanHeader";
import "./scan-globals.css";

export const metadata: Metadata = {
  title: "CypherScan",
  description:
    "Live OSINT intel feed for conflict, geopolitics, cyber, and freedom-tech — beta on Cypherpunk Code.",
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