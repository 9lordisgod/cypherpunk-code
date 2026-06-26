import { notFound } from "next/navigation";
import { PreviewPageWrap } from "@/components/preview/PreviewPageWrap";
import { TopicPageContent } from "@/components/TopicPageContent";
import { JsonLd } from "@/components/seo/JsonLd";
import { resources } from "@/lib/data";
import { buildBreadcrumbJsonLd } from "@/lib/seo/json-ld";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { ALL_TOPICS, getTopicSeo } from "@/lib/seo/topics";
import type { Topic } from "@/lib/types";

export function generateStaticParams() {
  return ALL_TOPICS.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const seo = getTopicSeo(slug);
  if (!seo) {
    return { title: "Not Found" };
  }

  return buildPageMetadata({
    title: seo.title,
    description: seo.description,
    path: `/topics/${seo.slug}`,
    keywords: seo.keywords,
  });
}

export default async function TopicPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const seo = getTopicSeo(slug);
  if (!seo) {
    notFound();
  }

  const topic = seo.slug as Topic;
  const topicResources = resources.filter((resource) =>
    resource.topics.includes(topic)
  );

  return (
    <>
      <JsonLd
        data={buildBreadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Catalog", path: "/catalog" },
          { name: seo.label, path: `/topics/${seo.slug}` },
        ])}
      />
      <PreviewPageWrap>
        <TopicPageContent topic={topic} seo={seo} resources={topicResources} />
      </PreviewPageWrap>
    </>
  );
}