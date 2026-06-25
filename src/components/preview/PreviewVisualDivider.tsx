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
      <div className="preview-visual-divider__frame">
        <div className="preview-visual-divider__scan" />
        <div className="preview-visual-divider__flow" />
        <div className="preview-visual-divider__glow" />
        <Illustration className="preview-visual-divider__art" />
      </div>
    </div>
  );
}