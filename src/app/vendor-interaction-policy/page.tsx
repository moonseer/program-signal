import Link from "next/link";

export const metadata = {
  title: "Vendor Interaction Policy",
  description:
    "Vendors are sources, not clients. Factual checks are allowed; editorial approval is not.",
};

export default function VendorInteractionPolicyPage() {
  return (
    <div className="mx-auto max-w-[46rem] px-6 py-12">
      <h1 className="font-[family-name:var(--font-display)] text-4xl tracking-[-0.03em]">
        Vendor Interaction Policy
      </h1>
      <div className="prose-signal mt-8">
        <p>Vendors are sources, not clients.</p>

        <h2>Allowed with disclosure when material</h2>
        <ul>
          <li>Briefings and demos</li>
          <li>Time-limited evaluation licenses</li>
          <li>Official docs and maintainer interviews</li>
          <li>Post-publication factual clarification</li>
        </ul>

        <h2>Forbidden</h2>
        <ul>
          <li>Promised coverage, tone, or conclusion</li>
          <li>Full pre-publication editorial approval</li>
          <li>Paying for a recommendation</li>
          <li>Material gifts intended to influence coverage</li>
          <li>Vendor-authored “independent” analysis</li>
        </ul>

        <h2>Factual check vs editorial review</h2>
        <p>
          Vendors may help confirm versions, command names, and quoted docs.
          They do not approve thesis, framing, risk language, or whether to
          publish.
        </p>

        <p>
          Related:{" "}
          <Link href="/sponsorship-policy">Sponsorship policy</Link>
          {" · "}
          <Link href="/corrections">Corrections</Link>
        </p>
        <p>
          Full policy:{" "}
          <code>docs/editorial/VENDOR-INTERACTION-POLICY.md</code>.
        </p>
      </div>
    </div>
  );
}
