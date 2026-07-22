"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import type { QAReport } from "@/lib/types";
import { getCurrentReport, setCurrentReport } from "@/lib/storage/current";
import { getHistoryItem, updateHistoryItem } from "@/lib/storage/history";
import { ResultView } from "@/components/result-view";

function ResultsContent() {
  const searchParams = useSearchParams();
  const historyId = searchParams.get("id");
  const [report, setReport] = useState<QAReport | undefined>(undefined);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const found = historyId ? getHistoryItem(historyId) : getCurrentReport();
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time load from localStorage on mount
    setReport(found);
    setLoaded(true);
  }, [historyId]);

  function handleReportChange(next: QAReport) {
    setReport(next);
    updateHistoryItem(next);
    if (!historyId) {
      setCurrentReport(next);
    }
  }

  if (!loaded) {
    return <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">Loading…</div>;
  }

  if (!report) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">No results yet</h1>
        <p className="mt-2 text-slate-600 dark:text-slate-400">
          Generate a report from the Generator page, or pick a past report from History.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Link
            href="/generator"
            className="inline-flex items-center justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
          >
            Go to Generator
          </Link>
          <Link
            href="/history"
            className="inline-flex items-center justify-center rounded-md border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            View History
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Results</h1>
        <Link href="/generator" className="text-sm font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400">
          + New generation
        </Link>
      </div>
      <ResultView report={report} onReportChange={handleReportChange} />
    </div>
  );
}

export default function ResultsPage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">Loading…</div>}>
      <ResultsContent />
    </Suspense>
  );
}
