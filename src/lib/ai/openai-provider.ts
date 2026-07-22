import type { QAReport, TestCase } from "@/lib/types";
import { SYSTEM_PROMPT, buildUserPrompt } from "@/lib/ai/prompt";

const OPENAI_URL = "https://api.openai.com/v1/chat/completions";

function toStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((v): v is string => typeof v === "string" && v.trim().length > 0);
}

function toTestCaseArray(value: unknown): TestCase[] {
  if (!Array.isArray(value)) return [];
  return value.map((raw, index) => {
    const v = (raw ?? {}) as Record<string, unknown>;
    const steps = toStringArray(v.steps);
    const priority = v.priority === "High" || v.priority === "Low" ? v.priority : "Medium";
    return {
      id: `tc-openai-${index}`,
      title: typeof v.title === "string" ? v.title : `Test case ${index + 1}`,
      preconditions: typeof v.preconditions === "string" ? v.preconditions : undefined,
      steps: steps.length > 0 ? steps : ["Perform the described action"],
      expectedResult:
        typeof v.expectedResult === "string" ? v.expectedResult : "The system behaves as expected",
      priority,
    };
  });
}

/**
 * Calls the OpenAI Chat Completions API and normalizes the response into a
 * QAReport. Throws on any failure so the caller can fall back to the mock
 * provider.
 */
export async function generateOpenAIReport(input: string): Promise<QAReport> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is not configured");
  }
  const model = process.env.OPENAI_MODEL || "gpt-4o-mini";

  const response = await fetch(OPENAI_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      temperature: 0.4,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: buildUserPrompt(input) },
      ],
    }),
  });

  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(`OpenAI request failed (${response.status}): ${text.slice(0, 300)}`);
  }

  const data = (await response.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };
  const content = data.choices?.[0]?.message?.content;
  if (!content) {
    throw new Error("OpenAI response did not contain any content");
  }

  let parsed: Record<string, unknown>;
  try {
    parsed = JSON.parse(content) as Record<string, unknown>;
  } catch {
    throw new Error("Failed to parse OpenAI response as JSON");
  }

  const now = new Date().toISOString();
  const title = typeof parsed.title === "string" && parsed.title.trim() ? parsed.title : "Generated QA report";

  const report: QAReport = {
    id: `report-openai-${Date.now()}`,
    createdAt: now,
    title,
    input,
    summary: typeof parsed.summary === "string" ? parsed.summary : "AI-generated QA analysis.",
    testScenarios: toStringArray(parsed.testScenarios),
    testCases: toTestCaseArray(parsed.testCases),
    positiveTests: toTestCaseArray(parsed.positiveTests),
    negativeTests: toTestCaseArray(parsed.negativeTests),
    edgeCases: toTestCaseArray(parsed.edgeCases),
    smokeChecklist: toStringArray(parsed.smokeChecklist),
    regressionChecklist: toStringArray(parsed.regressionChecklist),
    apiTestIdeas: toStringArray(parsed.apiTestIdeas),
    accessibilityChecklist: toStringArray(parsed.accessibilityChecklist),
    clarificationQuestions: toStringArray(parsed.clarificationQuestions),
    riskAreas: toStringArray(parsed.riskAreas),
    missingRequirements: toStringArray(parsed.missingRequirements),
    meta: {
      provider: "openai",
      model,
      generatedAt: now,
    },
  };

  return report;
}
