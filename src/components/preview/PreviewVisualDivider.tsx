import {
  DividerEncryptionIllustration,
  DividerGridIllustration,
  DividerNodesIllustration,
  DividerSovereigntyIllustration,
} from "@/components/preview/illustrations/PreviewIllustrations";

const variants = {
  nodes: DividerNodesIllustration,
  grid: DividerGridIllustration,
  encryption: DividerEncryptionIllustration,
  sovereignty: DividerSovereigntyIllustration,
} as const;

type PreviewVisualDividerProps = {
  variant: keyof typeof variants;
};

export function PreviewVisualDivider({ variant }: PreviewVisualDividerProps) {
  const Illustration = variants[variant];

  return (
    <div className="preview-visual-divider preview-reveal" aria-hidden="true">
      <Illustration className="preview-visual-divider__art" />
    </div>
  );
}