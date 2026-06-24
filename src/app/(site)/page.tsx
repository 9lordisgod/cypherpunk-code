import { HomeContent } from "@/components/HomeContent";
import {
  getFeaturedResources,
  getTopicCounts,
  getTypeCounts,
  learningPaths,
  resources,
  site,
} from "@/lib/data";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata = buildPageMetadata({
  title: site.tagline,
  description: site.description,
  path: "/",
  keywords: [
    "cypherpunk education",
    "bitcoin course free",
    "monero learning",
    "privacy resources",
    "cryptography curriculum",
  ],
});

export default function HomePage() {
  const featured = getFeaturedResources();
  const topicCounts = getTopicCounts();
  const typeCounts = getTypeCounts();
  const freeCount = resources.filter((r) => r.pricing === "free").length;

  return (
    <HomeContent
      featured={featured}
      topicCounts={topicCounts}
      typeCounts={typeCounts}
      learningPaths={learningPaths}
      resourceCount={resources.length}
      freeCount={freeCount}
      creatorHandle={site.creator.handle}
      creatorUrl={site.creator.url}
    />
  );
}