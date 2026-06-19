import { CatalogPageContent } from "@/components/CatalogPageContent";
import { resources } from "@/lib/data";

export const metadata = {
  title: "Catalog",
};

export default function CatalogPage() {
  return <CatalogPageContent resources={resources} />;
}