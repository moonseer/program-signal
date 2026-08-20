import Link from "next/link";
import { pageMetadata } from "@/lib/page-metadata";


export const metadata = pageMetadata({
  title: 'Corrections',
  description:
    'How Platform Signal handles errors, how to report them, and the public list of material corrections.',
  path: '/corrections',
});

export default function CorrectionsPage() {
  return (
    <div className="mx-auto max-w-[46rem] px-6 py-12">
      <h1 className="font-[family-name:var(--font-display)] text-4xl tracking-[-0.03em]">
        Corrections
      </h1>
      <div className="prose-signal mt-8">
        <p>
          Technical publishing will be wrong sometimes. Credibility comes from
          handling errors visibly.
        </p>

        <h2>Severity</h2>
        <ul>
          <li>
            <strong>Minor</strong> (typo, grammar, formatting): fixed quietly.
          </li>
          <li>
            <strong>Clarification</strong> (meaning unchanged): optional revision
            note.
          </li>
          <li>
            <strong>Material</strong> (wrong version, incorrect command,
            misstated behavior): public listing here and a visible article notice.
          </li>
          <li>
            <strong>Retraction</strong> (core conclusions unreliable): rare;
            listed here with a clear notice.
          </li>
        </ul>

        <h2>How to report an error</h2>
        <p>
          Open a GitHub issue on{" "}
          <a href="https://github.com/moonseer/program-signal/issues/new">
            moonseer/program-signal
          </a>{" "}
          with the article URL or slug, the incorrect statement, the correct
          statement if known, and a primary source when the error is technical.
          Do not post secrets or exploit details. Security-sensitive reports use
          the{" "}
          <Link href="/responsible-disclosure">responsible disclosure</Link>{" "}
          process.
        </p>

        <h2>Public log</h2>
        <p className="text-[var(--muted)]">No material corrections yet.</p>

        <p>
          Full policy:{" "}
          <code>docs/editorial/CORRECTIONS-POLICY.md</code> in the repository.
        </p>
      </div>
    </div>
  );
}
