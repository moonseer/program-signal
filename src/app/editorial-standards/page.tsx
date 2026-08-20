import Link from "next/link";
import { pageMetadata } from "@/lib/page-metadata";


export const metadata = pageMetadata({
  title: 'Editorial Standards',
  description:
    'Evidence rules for Platform Signal: material claims need sources, opinion is labeled, and no agent publishes.',
  path: '/editorial-standards',
});

export default function EditorialStandardsPage() {
  return (
    <div className="mx-auto max-w-[46rem] px-6 py-12">
      <h1 className="font-[family-name:var(--font-display)] text-4xl tracking-[-0.03em]">
        Editorial Standards
      </h1>
      <div className="prose-signal mt-8">
        <p>
          High signal. Low noise. Evidence always. Personas may differ in voice;
          they may not differ in evidence rules.
        </p>
        <p>
          Material technical claims require evidence. Version-specific claims
          name versions. Benchmarks disclose methodology. Predictions are labeled.
          Opinion is not written as fact.
        </p>
        <p>
          We prefer specifications, official documentation, standards, research
          papers, and maintainer docs before secondary commentary. Editorial
          conclusions cannot be purchased. Material errors are corrected in
          public, not silently.
        </p>
        <p>
          Named editorial voices are personas, not real-world individuals. AI may
          assist research and drafting. A human editor retains publication
          accountability. No agent publishes.
        </p>
        <p>
          <Link href="/corrections">Corrections</Link>
          {" · "}
          <Link href="/sponsorship-policy">Sponsorship</Link>
          {" · "}
          <Link href="/vendor-interaction-policy">Vendor interaction</Link>
          {" · "}
          <Link href="/responsible-disclosure">Responsible disclosure</Link>
          {" · "}
          <Link href="/content-rights-policy">Content rights</Link>
        </p>
        <p>
          Full constitution:{" "}
          <code>docs/editorial/EDITORIAL-STANDARDS.md</code> in the repository.
        </p>
      </div>
    </div>
  );
}
