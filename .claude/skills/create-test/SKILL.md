---
name: create-test
description: Write a test file for a given source file in this repo. Use when the user asks to add, create, or write tests for a specific file.
argument-hint: [file-path]
allowed-commands: Bash(gh *)
---

# Create Test

Write a test for the source file passed as an argument, matching this repo's existing test conventions.

## Arguments

- `$0` (required): path to the source file to test (relative to the repo root, e.g. `apps/api/src/utils/password.ts`).

## Steps

1. Read the target file (`$0`) to understand what it exports and what behavior needs covering.
2. Determine which app it belongs to:
   - **`apps/api`**: tests live in `apps/api/tests/`, mirroring the `src/` path, named `<name>.test.ts` (e.g. `src/utils/password.ts` → `tests/utils/password.test.ts`). Uses Jest (`ts-jest`, `testEnvironment: node`) — see `apps/api/jest.config.ts` and `apps/api/tests/password.test.ts` for the existing style: plain `describe`/`it` blocks, relative imports from `../src/...`, no test doubles unless the unit under test needs one.
   - **`apps/web`**: no test runner is configured yet (no Jest/Vitest config, no `test` script in `apps/web/package.json`). Do not invent test tooling silently — stop and ask the user how they want to set it up before writing a test file here.
3. Check for an existing test file at the expected path; if one exists, extend it rather than overwriting, unless the user asked for a rewrite.
4. Skim 1-2 neighboring test files (if any) for this module/domain to match naming and assertion style.
5. Write focused tests covering the file's actual behavior — success paths, documented edge cases, and error paths thrown via `HttpError` or validation, if present. Don't test framework internals or trivial getters.
6. Run the test to confirm it passes:
   ```bash
   pnpm --filter api test -- --testPathPattern=<name>
   ```
7. Report the created/updated file path and the test run result.

## Rules

- Don't mock what you don't have to — prefer exercising real logic (see the root `CLAUDE.md` guidance against unnecessary abstraction/complexity).
- If the target file has no clear exported behavior to test (e.g. a pure type file, a config file), say so instead of fabricating a trivial test.
- Match existing formatting/lint rules (Biome) — run `pnpm --filter api lint` if unsure about style.
