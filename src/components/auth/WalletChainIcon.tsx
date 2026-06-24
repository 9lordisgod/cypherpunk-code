import { chainBrandAssets } from "@/lib/wallet/brand-assets";

export function SolanaIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={chainBrandAssets.solana}
      alt=""
      className={className}
      aria-hidden="true"
    />
  );
}