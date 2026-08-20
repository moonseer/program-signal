import { pageMetadata } from "@/lib/page-metadata";

export const metadata = pageMetadata({
  title: "Field Notes",
  description:
    "Practical implementation notes from the Nia and Marcus editorial voices.",
  path: "/field-notes",
});

export default function FieldNotesPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="font-[family-name:var(--font-display)] text-4xl tracking-[-0.03em]">
        Field Notes
      </h1>
      <p className="mt-4 text-[var(--muted)]">
        Practical implementation notes from the Nia and Marcus editorial voices.
      </p>
    </div>
  );
}
