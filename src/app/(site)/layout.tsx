import { Inter } from "next/font/google";
import { PreviewChromeHider } from "@/components/preview/PreviewChromeHider";
import { PreviewFooter } from "@/components/preview/PreviewFooter";
import { PreviewHeader } from "@/components/preview/PreviewHeader";
import { PreviewMotion } from "@/components/preview/PreviewMotion";
import { ParticleField } from "@/components/preview/ParticleField";
import "@/styles/preview-redesign.css";

const siteSans = Inter({
  variable: "--font-preview-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className={`preview-theme ${siteSans.variable}`}>
      <PreviewChromeHider />
      <PreviewMotion />
      <ParticleField />
      <PreviewHeader />
      <main className="flex-1">{children}</main>
      <PreviewFooter />
    </div>
  );
}