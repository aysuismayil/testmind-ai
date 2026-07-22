export type Priority = "High" | "Medium" | "Low";

export interface TestCase {
  id: string;
  title: string;
  preconditions?: string;
  steps: string[];
  expectedResult: string;
  priority: Priority;
}

export interface QAReportMeta {
  provider: "mock" | "openai";
  model?: string;
  generatedAt: string;
  fallbackReason?: string;
}

export interface QAReport {
  id: string;
  createdAt: string;
  title: string;
  input: string;
  summary: string;
  testScenarios: string[];
  testCases: TestCase[];
  positiveTests: TestCase[];
  negativeTests: TestCase[];
  edgeCases: TestCase[];
  smokeChecklist: string[];
  regressionChecklist: string[];
  apiTestIdeas: string[];
  accessibilityChecklist: string[];
  clarificationQuestions: string[];
  riskAreas: string[];
  missingRequirements: string[];
  meta: QAReportMeta;
  /** User-edited markdown override. When present, it takes precedence for copy/export/download. */
  editedMarkdown?: string;
}

export interface GenerateRequestBody {
  input: string;
}

export interface GenerateResponseBody {
  report?: QAReport;
  error?: string;
}

export const QA_REPORT_SECTIONS = [
  "testScenarios",
  "testCases",
  "positiveTests",
  "negativeTests",
  "edgeCases",
  "smokeChecklist",
  "regressionChecklist",
  "apiTestIdeas",
  "accessibilityChecklist",
  "clarificationQuestions",
  "riskAreas",
  "missingRequirements",
] as const;

export type QAReportSection = (typeof QA_REPORT_SECTIONS)[number];
