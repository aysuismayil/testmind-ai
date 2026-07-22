export function SiteFooter() {
  return (
    <footer className="border-t border-slate-200 py-8 text-sm text-slate-500 dark:border-slate-800 dark:text-slate-400">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-2 px-4 text-center sm:px-6">
        <p>TestMind AI &mdash; Turn requirements into practical test coverage.</p>
        <p>
          Open source under the MIT License.{" "}
          <a
            href="https://github.com/aysuismayil/testmind-ai"
            className="font-medium text-indigo-600 underline underline-offset-2 hover:text-indigo-500 dark:text-indigo-400"
          >
            View on GitHub
          </a>
        </p>
      </div>
    </footer>
  );
}
