import { generateMockReport } from "@/lib/ai/mock-provider";

describe("generateMockReport", () => {
  it("produces a fully-populated QA report shape", () => {
    const report = generateMockReport(
      "As a user, I want to log in with my email and password so that I can access my account."
    );

    expect(report.id).toBeTruthy();
    expect(report.title).toBeTruthy();
    expect(report.summary).toContain("Mock QA analysis");
    expect(report.meta.provider).toBe("mock");

    expect(Array.isArray(report.testScenarios)).toBe(true);
    expect(report.testScenarios.length).toBeGreaterThan(0);

    expect(report.testCases.length).toBeGreaterThan(0);
    expect(report.positiveTests.length).toBeGreaterThan(0);
    expect(report.negativeTests.length).toBeGreaterThan(0);
    expect(report.edgeCases.length).toBeGreaterThan(0);

    expect(report.smokeChecklist.length).toBeGreaterThan(0);
    expect(report.regressionChecklist.length).toBeGreaterThan(0);
    expect(report.apiTestIdeas.length).toBeGreaterThan(0);
    expect(report.accessibilityChecklist.length).toBeGreaterThan(0);
    expect(report.clarificationQuestions.length).toBeGreaterThan(0);
    expect(report.riskAreas.length).toBeGreaterThan(0);
    expect(report.missingRequirements.length).toBeGreaterThan(0);
  });

  it("tailors content based on keywords like login/password", () => {
    const report = generateMockReport("Users must log in with a password before accessing the dashboard.");
    const joined = JSON.stringify(report).toLowerCase();
    expect(joined).toContain("login");
  });

  it("every test case has steps and an expected result", () => {
    const report = generateMockReport("As a user I want to upload a profile picture file.");
    for (const tc of [...report.testCases, ...report.positiveTests, ...report.negativeTests, ...report.edgeCases]) {
      expect(tc.steps.length).toBeGreaterThan(0);
      expect(tc.expectedResult).toBeTruthy();
      expect(["High", "Medium", "Low"]).toContain(tc.priority);
    }
  });

  it("derives a short title from the input", () => {
    const report = generateMockReport("Feature: Checkout\n\nAs a user, I want to pay for my order.");
    expect(report.title.length).toBeLessThanOrEqual(70);
  });
});
