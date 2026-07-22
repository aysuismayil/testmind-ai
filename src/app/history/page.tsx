"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { QAReport } from "@/lib/types";
import { clearHistory, deleteHistoryItem, getHistory } from "@/lib/storage/history";
import { Button } from "@/components/button";

export default function HistoryPage() {
  const [history, setHistory] = useState<QAReport[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time load from localStorage on mount
    setHistory(getHistory());
    setLoaded(true);
  }, []);

  function handleDelete(id: string) {
    deleteHistoryItem(id);
    setHistory(getHistory());
  }

  function handleClearAll() {
    if (typeof window !== "undefined" && !window.confirm("Clear all saved history? This cannot be undone.")) {
      return;
    }
    clearHistory();
    setHistory([]);
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">History</h1>
        {history.length > 0 && (
          <Button type="button" variant="danger" onClick={handleClearAll}>
            Clear all
          </Button>
        )}
      </div>
      <p className="mt-2 text-slate-600 dark:text-slate-400">
        Previously generated reports are stored locally in your browser (localStorage) &mdash; nothing is
        sent to a server for storage.
      </p>

      {loaded && history.length === 0 && (
        <div className="mt-10 rounded-lg border border-dashed border-slate-300 p-10 text-center dark:border-slate-700">
          <p className="text-slate-600 dark:text-slate-400">No saved reports yet.</p>
          <Link href="/generator" className="mt-3 inline-block font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400">
            Generate your first report
          </Link>
        </div>
      )}

      <ul className="mt-6 space-y-3">
        {history.map((report) => (
          <li
            key={report.id}
            className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900"
          >
            <div className="min-w-0">
              <Link href={`/results?id=${report.id}`} className="font-semibold text-slate-900 hover:underline dark:text-white">
                {report.title}
              </Link>
              <p className="mt-1 truncate text-sm text-slate-500 dark:text-slate-400">
                {new Date(report.createdAt).toLocaleString()} &middot; {report.meta.provider}
              </p>
            </div>
            <div className="flex shrink-0 gap-2">
              <Link
                href={`/results?id=${report.id}`}
                className="inline-flex items-center justify-center rounded-md border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                View
              </Link>
              <Button type="button" variant="danger" onClick={() => handleDelete(report.id)}>
                Delete
              </Button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
