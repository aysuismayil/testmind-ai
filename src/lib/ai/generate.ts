import type { QAReport } from "@/lib/types";
import { generateMockReport } from "@/lib/ai/mock-provider";
import { generateOpenAIReport } from "@/lib/ai/openai-provider";

export function isOpenAIConfigured(): boolean {
  return Boolean(process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY.trim().length > 0);
}

/**
 * Generates a QA report using OpenAI when an API key is configured, and
 * transparently falls back to the local mock provider if the key is missing
 * or the API call fails for any reason. This guarantees the app always works.
 */
export async function generateReport(input: string): Promise<QAReport> {
  if (!isOpenAIConfigured()) {
    return generateMockReport(input);
  }

  try {
    return await generateOpenAIReport(input);
  } catch (error) {
    const fallback = generateMockReport(input);
    fallback.meta.fallbackReason =
      error instanceof Error ? error.message : "Unknown error calling OpenAI";
    return fallback;
  }
}
