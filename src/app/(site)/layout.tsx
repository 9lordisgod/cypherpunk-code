import { Inter, Noto_Sans_JP, Noto_Sans_SC } from "next/font/google";
import { PreviewChromeHider } from "@/components/preview/PreviewChromeHider";
import { PreviewFooter } from "@/components/preview/PreviewFooter";
import { PreviewHeader } from "@/components/preview/PreviewHeader";
import { PreviewAmbient } from "@/components/preview/PreviewAmbient";
import { PreviewMotion } from "@/components/preview/PreviewMotion";
import { ParticleField } from "@/components/preview/ParticleField";
import "@/styles/preview-redesign.css";

const siteLatin = Inter({
  variable: "--font-latin",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const siteCjkSc = Noto_Sans_SC({
  variable: "--font-cjk-sc",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  preload: false,
});

const siteCjkJa = Noto_Sans_JP({
  variable: "--font-cjk-ja",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  preload: false,
});

export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div
      className={`preview-theme ${siteLatin.variable} ${siteCjkSc.variable} ${siteCjkJa.variable}`}
    >
      <PreviewChromeHider />
      <PreviewAmbient />
      <PreviewMotion />
      <ParticleField />
      <PreviewHeader />
      <main className="flex-1">{children}</main>
      <PreviewFooter />
    </div>
  );
}