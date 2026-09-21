# TestMind AI

**Turn requirements into practical test coverage.**

> **What this repo is:** a QA-process and QA-tooling portfolio piece. It demonstrates how I think about turning requirements into test coverage, and it happens to be packaged as a small working app I built myself (Next.js/TypeScript/Jest/CI) rather than a set of manual test documents. The "testing" it does for you is AI-generated QA documentation, not automated execution against a real product — see the Tech stack and Project structure sections below for what's actually implemented and covered by Jest.


TestMind AI is an open-source, AI-powered QA assistant. Paste a User Story,
Acceptance Criteria, PRD excerpt, or feature description, click **Generate**,
and get structured, practical QA documentation in seconds:

- Test Scenarios
- Detailed Test Cases
- Positive Tests
- Negative Tests
- Edge Cases
- Smoke Testing Checklist
- Regression Testing Checklist
- API Testing Ideas
- Accessibility Testing Checklist
- Clarification Questions
- Risk Areas
- Missing Requirements

Results can be copied, edited in place, and exported as **Markdown** or **JSON**.
Every generation is saved to a local history so you can revisit it later.

TestMind AI works **fully offline, with zero configuration**: if no OpenAI API
key is configured, it automatically falls back to a local mock AI provider
that produces realistic, deterministic QA documentation.

## Features

- 🧠 AI-powered analysis via the OpenAI API, with a realistic local mock
  provider fallback (no API key required to run the app).
- 📝 Structured output covering scenarios, test cases, checklists, API ideas,
  accessibility, clarifications, risks, and missing requirements.
- ✏️ Copy, edit (as Markdown), and download results as `.md` or `.json`.
- 🕘 Local history of past generations, stored in your browser (`localStorage`).
- 🌓 Light / dark mode with system preference detection.
- ♿ Accessible, keyboard-friendly, responsive UI built with Tailwind CSS.
- ✅ Type-safe (TypeScript), linted, and covered by Jest unit tests.

## Tech stack

- [Next.js](https://nextjs.org/) (App Router) + React + TypeScript
- [Tailwind CSS](https://tailwindcss.com/) v4
- [OpenAI API](https://platform.openai.com/) (optional)
- Jest + React Testing Library
- Docker + GitHub Actions CI

## Getting started

### Prerequisites

- Node.js 18.18+ (Node 20+ recommended)
- npm

### Installation

```bash
git clone https://github.com/aysuismayil/testmind-ai.git
cd testmind-ai
npm install
```

### Running locally (no API key needed)

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The app works
immediately using the local mock AI provider — no signup, no API key.

### Adding an OpenAI API key (optional)

To use real OpenAI-generated QA reports instead of the mock provider:

1. Copy the example environment file:
   ```bash
   cp .env.example .env.local
   ```
2. Open `.env.local` and set your key:
   ```bash
   OPENAI_API_KEY=sk-your-key-here
   OPENAI_MODEL=gpt-4o-mini
   ```
3. Restart the dev server. TestMind AI will now call the OpenAI API, and will
   automatically fall back to the mock provider if the request ever fails.

### Available scripts

```bash
npm run dev         # Start the development server
npm run build       # Production build
npm run start       # Start the production server (after build)
npm run lint        # Run ESLint
npm run typecheck   # Run the TypeScript compiler (no emit)
npm run test        # Run Jest unit tests
npm run test:watch  # Run Jest in watch mode
```

### Running with Docker

```bash
docker build -t testmind-ai .
docker run -p 3000:3000 testmind-ai
# optionally, with an OpenAI key:
docker run -p 3000:3000 -e OPENAI_API_KEY=sk-your-key-here testmind-ai
```

## Project structure

```
src/
  app/
    page.tsx              # Landing page
    generator/page.tsx     # Generator page (paste requirement, click Generate)
    results/page.tsx       # Results page (structured view + markdown editor)
    history/page.tsx       # History page (saved generations)
    about/page.tsx         # About page
    api/generate/route.ts  # API route: OpenAI or mock provider
  components/               # Reusable UI components
  lib/
    ai/                     # Mock provider, OpenAI provider, orchestration
    storage/                # localStorage history + current report
    export/                 # Markdown / JSON export helpers
__tests__/                  # Jest unit + component tests
.github/workflows/ci.yml    # GitHub Actions CI (lint, typecheck, test, build)
Dockerfile
.env.example
```

## How generation works

1. You paste a requirement and click **Generate**.
2. The client calls the `POST /api/generate` API route.
3. If `OPENAI_API_KEY` is set, the route calls the OpenAI Chat Completions API
   with a structured JSON schema prompt.
4. If no key is set, or the OpenAI call fails for any reason, the route falls
   back to a local, deterministic mock provider — so the app always works.
5. The structured report is returned, saved to local history, and rendered on
   the Results page.

## Contributing

Contributions are welcome! Please see [CONTRIBUTING.md](./CONTRIBUTING.md) for
guidelines on setting up your environment, running checks, and submitting
pull requests.

## License

Released under the [MIT License](./LICENSE).
