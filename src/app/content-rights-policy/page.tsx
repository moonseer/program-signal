import { pageMetadata } from "@/lib/page-metadata";

export const metadata = pageMetadata({
  title: 'Content Rights Policy',
  description:
    'Prefer original diagrams and attribute third-party assets. Rules for code, research figures, and AI-generated media.',
  path: '/content-rights-policy',
});

export default function ContentRightsPolicyPage() {
  return (
    <div className="mx-auto max-w-[46rem] px-6 py-12">
      <h1 className="font-[family-name:var(--font-display)] text-4xl tracking-[-0.03em]">
        Content Rights Policy
      </h1>
      <div className="prose-signal mt-8">
        <p>Prefer original work. Attribute everything that is not ours.</p>

        <h2>Third-party assets</h2>
        <p>
          When a third-party asset is used, record source, creator, license,
          permission basis, attribution, and which articles use it.
        </p>

        <h2>Diagrams and code</h2>
        <p>
          Prefer original Platform Signal diagrams. Do not paste vendor
          architecture art as ours. Short code snippets must respect upstream
          licenses; prefer linking to official docs for long manifests.
        </p>

        <h2>AI-generated assets</h2>
        <p>
          AI-assisted diagrams remain under editorial accountability. Do not
          present them as real production screenshots. They must not invent
          systems the sources do not support.
        </p>

        <p>
          Full policy:{" "}
          <code>docs/editorial/CONTENT-RIGHTS-POLICY.md</code>.
        </p>
      </div>
    </div>
  );
}
