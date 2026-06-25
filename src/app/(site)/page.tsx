import { HomeContentPreview } from "@/components/preview/HomeContentPreview";
import {
  getFeaturedResources,
  learningPaths,
  resources,
  site,
} from "@/lib/data";
import { buildPageMetadata } from "@/lib/seo/metadata";

const homeMetadata = buildPageMetadata({
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

export const metadata = {
  ...homeMetadata,
  title: { absolute: "cypherpunk code" },
};

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