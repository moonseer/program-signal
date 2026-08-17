export const metadata = { title: "Topics" };

export default function TopicsPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="font-[family-name:var(--font-display)] text-4xl tracking-[-0.03em]">
        Topics
      </h1>
      <p className="mt-4 text-[var(--muted)]">
        Cluster pages ship with the publishing system. Launch clusters include AI
        agents and harnesses, Kubernetes, MCP, platform engineering, and forward
        deployed engineering.
      </p>
    </div>
  );
}
