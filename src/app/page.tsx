import Link from "next/link";

const FEATURES = [
  { title: "Test Scenarios", desc: "High-level scenarios covering the full breadth of the requirement." },
  { title: "Detailed Test Cases", desc: "Step-by-step cases with preconditions and expected results." },
  { title: "Positive & Negative Tests", desc: "Happy paths alongside deliberate failure and validation cases." },
  { title: "Edge Cases", desc: "Boundary values, race conditions, and unusual real-world situations." },
  { title: "Smoke & Regression Checklists", desc: "Fast sanity checks and safety nets for future changes." },
  { title: "API Testing Ideas", desc: "Backend-focused test ideas for the endpoints behind the feature." },
  { title: "Accessibility Checklist", desc: "Practical WCAG-aligned checks so nobody is left out." },
  { title: "Clarifications, Risks & Gaps", desc: "The questions and blind spots a good QA engineer would raise." },
];

export default function HomePage() {
  return (
    <div>
      <section className="mx-auto max-w-5xl px-4 pb-16 pt-16 text-center sm:px-6 sm:pt-24">
        <span className="inline-block rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300">
          Open source · Works without any API key
        </span>
        <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-5xl">
          TestMind AI
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600 dark:text-slate-300">
          Turn requirements into practical test coverage. Paste a User Story, Acceptance Criteria, PRD, or
          feature description &mdash; get scenarios, test cases, checklists, and risk analysis in seconds.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/generator"
            className="inline-flex items-center justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Try the generator
          </Link>
          <Link
            href="/about"
            className="inline-flex items-center justify-center rounded-md border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            Learn how it works
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 pb-20 sm:px-6">
        <ol className="grid gap-4 sm:grid-cols-3">
          {[
            { step: "1", title: "Paste", desc: "Paste a requirement, story, or PRD excerpt." },
            { step: "2", title: "Generate", desc: "Click Generate and let TestMind AI analyze it." },
            { step: "3", title: "Export", desc: "Copy, edit, or download as Markdown / JSON." },
          ].map((s) => (
            <li key={s.step} className="rounded-lg border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 text-sm font-bold text-white">
                {s.step}
              </span>
              <h3 className="mt-3 font-semibold text-slate-900 dark:text-white">{s.title}</h3>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{s.desc}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="mx-auto max-w-5xl px-4 pb-24 sm:px-6">
        <h2 className="text-center text-2xl font-bold text-slate-900 dark:text-white">
          Everything a QA engineer would produce &mdash; instantly
        </h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((f) => (
            <div key={f.title} className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
              <h3 className="font-semibold text-slate-900 dark:text-white">{f.title}</h3>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
