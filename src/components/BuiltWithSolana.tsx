import { chainBrandAssets } from "@/lib/wallet/brand-assets";

const SOLANA_URL = "https://solana.com";

type BuiltWithSolanaProps = {
  className?: string;
};

export function BuiltWithSolana({ className = "" }: BuiltWithSolanaProps) {
  return (
    <a
      href={SOLANA_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={`built-with-solana no-underline ${className}`}
      aria-label="Built with Solana — opens solana.com"
    >
      <span className="built-with-solana__box">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={chainBrandAssets.solana}
          alt=""
          className="built-with-solana__logo"
          aria-hidden="true"
        />
        <span className="built-with-solana__text">Built with Solana</span>
      </span>
    </a>
  );
}