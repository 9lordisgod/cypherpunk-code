import { HomeContentPreview } from "@/components/preview/HomeContentPreview";
import {
  getFeaturedResources,
  learningPaths,
  resources,
  site,
} from "@/lib/data";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata = buildPageMetadata({
  title: "cypherpunk code",
  description: site.description,
  path: "/",
  keywords: [
    "cypherpunk education",
    "monero learning",
    "privacy resources",
    "cryptography curriculum",
    "digital sovereignty",
  ],
});

export default function HomePage() {
  const featured = getFeaturedResources();

  return (
    <HomeContentPreview
      featured={featured}
      learningPaths={learningPaths}
      resourceCount={resources.length}
    />
  );
}