import { PathsContent } from "@/components/PathsContent";
import { PreviewPageWrap } from "@/components/preview/PreviewPageWrap";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata = buildPageMetadata({
  title: "Learning Paths",
  description:
    "Curated learning paths for cypherpunk education — from philosophy and Bitcoin sovereignty to Monero privacy and practical OpSec.",
  path: "/paths",
  keywords: [
    "cypherpunk learning path",
    "bitcoin learning path",
    "monero learning path",
    "privacy curriculum",
  ],
});

export default function PathsPage() {
  return (
    <PreviewPageWrap>
      <PathsContent />
    </PreviewPageWrap>
  );
}