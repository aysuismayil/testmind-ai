import type { QAReport } from "@/lib/types";

export function reportToJson(report: QAReport): string {
  return JSON.stringify(report, null, 2);
}
