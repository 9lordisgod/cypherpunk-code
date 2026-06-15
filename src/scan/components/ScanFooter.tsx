import Link from "next/link";

export function ScanFooter() {
  return (
    <footer className="mt-12 border-t border-[var(--border-dim)] bg-[var(--bg-inset)]">
      <div className="mx-auto max-w-7xl px-4 py-8">
        <p className="tac-divider mb-4">- - - - - - - -</p>
        <h4 className="tac-label mb-2">Operational disclaimer</h4>
        <p className="max-w-2xl text-[11px] leading-relaxed text-[var(--text-dim)]">
          CypherScan is for informational and educational purposes only. OSINT
          aggregation does not imply verification. Cross-check all reports against
          primary sources before action. Beta testing — it might go wrong.
        </p>
        <p className="tac-mono mt-6 text-[9px] tracking-widest text-[var(--text-dim)] opacity-50">
          <Link href="/" className="hover:text-[var(--accent-orange)]">
            CYPHERPUNK CODE
          </Link>
          {" · "}
          CYPHER SCAN · OPEN SOURCE INTELLIGENCE
        </p>
      </div>
    </footer>
  );
}