import { HomeContentPreview } from "@/components/preview/HomeContentPreview";
import { getFeaturedResources, learningPaths, resources } from "@/lib/data";

export default function PreviewHomePage() {
  const featured = getFeaturedResources();

  return (
    <HomeContentPreview
      featured={featured}
      learningPaths={learningPaths}
      resourceCount={resources.length}
    />
  );
}