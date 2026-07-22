export const SYSTEM_PROMPT = `You are TestMind AI, an expert QA engineer and test architect.
Given a user story, acceptance criteria, PRD excerpt, or feature description, you produce
thorough, practical QA documentation as strict JSON matching the schema you are given.
Be specific to the input rather than generic. Do not include markdown formatting inside
JSON string values. Respond with JSON only, no prose outside the JSON object.`;

export function buildUserPrompt(input: string): string {
  return `Analyze the following requirement and produce a JSON object with EXACTLY these keys:

- "title": short descriptive title (string)
- "summary": 1-3 sentence summary of what will be tested (string)
- "testScenarios": string[] (high level scenarios)
- "testCases": array of { "title": string, "preconditions": string, "steps": string[], "expectedResult": string, "priority": "High"|"Medium"|"Low" } (detailed, most important cases)
- "positiveTests": array of test case objects (same shape as testCases), happy-path cases
- "negativeTests": array of test case objects, invalid/failure cases
- "edgeCases": array of test case objects, boundary/unusual conditions
- "smokeChecklist": string[]
- "regressionChecklist": string[]
- "apiTestIdeas": string[]
- "accessibilityChecklist": string[]
- "clarificationQuestions": string[]
- "riskAreas": string[]
- "missingRequirements": string[]

Requirement:
"""
${input}
"""

Return ONLY valid JSON, no markdown code fences.`;
}
