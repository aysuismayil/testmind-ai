import { generateReport, isOpenAIConfigured } from "@/lib/ai/generate";

describe("generateReport", () => {
  const originalKey = process.env.OPENAI_API_KEY;

  afterEach(() => {
    if (originalKey === undefined) {
      delete process.env.OPENAI_API_KEY;
    } else {
      process.env.OPENAI_API_KEY = originalKey;
    }
  });

  it("reports OpenAI as not configured when no key is set", () => {
    delete process.env.OPENAI_API_KEY;
    expect(isOpenAIConfigured()).toBe(false);
  });

  it("reports OpenAI as configured when a key is set", () => {
    process.env.OPENAI_API_KEY = "sk-test-123";
    expect(isOpenAIConfigured()).toBe(true);
  });

  it("falls back to the mock provider when no API key is configured", async () => {
    delete process.env.OPENAI_API_KEY;
    const report = await generateReport("As a user, I want to log out of the application.");
    expect(report.meta.provider).toBe("mock");
    expect(report.testCases.length).toBeGreaterThan(0);
  });
});
