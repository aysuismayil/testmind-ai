import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-bold text-slate-900 dark:text-white">About TestMind AI</h1>
      <p className="mt-4 text-slate-600 dark:text-slate-400">
        TestMind AI is an open-source, AI-powered QA assistant. Paste a User Story, Acceptance Criteria,
        PRD excerpt, or feature description, and it generates structured, practical test coverage: test
        scenarios, detailed test cases, positive and negative tests, edge cases, smoke and regression
        checklists, API testing ideas, an accessibility checklist, clarification questions, risk areas, and
        missing requirements.
      </p>

      <h2 className="mt-8 text-xl font-semibold text-slate-900 dark:text-white">How generation works</h2>
      <p className="mt-2 text-slate-600 dark:text-slate-400">
        When you click Generate, the request is sent to a server API route. If an{" "}
        <code className="rounded bg-slate-100 px-1 py-0.5 text-sm dark:bg-slate-800">OPENAI_API_KEY</code>{" "}
        environment variable is configured, the app calls the OpenAI API to produce the report. If no key is
        configured, or the call fails for any reason, TestMind AI automatically falls back to a local mock
        provider that produces realistic, deterministic QA documentation &mdash; so the app always works,
        even fully offline.
      </p>

      <h2 className="mt-8 text-xl font-semibold text-slate-900 dark:text-white">Privacy</h2>
      <p className="mt-2 text-slate-600 dark:text-slate-400">
        Generation history is stored only in your browser&apos;s local storage. Nothing is persisted on a
        server database by this application.
      </p>

      <h2 className="mt-8 text-xl font-semibold text-slate-900 dark:text-white">Open source</h2>
      <p className="mt-2 text-slate-600 dark:text-slate-400">
        TestMind AI is released under the MIT License. Contributions are welcome &mdash; see the{" "}
        <code className="rounded bg-slate-100 px-1 py-0.5 text-sm dark:bg-slate-800">CONTRIBUTING.md</code>{" "}
        file in the repository for guidelines.
      </p>

      <div className="mt-8">
        <Link
          href="https://github.com/aysuismayil/testmind-ai"
          className="inline-flex items-center justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
        >
          View source on GitHub
        </Link>
      </div>
    </div>
  );
}
