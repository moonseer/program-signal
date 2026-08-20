import Link from "next/link";

export const metadata = {
  title: "Responsible Disclosure",
  description:
    "How to report security issues to Platform Signal, and how we handle vulnerabilities found in research.",
};

export default function ResponsibleDisclosurePage() {
  return (
    <div className="mx-auto max-w-[46rem] px-6 py-12">
      <h1 className="font-[family-name:var(--font-display)] text-4xl tracking-[-0.03em]">
        Responsible Disclosure
      </h1>
      <div className="prose-signal mt-8">
        <h2>Report an issue in Platform Signal</h2>
        <p>
          Prefer a private GitHub vulnerability report against{" "}
          <a href="https://github.com/moonseer/program-signal">
            moonseer/program-signal
          </a>{" "}
          when available. If that channel is unavailable, open an issue titled{" "}
          <code>SECURITY:</code> without exploit details, secrets, or personal
          data in the public body.
        </p>
        <p>
          Include the affected component, high-level reproduction steps, and
          impact. This is not a bug bounty. Good-faith reporters who avoid
          disruption and privacy harm will not be pursued for the report alone.
        </p>

        <h2>Vulnerabilities found while researching articles</h2>
        <ol>
          <li>Validate privately with minimal reproduction.</li>
          <li>Notify the vendor or maintainer through their security contact.</li>
          <li>Coordinate on timing when reasonable.</li>
          <li>Publish only afterward, if the story is still warranted.</li>
        </ol>
        <p>
          Public articles may describe impact classes and mitigations. They must
          not include working exploit details or step-by-step attack procedures.
        </p>

        <p>
          Ordinary article errors use the{" "}
          <Link href="/corrections">corrections</Link> process. Full policy:{" "}
          <code>docs/editorial/RESPONSIBLE-DISCLOSURE.md</code>.
        </p>
      </div>
    </div>
  );
}
