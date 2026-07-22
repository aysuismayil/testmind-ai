# Contributing to TestMind AI

Thanks for your interest in contributing! TestMind AI is an open-source project and
contributions of all sizes are welcome, from typo fixes to new features.

## Getting started

1. Fork the repository and clone your fork.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy the environment file (optional — the app works without it):
   ```bash
   cp .env.example .env.local
   ```
4. Start the dev server:
   ```bash
   npm run dev
   ```
5. Open http://localhost:3000.

No OpenAI API key is required to develop or test the app locally. When
`OPENAI_API_KEY` is not set, TestMind AI automatically uses a local mock AI
provider so all features remain fully testable offline.

## Development workflow

Before opening a pull request, please make sure the following all pass:

```bash
npm run lint       # ESLint
npm run typecheck  # TypeScript (tsc --noEmit)
npm run test       # Jest unit tests
npm run build      # Production build
```

## Project structure

- `src/app` — Next.js App Router pages (landing, generator, results, history, about, API routes).
- `src/components` — Reusable UI components.
- `src/lib/ai` — AI provider logic (mock provider, OpenAI provider, orchestration).
- `src/lib/storage` — localStorage-backed history and current-report persistence.
- `src/lib/export` — Markdown / JSON export helpers.
- `__tests__` — Jest unit and component tests.

## Commit style

Use clear, descriptive commit messages. Conventional Commits (e.g.
`feat: add regression checklist export`) are encouraged but not required.

## Pull requests

- Keep pull requests focused on a single change where possible.
- Add or update tests for any behavioral change.
- Update documentation (README, comments) when relevant.
- Describe what you changed and why in the PR description.

## Reporting bugs & requesting features

Please open a GitHub issue with as much detail as possible: steps to
reproduce, expected vs. actual behavior, and screenshots if relevant for UI
issues.

## Code of conduct

Be respectful and constructive. We want TestMind AI to be a welcoming project
for contributors of all experience levels.
