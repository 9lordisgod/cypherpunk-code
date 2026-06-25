import { HomeContentPreview } from "@/components/preview/HomeContentPreview";
import {
  getFeaturedResources,
  learningPaths,
  resources,
  site,
} from "@/lib/data";
import { buildPageMetadata } from "@/lib/seo/metadata";

const homeMetadata = buildPageMetadata({
  title: "cypherpunk education · crypto wikipedia",
  description: site.description,
  path: "/",
  keywords: [
    "crypto wikipedia",
    "cypherpunk education",
    "cryptocurrency database",
    "bitcoin education",
    "privacy resources",
    "crypto industry encyclopedia",
  ],
});

export const metadata = {
  ...homeMetadata,
  title: { absolute: "cypherpunk education · crypto wikipedia" },
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