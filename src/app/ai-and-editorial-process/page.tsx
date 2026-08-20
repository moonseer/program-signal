import { pageMetadata } from "@/lib/page-metadata";

export const metadata = pageMetadata({
  title: "AI and Editorial Process",
  description:
    "How Platform Signal uses AI-assisted research and drafting while keeping human publication accountability and evidence rules.",
  path: "/ai-and-editorial-process",
});

export default function AiEditorialProcessPage() {
  return (
    <div className="mx-auto max-w-[46rem] px-6 py-12">
      <h1 className="font-[family-name:var(--font-display)] text-4xl tracking-[-0.03em]">
        AI and Editorial Process
      </h1>
      <div className="prose-signal mt-8">
        <p>
          Platform Signal uses named editorial personas to represent distinct
          areas of technical analysis and writing style. These personas are not
          presented as real-world individuals. Research and drafting may use
          AI-assisted tools; technical claims, recommendations, and sources are
          reviewed through the Platform Signal editorial process.
        </p>
        <p>
          AI may research, draft, summarize, edit, and propose metadata. It may
          not publish, invent sources or experience, override evidence findings,
          or present personas as real people.
        </p>
        <p>
          The Radar decides what deserves attention. The Desk decides what
          deserves publication, in which form and voice. The Technical Research
          Editor decides whether claims can be proven. Only a human
          Editor-in-Chief publishes.
        </p>
        <p>
          Articles are attributed as “Written in the [Persona] editorial voice /
          Reviewed by Platform Signal Editorial.” Personal experience, labs the
          founder ran, and editorial positions use a real human name.
        </p>
      </div>
    </div>
  );
}
