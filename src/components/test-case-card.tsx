import type { TestCase } from "@/lib/types";
import { PriorityBadge } from "@/components/priority-badge";

export function TestCaseCard({ testCase, index }: { testCase: TestCase; index: number }) {
  return (
    <li className="rounded-md border border-slate-200 p-3 dark:border-slate-800">
      <div className="mb-2 flex items-start justify-between gap-2">
        <h4 className="font-medium text-slate-900 dark:text-white">
          {index + 1}. {testCase.title}
        </h4>
        <PriorityBadge priority={testCase.priority} />
      </div>
      {testCase.preconditions && (
        <p className="mb-2 text-sm text-slate-600 dark:text-slate-400">
          <span className="font-semibold">Preconditions: </span>
          {testCase.preconditions}
        </p>
      )}
      <p className="mb-1 text-sm font-semibold text-slate-700 dark:text-slate-300">Steps:</p>
      <ol className="mb-2 list-decimal space-y-1 pl-5 text-sm text-slate-700 dark:text-slate-300">
        {testCase.steps.map((step, i) => (
          <li key={i}>{step}</li>
        ))}
      </ol>
      <p className="text-sm text-slate-700 dark:text-slate-300">
        <span className="font-semibold">Expected result: </span>
        {testCase.expectedResult}
      </p>
    </li>
  );
}
