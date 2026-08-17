export const metadata = { title: "Labs" };

export default function LabsPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="font-[family-name:var(--font-display)] text-4xl tracking-[-0.03em]">
        Labs
      </h1>
      <p className="mt-4 text-[var(--muted)]">
        Original experiments with documented environments, versions, and
        limitations. The first Lab is planned after public launch.
      </p>
    </div>
  );
}
