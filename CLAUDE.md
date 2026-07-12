# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

Each app has its own `CLAUDE.md` with app-specific guidance:

- `apps/api/CLAUDE.md` — Express REST API (request lifecycle, DI, auth, validation, errors)
- `apps/web/CLAUDE.md` — Next.js frontend (web → API communication, routes)

## Commands

```bash
# Development
pnpm dev              # start both apps via Turborepo (web: :3000, api: :4000)
docker compose up -d  # start MongoDB (:27017) and mongo-express (:8081)

# Build / lint / test (all workspaces)
pnpm build
pnpm lint
pnpm test
pnpm format           # Biome formatter
```

## Architecture

### Monorepo layout

- `apps/api` — Express REST API, TypeScript, InversifyJS DI, Typegoose/MongoDB
- `apps/web` — Next.js 16 App Router frontend, Radix Themes (no Tailwind)
- `packages/types` — shared TypeScript interfaces and DTOs (`@repo/types`)
- `packages/validation` — Zod schemas and inferred input types (`@repo/validation`)
- `packages/config` — shared constants and API route strings (`@repo/config`)
- `packages/tsconfig` — base tsconfigs extended by all workspaces

Turbo runs tasks in dependency order. `dev` is `persistent` (long-running) with no cache.

<important if="When you need to open a pull request">
## Pull request conventions

- **Title**: follow the same [Conventional Commits 1.0.0](https://www.conventionalcommits.org/en/v1.0.0/) format used for commit messages — `<type>[optional scope]: <description>`. When the branch has multiple commits, pick the type/scope that best represents the overall change.
- **Description**: derive it from the full set of changes on the branch — every file changed or previously committed on the branch, not only the latest commit. Read the entire diff (`git diff <base-branch>...HEAD`) and the branch's commit log before writing it. Structure it as:
  - **Summary**: a short bulleted list explaining *why* the change was made, synthesized across all commits and files in the diff
  - **Test plan**: a checklist of what should be verified (manual steps, tests to run)
- Do not just copy the last commit message into the PR description.
</important>

## Branching workflow

Follow [GitHub Flow](https://docs.github.com/en/get-started/using-github/github-flow):

- `main` is always deployable
- Create a short-lived, descriptively named branch off `main` for any change (e.g. `feat/categories-crud`, `fix/auth-cookie-expiry`)
- Open a pull request early for discussion; merge to `main` via PR once reviewed and checks pass
- Delete the branch after merging

## Current status

The scaffold is complete but all business logic is stubbed with `TODO` comments and `501 Not Implemented` responses. Models, middleware, DI wiring, and validation are all in place.
