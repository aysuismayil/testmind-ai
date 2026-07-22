import type { QAReport } from "@/lib/types";

const CURRENT_KEY = "testmind:current";

function isBrowser(): boolean {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

export function setCurrentReport(report: QAReport): void {
  if (!isBrowser()) return;
  window.localStorage.setItem(CURRENT_KEY, JSON.stringify(report));
}

export function getCurrentReport(): QAReport | undefined {
  if (!isBrowser()) return undefined;
  try {
    const raw = window.localStorage.getItem(CURRENT_KEY);
    if (!raw) return undefined;
    return JSON.parse(raw) as QAReport;
  } catch {
    return undefined;
  }
}

export function clearCurrentReport(): void {
  if (!isBrowser()) return;
  window.localStorage.removeItem(CURRENT_KEY);
}
