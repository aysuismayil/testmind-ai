import type { QAReport, TestCase } from "@/lib/types";

/**
 * Local mock AI provider.
 *
 * Produces deterministic, realistic-looking QA documentation from a plain
 * text requirement without calling any external service. This lets the
 * whole application run and be demoed with zero configuration.
 */

let counter = 0;
function nextId(prefix: string): string {
  counter += 1;
  return `${prefix}-${counter.toString(36)}`;
}

function firstSentence(text: string): string {
  const clean = text.trim().replace(/\s+/g, " ");
  const match = clean.match(/^[^.!?\n]{5,140}[.!?]?/);
  return (match ? match[0] : clean.slice(0, 80)).trim();
}

function deriveTitle(text: string): string {
  const line = text
    .split("\n")
    .map((l) => l.trim())
    .find((l) => l.length > 0);
  const candidate = line ? firstSentence(line) : "Untitled requirement";
  return candidate.length > 70 ? `${candidate.slice(0, 67)}...` : candidate;
}

const KEYWORD_LIBRARY: Array<{
  keywords: string[];
  scenarios: string[];
  positive: string[];
  negative: string[];
  edge: string[];
  api: string[];
  risks: string[];
}> = [
  {
    keywords: ["login", "log in", "sign in", "authenticate", "password"],
    scenarios: [
      "User logs in with valid credentials",
      "User is locked out after repeated failed login attempts",
    ],
    positive: [
      "Log in with a valid, registered email and correct password",
      "Successfully log in and land on the expected post-login page",
    ],
    negative: [
      "Attempt login with an incorrect password and verify a generic error message",
      "Attempt login with an unregistered email address",
    ],
    edge: [
      "Password field with maximum allowed length and special characters",
      "Login attempt while session token from a previous session is still valid",
    ],
    api: [
      "POST /auth/login with valid credentials returns 200 and a session/token",
      "POST /auth/login with invalid credentials returns 401 without leaking which field was wrong",
      "Repeated failed POST /auth/login calls trigger rate limiting (429)",
    ],
    risks: [
      "Account lockout logic could allow brute-force attacks if not rate limited correctly",
      "Error messages might leak whether an email exists in the system",
    ],
  },
  {
    keywords: ["email", "e-mail"],
    scenarios: ["User enters an email address that requires validation"],
    positive: ["Submit a valid, correctly formatted email address"],
    negative: [
      "Submit an email address missing the @ symbol",
      "Submit an email address with an invalid or missing domain",
    ],
    edge: [
      "Email address at the maximum allowed character length",
      "Email address containing a plus alias (e.g. user+test@example.com)",
    ],
    api: [
      "Server-side validation rejects malformed email addresses even if the client validation is bypassed",
    ],
    risks: ["Client-only email validation could be bypassed via direct API calls"],
  },
  {
    keywords: ["upload", "attachment", "file"],
    scenarios: ["User uploads a file as part of the flow"],
    positive: ["Upload a supported file type within the allowed size limit"],
    negative: [
      "Attempt to upload a file with an unsupported extension",
      "Attempt to upload a file larger than the maximum allowed size",
    ],
    edge: [
      "Upload a file at exactly the maximum allowed size",
      "Upload a file with a very long file name or special characters in the name",
      "Cancel an upload mid-transfer and retry",
    ],
    api: [
      "POST /upload rejects files exceeding the configured size limit with a clear error code",
      "POST /upload sanitizes file names before storing them",
    ],
    risks: [
      "Insufficient file type validation could allow malicious file uploads",
      "Large file uploads without size limits could impact server performance",
    ],
  },
  {
    keywords: ["payment", "checkout", "credit card", "billing", "invoice"],
    scenarios: ["User completes a purchase and payment is processed"],
    positive: ["Complete checkout with a valid payment method and correct billing details"],
    negative: [
      "Attempt payment with an expired or invalid card",
      "Attempt checkout with insufficient funds",
    ],
    edge: [
      "Network interruption occurs right after payment is charged but before confirmation is shown",
      "User double-clicks the pay button to check for duplicate charges",
    ],
    api: [
      "POST /checkout is idempotent so retried requests do not create duplicate charges",
      "Payment webhook/callback handling is verified for signature authenticity",
    ],
    risks: [
      "Duplicate submissions could cause double charges without idempotency handling",
      "Sensitive payment data must never be logged or stored in plain text",
    ],
  },
  {
    keywords: ["search", "filter", "sort"],
    scenarios: ["User searches or filters a list of results"],
    positive: ["Search using a keyword that matches existing results"],
    negative: ["Search using a keyword that matches no results"],
    edge: [
      "Search with special characters, emojis, or SQL-like input",
      "Apply multiple filters simultaneously that may conflict",
    ],
    api: [
      "GET /search returns paginated results and respects query parameters",
      "GET /search sanitizes input to prevent injection attacks",
    ],
    risks: ["Unsanitized search input could expose the system to injection attacks"],
  },
  {
    keywords: ["notification", "email alert", "sms", "push notification"],
    scenarios: ["User receives a notification triggered by an event"],
    positive: ["Trigger the event and confirm the notification is delivered promptly"],
    negative: ["Trigger the event when the notification channel is unavailable or misconfigured"],
    edge: [
      "User has disabled notifications but the triggering event still occurs",
      "Multiple triggering events occur in rapid succession",
    ],
    api: [
      "Notification service endpoint retries on transient failures without duplicating messages",
    ],
    risks: ["Notification delivery failures may go unnoticed without monitoring or retries"],
  },
];

