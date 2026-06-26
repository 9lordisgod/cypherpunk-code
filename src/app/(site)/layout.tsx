import { Inter } from "next/font/google";
import { PreviewChromeHider } from "@/components/preview/PreviewChromeHider";
import { PreviewFooter } from "@/components/preview/PreviewFooter";
import { PreviewHeader } from "@/components/preview/PreviewHeader";
import { PreviewAmbient } from "@/components/preview/PreviewAmbient";
import { PreviewMotion } from "@/components/preview/PreviewMotion";
import "@/styles/preview-redesign.css";

const siteSans = Inter({
  variable: "--font-latin",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className={`preview-theme ${siteSans.variable}`}>
      <PreviewChromeHider />
      <PreviewAmbient />
      <PreviewMotion />
      <PreviewHeader />
      <main className="flex-1">{children}</main>
      <PreviewFooter />
    </div>
  );
}