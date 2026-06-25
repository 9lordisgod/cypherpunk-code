import { CatalogPageContent } from "@/components/CatalogPageContent";
import { PreviewPageWrap } from "@/components/preview/PreviewPageWrap";
import { resources } from "@/lib/data";

export default function PreviewCatalogPage() {
  return (
    <PreviewPageWrap>
      <CatalogPageContent resources={resources} />
    </PreviewPageWrap>
  );
}