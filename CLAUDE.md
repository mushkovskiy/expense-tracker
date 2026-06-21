# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

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

# API only
pnpm --filter api test              # run all API tests
pnpm --filter api test -- --testPathPattern=password  # run a single test file
pnpm --filter api build             # tsc compile to dist/
```

## Architecture

### Monorepo layout

- `apps/api` — Express REST API, TypeScript, InversifyJS DI, Typegoose/MongoDB
- `apps/web` — Next.js 16 App Router frontend, Tailwind CSS
- `packages/types` — shared TypeScript interfaces and DTOs (`@repo/types`)
- `packages/validation` — Zod schemas and inferred input types (`@repo/validation`)
- `packages/config` — shared constants and API route strings (`@repo/config`)
- `packages/tsconfig` — base tsconfigs extended by all workspaces

Turbo runs tasks in dependency order. `dev` is `persistent` (long-running) with no cache.

### API request lifecycle

1. `src/server.ts` — reads `.env`, connects to MongoDB, starts the HTTP server
2. `src/app.ts` — builds the InversifyExpressServer; imports all controllers so their decorators register routes; mounts global `errorMiddleware`
3. Controllers (`src/modules/<domain>/<domain>.controller.ts`) — declare routes via `inversify-express-utils` decorators (`@controller`, `@httpGet`, etc.), inject services via `@inject(TYPES.X)`, apply middleware per-route or per-controller
4. Services (`src/modules/<domain>/<domain>.service.ts`) — `@injectable()` classes bound in `src/container/container.ts`; own all business logic and DB access via Typegoose models in `src/models/`

### DI container (`src/container/`)

- `types.ts` — `TYPES` object of `Symbol.for(...)` tokens; add a new token here for every new injectable
- `container.ts` — all bindings in one place; services are singletons, `AuthMiddleware` is bound with `.toSelf()`

### Adding a new module

1. Create `src/modules/<domain>/<domain>.service.ts` (`@injectable()`) and `<domain>.controller.ts` (`@controller('/path', ...)`)
2. Add a token to `TYPES` and bind the service in `container.ts`
3. Import the controller in `app.ts` so its decorators run at startup
4. Add Zod schemas to `packages/validation` and types to `packages/types` if shared with the frontend

### Authentication

- JWT issued as `httpOnly` cookie named `accessToken`; payload shape is `{ sub: userId, email }`
- `AuthMiddleware` (`src/middleware/auth.middleware.ts`) extends `BaseMiddleware`, verifies the cookie, and attaches the decoded payload to `req.user`
- Apply it per-route (`@httpGet('/me', AuthMiddleware)`) or per-controller (`@controller('/expenses', AuthMiddleware)`)
- `req.user` type is augmented in `src/types/express.d.ts`

### Validation

`validateBody(schema)` middleware (in `src/middleware/validate.middleware.ts`) runs Zod `.safeParse` on `req.body` and replaces it with the parsed data, so controllers receive typed, coerced input. Always use schemas from `@repo/validation`.

### Error handling

Throw `HttpError(statusCode, message)` from services or controllers; `errorMiddleware` catches it and returns `{ success: false, error: { message } }`. Unrecognised errors produce a 500.

### Web → API communication

- Client-side: `src/lib/api-client.ts` (`apiFetch`) — thin `fetch` wrapper, always sends `credentials: 'include'`; reads `NEXT_PUBLIC_API_URL`
- Server-side (Route Handlers): fetch directly to `API_URL` (server env var, not public) and forward `Set-Cookie` headers to the browser — this is the cookie-relay pattern used in `app/api/auth/`
- Route protection: Next.js middleware (`src/middleware.ts`) checks for the `accessToken` cookie and redirects unauthenticated requests to `/login`

### Environment variables

API (`apps/api/.env`): `PORT`, `MONGO_URI`, `JWT_SECRET`, `JWT_EXPIRES_IN`, `NODE_ENV`, `CLIENT_URL`  
Web (`apps/web/.env.local`): `NEXT_PUBLIC_API_URL` (browser), `API_URL` (server-side Route Handlers)

`src/config/env.ts` validates `MONGO_URI` and `JWT_SECRET` at startup and throws if missing.

## Commit conventions

Follow [Conventional Commits 1.0.0](https://www.conventionalcommits.org/en/v1.0.0/) for every commit message:

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

- **type**: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, `revert`
- **scope** (optional): the affected area, e.g. `api`, `web`, `auth`, `categories`
- **description**: short, imperative, lowercase, no trailing period
- Breaking changes: append `!` after the type/scope (`feat(api)!: ...`) and/or add a `BREAKING CHANGE:` footer
- Body explains *why*, not *what* — the diff already shows what changed

## Current status

The scaffold is complete but all business logic is stubbed with `TODO` comments and `501 Not Implemented` responses. Models, middleware, DI wiring, and validation are all in place.