const GENERIC_SCENARIOS = [
  "Primary happy path described in the requirement completes successfully end to end",
  "User attempts the flow with missing required inputs",
  "User attempts the flow with the minimum and maximum allowed input boundaries",
  "Concurrent users perform the same action at the same time",
];

function collectByKeyword<T extends "scenarios" | "positive" | "negative" | "edge" | "api" | "risks">(
  input: string,
  field: T
): string[] {
  const lower = input.toLowerCase();
  const results: string[] = [];
  for (const entry of KEYWORD_LIBRARY) {
    if (entry.keywords.some((k) => lower.includes(k))) {
      results.push(...entry[field]);
    }
  }
  return results;
}

function makeTestCase(
  title: string,
  steps: string[],
  expectedResult: string,
  priority: TestCase["priority"] = "Medium",
  preconditions?: string
): TestCase {
  return {
    id: nextId("tc"),
    title,
    preconditions,
    steps,
    expectedResult,
    priority,
  };
}

function buildTestCases(input: string, title: string): {
  testCases: TestCase[];
  positiveTests: TestCase[];
  negativeTests: TestCase[];
  edgeCases: TestCase[];
} {
  const keywordPositive = collectByKeyword(input, "positive");
  const keywordNegative = collectByKeyword(input, "negative");
  const keywordEdge = collectByKeyword(input, "edge");

  const positiveTests: TestCase[] = [
    makeTestCase(
      `Verify "${title}" works with valid input`,
      [
        "Navigate to the relevant screen or endpoint described in the requirement",
        "Provide valid input that satisfies all stated acceptance criteria",
        "Submit / trigger the action",
      ],
      "The action completes successfully and the system reflects the expected state",
      "High",
      "User has access to the feature and any required test data exists"
    ),
    ...keywordPositive.slice(0, 3).map((p) =>
      makeTestCase(
        p,
        ["Set up the required preconditions", "Perform the described positive action", "Observe the result"],
        "The system behaves as expected with no errors and correct output",
        "High"
      )
    ),
  ];

  const negativeTests: TestCase[] = [
    makeTestCase(
      `Verify "${title}" rejects invalid input gracefully`,
      [
        "Navigate to the relevant screen or endpoint",
        "Provide invalid, incomplete, or malformed input",
        "Submit / trigger the action",
      ],
      "The system rejects the input with a clear, user-friendly error message and no data corruption",
      "High"
    ),
    ...keywordNegative.slice(0, 3).map((n) =>
      makeTestCase(
        n,
        ["Set up the scenario", "Perform the described negative action", "Observe the system response"],
        "The system prevents the action and communicates the problem clearly without crashing",
        "Medium"
      )
    ),
  ];

  const edgeCases: TestCase[] = [
    makeTestCase(
      `Boundary values for "${title}"`,
      [
        "Identify the min/max boundaries implied by the requirement",
        "Test at, just below, and just above each boundary",
      ],
      "The system correctly handles all boundary values without unexpected errors",
      "Medium"
    ),
    ...keywordEdge.slice(0, 3).map((e) =>
      makeTestCase(
        e,
        ["Set up the edge condition", "Perform the action under that condition", "Observe the outcome"],
        "The system handles the edge case gracefully without data loss or crashes",
        "Medium"
      )
    ),
    makeTestCase(
      "Behavior under slow network / offline conditions",
      ["Throttle or disconnect the network", "Attempt the primary action", "Restore connectivity"],
      "The system shows appropriate loading/error states and recovers cleanly once connectivity returns",
      "Low"
    ),
  ];

  const testCases: TestCase[] = [...positiveTests.slice(0, 2), ...negativeTests.slice(0, 2), ...edgeCases.slice(0, 1)];

  return { testCases, positiveTests, negativeTests, edgeCases };
}

