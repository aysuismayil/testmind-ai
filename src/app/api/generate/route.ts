import { NextResponse } from "next/server";
import { generateReport } from "@/lib/ai/generate";
import type { GenerateRequestBody, GenerateResponseBody } from "@/lib/types";

export const runtime = "nodejs";

const MAX_INPUT_LENGTH = 12000;

export async function POST(request: Request): Promise<NextResponse<GenerateResponseBody>> {
  let body: GenerateRequestBody;
  try {
    body = (await request.json()) as GenerateRequestBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const input = typeof body.input === "string" ? body.input.trim() : "";

  if (!input) {
    return NextResponse.json({ error: "Please provide a requirement to analyze." }, { status: 400 });
  }

  if (input.length > MAX_INPUT_LENGTH) {
    return NextResponse.json(
      { error: `Requirement is too long (max ${MAX_INPUT_LENGTH} characters).` },
      { status: 400 }
    );
  }

  try {
    const report = await generateReport(input);
    return NextResponse.json({ report }, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: `Failed to generate report: ${message}` }, { status: 500 });
  }
}
