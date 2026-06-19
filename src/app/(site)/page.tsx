import { HomeContent } from "@/components/HomeContent";
import {
  getFeaturedResources,
  getTopicCounts,
  getTypeCounts,
  learningPaths,
  resources,
  site,
} from "@/lib/data";

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