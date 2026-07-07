# Code Review Guidelines

Rules for reviewing pull requests in this repository. They encode the project conventions from `CLAUDE.md`, `apps/api/CLAUDE.md`, and `apps/web/CLAUDE.md` — when in doubt, those files are the source of truth.

## Review priorities

Review in this order; a correctness problem outweighs any style note:

1. **Correctness** — bugs, broken auth, unvalidated input, wrong status codes
2. **Security** — cookie/JWT handling, secrets, data leaking across users
3. **Architecture** — code in the right layer (controller vs service, shared packages)
4. **Consistency** — follows the module/DI/route patterns already in the codebase
5. **Style** — only what Biome cannot catch; never argue about formatting Biome already enforces

## Process checklist

- [ ] Branch follows GitHub Flow: short-lived, descriptively named, branched off `main` (e.g. `feat/categories-crud`, `fix/auth-cookie-expiry`)
- [ ] Every commit follows [Conventional Commits 1.0.0](https://www.conventionalcommits.org/en/v1.0.0/): `<type>[scope]: <description>` — imperative, lowercase, no trailing period; body explains *why*, not *what*
- [ ] Breaking changes are marked with `!` and/or a `BREAKING CHANGE:` footer
- [ ] `pnpm build`, `pnpm lint`, and `pnpm test` pass
- [ ] Formatting is Biome (`pnpm format`) — 2-space indent, single quotes, semicolons, trailing commas, 100-char lines. Do not hand-review these; run the tool

## Monorepo boundaries

- [ ] Shared TypeScript interfaces and DTOs live in `packages/types` (`@repo/types`), not duplicated in an app
- [ ] Zod schemas and inferred input types live in `packages/validation` (`@repo/validation`); the API must not define its own request schemas
- [ ] Constants and API route strings come from `packages/config` (`@repo/config`) — no hardcoded route strings in either app
- [ ] New workspaces extend a base tsconfig from `packages/tsconfig`
- [ ] No cross-app imports (`apps/web` importing from `apps/api` or vice versa) — share through packages only

## API (`apps/api`)

### Structure & DI

- [ ] New code follows the module layout: `src/modules/<domain>/<domain>.controller.ts` + `<domain>.service.ts`
- [ ] Controllers only declare routes (`@controller`, `@httpGet`, …), inject services via `@inject(TYPES.X)`, and apply middleware — **no business logic or DB access in controllers**
- [ ] Services are `@injectable()`, own all business logic and DB access via Typegoose models in `src/models/`
- [ ] Every new injectable has a `Symbol.for(...)` token in `src/container/types.ts` and a binding in `src/container/container.ts` (services as singletons)
- [ ] New controllers are imported in `src/app.ts` — otherwise their routes silently never register

### Auth & security

- [ ] Protected routes apply `AuthMiddleware` per-route or per-controller; handlers read the user from `req.user` (typed via `src/types/express.d.ts`), never re-decode the JWT themselves
- [ ] JWT stays in the `httpOnly` cookie `accessToken` with payload `{ sub: userId, email }` — never returned in a response body or moved to localStorage
- [ ] Queries on user-owned data (expenses, categories, budgets) are always scoped by the authenticated user's id — flag any find/update/delete that could touch another user's documents
- [ ] No secrets in code or logs; new env vars are added to the docs in `apps/api/CLAUDE.md` and validated in `src/config/env.ts` if required at startup

### Validation & errors

- [ ] Every route that accepts a body uses `validateBody(schema)` with a schema from `@repo/validation` — no manual `req.body` checks, no unvalidated body access
- [ ] Errors are thrown as `HttpError(statusCode, message)` and left to `errorMiddleware` — no ad-hoc `res.status(...).json(...)` error responses, no swallowed errors
- [ ] Error responses keep the `{ success: false, error: { message } }` envelope; messages don't leak internals (stack traces, Mongo errors, whether an email exists)

## Web (`apps/web`)

- [ ] Client-side API calls go through `apiFetch` in `src/lib/api-client.ts` (sends `credentials: 'include'`, uses `NEXT_PUBLIC_API_URL`) — no raw `fetch` to the API from components
- [ ] Route Handlers that talk to the API use the server-side `API_URL` env var and forward `Set-Cookie` headers (cookie-relay pattern in `app/api/auth/`) — never `NEXT_PUBLIC_API_URL` on the server
- [ ] Server Components needing the current user call `getCurrentUser()` / `isAuthenticated()` from `src/lib/auth.ts` instead of a client round-trip
- [ ] New protected pages are added to **both** `PROTECTED_PATHS` and the `matcher` in `src/middleware.ts` — these must stay in sync
- [ ] UI uses Radix Themes components and props — **no Tailwind classes**, no new CSS frameworks
- [ ] Auth pages stay under `(auth)/`, feature pages under `(dashboard)/` and gated by its layout

## Tests

- [ ] New or changed service logic in the API has Jest coverage (`pnpm --filter api test`)
- [ ] Tests exercise behavior (input → output, thrown `HttpError`s), not implementation details
- [ ] Replacing a `501 Not Implemented` stub with real logic requires tests for the new behavior

## Giving feedback

- Tie every comment to a rule here, a project `CLAUDE.md`, or a concrete bug — not personal taste
- Distinguish **blocking** (correctness, security, architecture violations) from **nit:** (optional polish)
- Suggest the fix, not just the problem; reference the existing pattern to copy (file + module)
- Approve when only nits remain

## Missing

 - *.lock file changes