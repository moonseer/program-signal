import Link from "next/link";
import { pageMetadata } from "@/lib/page-metadata";


export const metadata = pageMetadata({
  title: 'Sponsorship Policy',
  description:
    'Editorial conclusions cannot be purchased. No paid sponsorships on Vercel Hobby.',
  path: '/sponsorship-policy',
});

export default function SponsorshipPolicyPage() {
  return (
    <div className="mx-auto max-w-[46rem] px-6 py-12">
      <h1 className="font-[family-name:var(--font-display)] text-4xl tracking-[-0.03em]">
        Sponsorship Policy
      </h1>
      <div className="prose-signal mt-8">
        <p>Editorial conclusions cannot be purchased.</p>

        <h2>Current posture</h2>
        <p>
          Platform Signal runs on Vercel Hobby. Hobby hosting does not allow
          commercial use for paid sponsorships or affiliates. Until the site is
          on a commercial-capable host and legal review is complete, there are{" "}
          <strong>no paid sponsorships</strong>, <strong>no affiliate programs</strong>,
          and <strong>no sold rankings</strong>.
        </p>

        <h2>Non-negotiables</h2>
        <ul>
          <li>No sold rankings or paid “best of” placements</li>
          <li>No hidden native ads</li>
          <li>No vendor-written “independent” analysis</li>
          <li>No paying for a conclusion, PASS, or softened risk language</li>
          <li>
            Frontmatter <code>sponsorship</code> fields must match reality
          </li>
        </ul>

        <h2>Vendor access</h2>
        <p>
          Briefings, demos, and evaluation licenses are not sponsorship. They
          follow the{" "}
          <Link href="/vendor-interaction-policy">vendor interaction policy</Link>
          . Disclose material access when it could affect a reader’s view of
          independence.
        </p>

        <p>
          Full policy:{" "}
          <code>docs/editorial/SPONSORSHIP-POLICY.md</code>. Monetization
          principles (policy only):{" "}
          <code>docs/editorial/MONETIZATION-PRINCIPLES.md</code>.
        </p>
      </div>
    </div>
  );
}
