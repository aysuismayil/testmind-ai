import { generateMockReport } from "@/lib/ai/mock-provider";
import { reportToMarkdown } from "@/lib/export/markdown";
import { reportToJson } from "@/lib/export/json";

describe("export utilities", () => {
  const report = generateMockReport("As a user, I want to search for products by keyword.");

  it("reportToMarkdown includes the title and all major sections", () => {
    const md = reportToMarkdown(report);
    expect(md).toContain(`# ${report.title}`);
    expect(md).toContain("## Test Scenarios");
    expect(md).toContain("## Test Cases");
    expect(md).toContain("## Smoke Testing Checklist");
    expect(md).toContain("## Regression Testing Checklist");
    expect(md).toContain("## API Testing Ideas");
    expect(md).toContain("## Accessibility Testing Checklist");
    expect(md).toContain("## Clarification Questions");
    expect(md).toContain("## Risk Areas");
    expect(md).toContain("## Missing Requirements");
  });

  it("reportToJson produces valid, parseable JSON with the same id", () => {
    const json = reportToJson(report);
    const parsed = JSON.parse(json);
    expect(parsed.id).toBe(report.id);
    expect(parsed.title).toBe(report.title);
  });
});
