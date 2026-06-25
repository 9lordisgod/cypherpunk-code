import { CatalogPageContent } from "@/components/CatalogPageContent";
import { PreviewPageWrap } from "@/components/preview/PreviewPageWrap";
import { resources } from "@/lib/data";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { getTopicSeo, isTopicSlug } from "@/lib/seo/topics";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ topic?: string }>;
}) {
  const { topic } = await searchParams;

  if (topic && isTopicSlug(topic)) {
    const seo = getTopicSeo(topic)!;
    return buildPageMetadata({
      title: seo.title,
      description: seo.description,
      path: `/topics/${topic}`,
      keywords: seo.keywords,
    });
  }

  return buildPageMetadata({
    title: "Resource Catalog",
    description: `Search and filter ${resources.length} curated crypto encyclopedia resources — the database of the crypto world for Bitcoin, Monero, privacy, and cypherpunk education.`,
    path: "/catalog",
    keywords: [
      "crypto resource catalog",
      "bitcoin learning resources",
      "privacy tools list",
      "cypherpunk archive",
    ],
  });
}

export default function CatalogPage() {
  return (
    <PreviewPageWrap>
      <CatalogPageContent resources={resources} />
    </PreviewPageWrap>
  );
}