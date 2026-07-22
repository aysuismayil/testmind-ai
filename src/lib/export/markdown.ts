import type { QAReport, TestCase } from "@/lib/types";

function listSection(title: string, items: string[]): string {
  if (items.length === 0) return `## ${title}\n\n_None generated._\n`;
  return `## ${title}\n\n${items.map((i) => `- ${i}`).join("\n")}\n`;
}

function testCaseSection(title: string, cases: TestCase[]): string {
  if (cases.length === 0) return `## ${title}\n\n_None generated._\n`;
  const body = cases
    .map((c, i) => {
      const steps = c.steps.map((s, idx) => `${idx + 1}. ${s}`).join("\n");
      return [
        `### ${i + 1}. ${c.title} (${c.priority})`,
        c.preconditions ? `**Preconditions:** ${c.preconditions}` : "",
        "**Steps:**",
        steps,
        `**Expected result:** ${c.expectedResult}`,
      ]
        .filter(Boolean)
        .join("\n\n");
    })
    .join("\n\n");
  return `## ${title}\n\n${body}\n`;
}

export function reportToMarkdown(report: QAReport): string {
  const parts = [
    `# ${report.title}`,
    "",
    `> ${report.summary}`,
    "",
    `_Generated ${new Date(report.createdAt).toLocaleString()} · Provider: ${report.meta.provider}${
      report.meta.model ? ` (${report.meta.model})` : ""
    }_`,
    "",
    "## Original Requirement",
    "",
    "```",
    report.input,
    "```",
    "",
    listSection("Test Scenarios", report.testScenarios),
    testCaseSection("Test Cases", report.testCases),
    testCaseSection("Positive Tests", report.positiveTests),
    testCaseSection("Negative Tests", report.negativeTests),
    testCaseSection("Edge Cases", report.edgeCases),
    listSection("Smoke Testing Checklist", report.smokeChecklist),
    listSection("Regression Testing Checklist", report.regressionChecklist),
    listSection("API Testing Ideas", report.apiTestIdeas),
    listSection("Accessibility Testing Checklist", report.accessibilityChecklist),
    listSection("Clarification Questions", report.clarificationQuestions),
    listSection("Risk Areas", report.riskAreas),
    listSection("Missing Requirements", report.missingRequirements),
  ];
  return parts.join("\n");
}
