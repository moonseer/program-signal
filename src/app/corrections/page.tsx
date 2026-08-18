export const metadata = { title: "Corrections" };

export default function CorrectionsPage() {
  return (
    <div className="mx-auto max-w-[46rem] px-6 py-12">
      <h1 className="font-[family-name:var(--font-display)] text-4xl tracking-[-0.03em]">
        Corrections
      </h1>
      <div className="prose-signal mt-8">
        <p>
          Material technical errors are corrected in public. Minor copy edits
          are not listed here.
        </p>
        <p className="text-[var(--muted)]">No material corrections yet.</p>
      </div>
    </div>
  );
}
