import { notFound } from "next/navigation";
import { PreviewPageWrap } from "@/components/preview/PreviewPageWrap";
import { ResourceDetail } from "@/components/ResourceDetail";
import { JsonLd } from "@/components/seo/JsonLd";
import { getResourceById, resources } from "@/lib/data";
import {
  buildBreadcrumbJsonLd,
  buildLearningResourceJsonLd,
} from "@/lib/seo/json-ld";
import { buildPageMetadata } from "@/lib/seo/metadata";

export function generateStaticParams() {
  return resources.map((r) => ({ id: r.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const resource = getResourceById(id);
  if (!resource) return { title: "Not Found" };

  return buildPageMetadata({
    title: resource.title,
    description: resource.description,
    path: `/resource/${resource.id}`,
    ogType: "article",
    keywords: [
      resource.title,
      ...resource.topics,
      ...resource.tags,
      resource.type,
      "cypherpunk education",
    ],
  });
}

export default async function ResourcePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const resource = getResourceById(id);
  if (!resource) notFound();

  return (
    <>
      <JsonLd
        data={[
          buildLearningResourceJsonLd(resource),
          buildBreadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Catalog", path: "/catalog" },
            { name: resource.title, path: `/resource/${resource.id}` },
          ]),
        ]}
      />
      <PreviewPageWrap>
        <ResourceDetail resource={resource} />
      </PreviewPageWrap>
    </>
  );
}