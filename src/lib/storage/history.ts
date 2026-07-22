import type { QAReport } from "@/lib/types";

const HISTORY_KEY = "testmind:history";
const MAX_HISTORY_ITEMS = 50;

function isBrowser(): boolean {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

export function getHistory(): QAReport[] {
  if (!isBrowser()) return [];
  try {
    const raw = window.localStorage.getItem(HISTORY_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as QAReport[]) : [];
  } catch {
    return [];
  }
}

export function getHistoryItem(id: string): QAReport | undefined {
  return getHistory().find((r) => r.id === id);
}

export function saveToHistory(report: QAReport): void {
  if (!isBrowser()) return;
  const current = getHistory().filter((r) => r.id !== report.id);
  const next = [report, ...current].slice(0, MAX_HISTORY_ITEMS);
  window.localStorage.setItem(HISTORY_KEY, JSON.stringify(next));
}

export function updateHistoryItem(report: QAReport): void {
  if (!isBrowser()) return;
  const current = getHistory();
  const index = current.findIndex((r) => r.id === report.id);
  if (index === -1) {
    saveToHistory(report);
    return;
  }
  current[index] = report;
  window.localStorage.setItem(HISTORY_KEY, JSON.stringify(current));
}

export function deleteHistoryItem(id: string): void {
  if (!isBrowser()) return;
  const next = getHistory().filter((r) => r.id !== id);
  window.localStorage.setItem(HISTORY_KEY, JSON.stringify(next));
}

export function clearHistory(): void {
  if (!isBrowser()) return;
  window.localStorage.removeItem(HISTORY_KEY);
}
