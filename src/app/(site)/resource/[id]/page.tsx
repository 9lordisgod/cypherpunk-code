import { notFound } from "next/navigation";
import { ResourceDetail } from "@/components/ResourceDetail";
import { getResourceById, resources } from "@/lib/data";

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
  return {
    title: resource.title,
    description: resource.description,
  };
}

export default async function ResourcePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const resource = getResourceById(id);
  if (!resource) notFound();

  return <ResourceDetail resource={resource} />;
}