"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/button";
import { SAMPLE_REQUIREMENT } from "@/lib/sample-requirement";
import { saveToHistory } from "@/lib/storage/history";
import { setCurrentReport } from "@/lib/storage/current";
import type { GenerateResponseBody } from "@/lib/types";

const MAX_LENGTH = 12000;

export default function GeneratorPage() {
  const router = useRouter();
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleGenerate() {
    const trimmed = input.trim();
    if (!trimmed) {
      setError("Please paste a requirement before generating.");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input: trimmed }),
      });
      const data = (await res.json()) as GenerateResponseBody;
      if (!res.ok || !data.report) {
        throw new Error(data.error || "Failed to generate report.");
      }
      setCurrentReport(data.report);
      saveToHistory(data.report);
      router.push("/results");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Generator</h1>
      <p className="mt-2 text-slate-600 dark:text-slate-400">
        Paste a User Story, Acceptance Criteria, PRD excerpt, or feature description below, then click
        Generate to produce structured QA documentation.
      </p>

      <div className="mt-6">
        <div className="mb-2 flex items-center justify-between">
          <label htmlFor="requirement-input" className="font-medium text-slate-800 dark:text-slate-200">
            Requirement
          </label>
          <button
            type="button"
            onClick={() => setInput(SAMPLE_REQUIREMENT)}
            className="text-sm font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
          >
            Load example
          </button>
        </div>
        <textarea
          id="requirement-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          maxLength={MAX_LENGTH}
          rows={14}
          placeholder="e.g. As a user, I want to reset my password via email so that I can regain access to my account..."
          className="w-full rounded-lg border border-slate-300 bg-white p-4 text-sm text-slate-800 shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-indigo-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
          aria-describedby="requirement-help"
        />
        <div id="requirement-help" className="mt-1 flex justify-between text-xs text-slate-500 dark:text-slate-400">
          <span>Works fully offline with a local mock AI provider if no OpenAI API key is configured.</span>
          <span>{input.length}/{MAX_LENGTH}</span>
        </div>
      </div>

      {error && (
        <p role="alert" className="mt-4 rounded-md bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:bg-rose-900/30 dark:text-rose-300">
          {error}
        </p>
      )}

      <div className="mt-6 flex gap-3">
        <Button type="button" onClick={handleGenerate} disabled={loading}>
          {loading ? "Generating…" : "Generate"}
        </Button>
        <Button type="button" variant="secondary" onClick={() => setInput("")} disabled={loading}>
          Clear
        </Button>
      </div>
    </div>
  );
}
