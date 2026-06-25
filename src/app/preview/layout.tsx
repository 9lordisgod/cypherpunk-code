import { Inter } from "next/font/google";
import { PreviewFooter } from "@/components/preview/PreviewFooter";
import { PreviewHeader } from "@/components/preview/PreviewHeader";
import { PreviewChromeHider } from "@/components/preview/PreviewChromeHider";
import { PreviewLinkRewriter } from "@/components/preview/PreviewLinkRewriter";
import { PreviewMotion } from "@/components/preview/PreviewMotion";
import { ParticleField } from "@/components/preview/ParticleField";
import "@/styles/preview-redesign.css";

const previewSans = Inter({
  variable: "--font-preview-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata = {
  title: "Design Preview — Cypherpunk Code",
  robots: { index: false, follow: false },
};

export default function PreviewLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className={`preview-theme ${previewSans.variable}`}>
      <PreviewChromeHider />
      <PreviewLinkRewriter />
      <PreviewMotion />
      <div className="preview-banner">
        <strong>Local preview</strong>
        <span>—</span>
        <span>White + orange redesign</span>
        <span>·</span>
        <a href="/">View current site →</a>
      </div>
      <ParticleField />
      <PreviewHeader />
      <main>{children}</main>
      <PreviewFooter />
    </div>
  );
}