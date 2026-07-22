"use client";

import { useMemo, useState } from "react";
import type { QAReport } from "@/lib/types";
import { reportToMarkdown } from "@/lib/export/markdown";
import { reportToJson } from "@/lib/export/json";
import { downloadTextFile } from "@/lib/download";
import { ReportSection } from "@/components/report-section";
import { TestCaseCard } from "@/components/test-case-card";
import { CopyButton } from "@/components/copy-button";
import { Button } from "@/components/button";

function ListSection({ items }: { items: string[] }) {
  if (items.length === 0) {
    return <p className="text-sm text-slate-500 dark:text-slate-400">Nothing generated for this section.</p>;
  }
  return (
    <ul className="list-disc space-y-1 pl-5 text-sm text-slate-700 dark:text-slate-300">
      {items.map((item, i) => (
        <li key={i}>{item}</li>
      ))}
    </ul>
  );
}

export function ResultView({
  report,
  onReportChange,
}: {
  report: QAReport;
  onReportChange?: (report: QAReport) => void;
}) {
  const [mode, setMode] = useState<"structured" | "markdown">("structured");
  const generatedMarkdown = useMemo(() => reportToMarkdown(report), [report]);
  const [draftMarkdown, setDraftMarkdown] = useState(report.editedMarkdown ?? generatedMarkdown);

  const activeMarkdown = report.editedMarkdown ?? generatedMarkdown;

  function handleSaveMarkdown() {
    onReportChange?.({ ...report, editedMarkdown: draftMarkdown });
  }

  function handleResetMarkdown() {
    setDraftMarkdown(generatedMarkdown);
    onReportChange?.({ ...report, editedMarkdown: undefined });
  }

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">{report.title}</h2>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{report.summary}</p>
            <p className="mt-2 text-xs text-slate-400 dark:text-slate-500">
              Generated {new Date(report.createdAt).toLocaleString()} &middot; Provider: {report.meta.provider}
              {report.meta.model ? ` (${report.meta.model})` : ""}
              {report.meta.fallbackReason ? " · fell back from OpenAI to mock provider" : ""}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <CopyButton getText={() => activeMarkdown} label="Copy Markdown" />
            <Button
              type="button"
              variant="secondary"
              onClick={() => downloadTextFile(`${report.id}.md`, activeMarkdown, "text/markdown")}
            >
              Download .md
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => downloadTextFile(`${report.id}.json`, reportToJson(report), "application/json")}
            >
              Download .json
            </Button>
          </div>
        </div>

        <div className="mt-4 flex gap-2 border-b border-slate-200 dark:border-slate-800">
          <button
            type="button"
            onClick={() => setMode("structured")}
            aria-current={mode === "structured"}
            className={`border-b-2 px-3 py-2 text-sm font-medium ${
              mode === "structured"
                ? "border-indigo-600 text-indigo-700 dark:text-indigo-400"
                : "border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
            }`}
          >
            Structured view
          </button>
          <button
            type="button"
            onClick={() => setMode("markdown")}
            aria-current={mode === "markdown"}
            className={`border-b-2 px-3 py-2 text-sm font-medium ${
              mode === "markdown"
                ? "border-indigo-600 text-indigo-700 dark:text-indigo-400"
                : "border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
            }`}
          >
            Edit as Markdown
          </button>
        </div>
      </div>

      {mode === "markdown" ? (
        <div className="space-y-3">
          <label htmlFor="markdown-editor" className="sr-only">
            Edit report as Markdown
          </label>
          <textarea
            id="markdown-editor"
            value={draftMarkdown}
            onChange={(e) => setDraftMarkdown(e.target.value)}
            rows={24}
            className="w-full rounded-lg border border-slate-300 bg-white p-4 font-mono text-sm text-slate-800 shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-indigo-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
          />
          <div className="flex gap-2">
            <Button type="button" onClick={handleSaveMarkdown}>
              Save edits
            </Button>
            <Button type="button" variant="secondary" onClick={handleResetMarkdown}>
              Reset to generated version
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <ReportSection title="Test Scenarios" count={report.testScenarios.length}>
            <ListSection items={report.testScenarios} />
          </ReportSection>

          <ReportSection title="Test Cases" count={report.testCases.length}>
            <ul className="space-y-3">
              {report.testCases.map((tc, i) => (
                <TestCaseCard key={tc.id} testCase={tc} index={i} />
              ))}
            </ul>
          </ReportSection>

          <ReportSection title="Positive Tests" count={report.positiveTests.length} defaultOpen={false}>
            <ul className="space-y-3">
              {report.positiveTests.map((tc, i) => (
                <TestCaseCard key={tc.id} testCase={tc} index={i} />
              ))}
            </ul>
          </ReportSection>

          <ReportSection title="Negative Tests" count={report.negativeTests.length} defaultOpen={false}>
            <ul className="space-y-3">
              {report.negativeTests.map((tc, i) => (
                <TestCaseCard key={tc.id} testCase={tc} index={i} />
              ))}
            </ul>
          </ReportSection>

          <ReportSection title="Edge Cases" count={report.edgeCases.length} defaultOpen={false}>
            <ul className="space-y-3">
              {report.edgeCases.map((tc, i) => (
                <TestCaseCard key={tc.id} testCase={tc} index={i} />
              ))}
            </ul>
          </ReportSection>

          <ReportSection title="Smoke Testing Checklist" count={report.smokeChecklist.length} defaultOpen={false}>
            <ListSection items={report.smokeChecklist} />
          </ReportSection>

          <ReportSection
            title="Regression Testing Checklist"
            count={report.regressionChecklist.length}
            defaultOpen={false}
          >
            <ListSection items={report.regressionChecklist} />
          </ReportSection>

          <ReportSection title="API Testing Ideas" count={report.apiTestIdeas.length} defaultOpen={false}>
            <ListSection items={report.apiTestIdeas} />
          </ReportSection>

          <ReportSection
            title="Accessibility Testing Checklist"
            count={report.accessibilityChecklist.length}
            defaultOpen={false}
          >
            <ListSection items={report.accessibilityChecklist} />
          </ReportSection>

          <ReportSection
            title="Clarification Questions"
            count={report.clarificationQuestions.length}
            defaultOpen={false}
          >
            <ListSection items={report.clarificationQuestions} />
          </ReportSection>

          <ReportSection title="Risk Areas" count={report.riskAreas.length} defaultOpen={false}>
            <ListSection items={report.riskAreas} />
          </ReportSection>

          <ReportSection
            title="Missing Requirements"
            count={report.missingRequirements.length}
            defaultOpen={false}
          >
            <ListSection items={report.missingRequirements} />
          </ReportSection>
        </div>
      )}
    </div>
  );
}