function buildChecklist(base: string[], extra: string[], max: number): string[] {
  const merged = [...base, ...extra];
  return Array.from(new Set(merged)).slice(0, max);
}

export function generateMockReport(input: string): QAReport {
  const title = deriveTitle(input);
  const keywordScenarios = collectByKeyword(input, "scenarios");
  const keywordApi = collectByKeyword(input, "api");
  const keywordRisks = collectByKeyword(input, "risks");

  const { testCases, positiveTests, negativeTests, edgeCases } = buildTestCases(input, title);

  const testScenarios = Array.from(
    new Set([
      `As a user, I want to: ${firstSentence(input)}`,
      ...keywordScenarios,
      ...GENERIC_SCENARIOS,
    ])
  ).slice(0, 8);

  const smokeChecklist = [
    "The feature loads without console errors or crashes",
    "The primary happy path can be completed end to end",
    "Navigation to and from the feature works correctly",
    "No blocking visual/layout issues on the main breakpoints",
  ];

  const regressionChecklist = [
    "Existing related features still function after this change",
    "Previously fixed bugs in this area have not regressed",
    "Data created before this change still displays and behaves correctly",
    "Integrations / dependent features are unaffected",
    "Performance has not visibly degraded",
  ];

  const apiTestIdeas = Array.from(
    new Set([
      "Validate request/response schema for all relevant endpoints",
      "Verify authentication/authorization is enforced on protected endpoints",
      "Verify appropriate HTTP status codes for success and error cases",
      "Verify rate limiting / throttling behavior if applicable",
      ...keywordApi,
    ])
  ).slice(0, 8);

  const accessibilityChecklist = [
    "All interactive elements are reachable and operable via keyboard alone",
    "Form fields have associated, descriptive labels",
    "Color is not the only way information is conveyed (sufficient contrast, icons/text too)",
    "Screen readers announce dynamic content changes (e.g. via ARIA live regions)",
    "Focus order is logical and visible focus indicators are present",
    "Text meets WCAG AA contrast ratio against its background",
  ];

  const clarificationQuestions = [
    "What should happen if the user's session expires mid-flow?",
    "Are there specific validation rules (length, format, allowed characters) not mentioned in the requirement?",
    "What is the expected behavior on slow networks or partial failures?",
    "Who has permission to perform this action, and are there role-based restrictions?",
    "Is there an audit/logging requirement for this action?",
  ];

  const riskAreas = Array.from(
    new Set([
      "Ambiguous or incomplete acceptance criteria could lead to differing interpretations",
      "Error handling and messaging are often under-specified and under-tested",
      ...keywordRisks,
    ])
  ).slice(0, 6);

  const missingRequirements = [
    "Explicit error messages/copy for failure scenarios",
    "Performance or load expectations (e.g. response time under X seconds)",
    "Localization / internationalization requirements, if any",
    "Analytics or tracking events expected from this feature",
    "Explicit accessibility requirements",
  ];

  const now = new Date().toISOString();

  return {
    id: nextId("report"),
    createdAt: now,
    title,
    input,
    summary: `Mock QA analysis generated locally for: "${title}". This report was produced by the offline mock AI provider because no OpenAI API key was configured.`,
    testScenarios,
    testCases,
    positiveTests,
    negativeTests,
    edgeCases,
    smokeChecklist: buildChecklist(smokeChecklist, [], 6),
    regressionChecklist: buildChecklist(regressionChecklist, [], 8),
    apiTestIdeas,
    accessibilityChecklist,
    clarificationQuestions,
    riskAreas,
    missingRequirements,
    meta: {
      provider: "mock",
      generatedAt: now,
    },
  };
}
