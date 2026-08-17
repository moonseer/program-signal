export const metadata = { title: "About" };

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-[46rem] px-6 py-12">
      <h1 className="font-[family-name:var(--font-display)] text-4xl tracking-[-0.03em]">
        About Platform Signal
      </h1>
      <div className="prose-signal mt-8">
        <p>
          Platform Signal is a technical publication on production AI, Kubernetes,
          platform engineering, SRE, and agent infrastructure.
        </p>
        <p>
          It uses named editorial personas to represent distinct ways of thinking.
          Those personas are not presented as real-world individuals. Research and
          drafting may use AI-assisted tools; a human editor retains publication
          accountability.
        </p>
        <p>
          Discovery (The Radar) is separate from editorial judgment (The Desk),
          which is separate from evidence review (the Technical Research Editor).
          No agent publishes autonomously.
        </p>
      </div>
    </div>
  );
}
