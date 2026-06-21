import { PLAN_B_NETWORK_URL } from "@/lib/planb/constants";

type PoweredByPlanBProps = {
  className?: string;
};

export function PoweredByPlanB({ className = "" }: PoweredByPlanBProps) {
  return (
    <a
      href={PLAN_B_NETWORK_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={`powered-by-planb no-underline ${className}`}
      aria-label="Powered by Plan ₿ Network — opens planb.network"
    >
      <span className="powered-by-planb__pill">
        <span className="powered-by-planb__label">Powered by</span>
        <span className="powered-by-planb__brand">
          Plan <span className="powered-by-planb__btc">₿</span> Network
        </span>
      </span>
    </a>
  );
}