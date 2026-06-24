import { AboutContent } from "@/components/AboutContent";
import { site } from "@/lib/data";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata = buildPageMetadata({
  title: "About",
  description: `${site.name} is a curated freedom education index for Bitcoin, Monero, privacy technology, and cypherpunk philosophy — maintained by @${site.creator.handle}.`,
  path: "/about",
  keywords: [
    "cypherpunk code",
    "freedom education",
    "bitcoin monero education",
    "privacy learning platform",
  ],
});

export default function AboutPage() {
  return <AboutContent />;
}