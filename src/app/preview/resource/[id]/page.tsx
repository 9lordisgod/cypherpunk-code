import { notFound } from "next/navigation";
import { PreviewPageWrap } from "@/components/preview/PreviewPageWrap";
import { ResourceDetail } from "@/components/ResourceDetail";
import { getResourceById, resources } from "@/lib/data";

export function generateStaticParams() {
  return resources.map((r) => ({ id: r.id }));
}

export default async function PreviewResourcePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const resource = getResourceById(id);
  if (!resource) notFound();

  return (
    <PreviewPageWrap>
      <ResourceDetail resource={resource} />
    </PreviewPageWrap>
  );
}