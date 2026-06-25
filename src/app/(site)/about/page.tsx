import { AboutContent } from "@/components/AboutContent";
import { PreviewPageWrap } from "@/components/preview/PreviewPageWrap";
import { site } from "@/lib/data";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata = buildPageMetadata({
  title: "About",
  description: `${site.name} is a database of the crypto world and the Wikipedia of the crypto industry — maintained by @${site.creator.handle}.`,
  path: "/about",
  keywords: [
    "crypto wikipedia",
    "cypherpunk education",
    "cryptocurrency database",
    "bitcoin monero education",
    "crypto industry encyclopedia",
  ],
});

export default function AboutPage() {
  return (
    <PreviewPageWrap>
      <AboutContent />
    </PreviewPageWrap>
  );
}