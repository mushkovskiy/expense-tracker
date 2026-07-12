# CLAUDE.md — apps/api

Express REST API: TypeScript, InversifyJS DI, Typegoose/MongoDB. See the root `CLAUDE.md` for monorepo-wide conventions (commands, commits, branching).

## Commands

```bash
pnpm --filter api test              # run all API tests
pnpm --filter api test -- --testPathPattern=password  # run a single test file
pnpm --filter api build             # tsc compile to dist/
```

## Request lifecycle

1. `src/server.ts` — reads `.env`, connects to MongoDB, starts the HTTP server
2. `src/app.ts` — builds the InversifyExpressServer; imports all controllers so their decorators register routes; mounts global `errorMiddleware`
3. Controllers (`src/modules/<domain>/<domain>.controller.ts`) — declare routes via `inversify-express-utils` decorators (`@controller`, `@httpGet`, etc.), inject services via `@inject(TYPES.X)`, apply middleware per-route or per-controller
4. Services (`src/modules/<domain>/<domain>.service.ts`) — `@injectable()` classes bound in `src/container/container.ts`; own all business logic and DB access via Typegoose models in `src/models/`

## DI container (`src/container/`)

- `types.ts` — `TYPES` object of `Symbol.for(...)` tokens; add a new token here for every new injectable
- `container.ts` — all bindings in one place; services are singletons, `AuthMiddleware` is bound with `.toSelf()`

## Adding a new module

1. Create `src/modules/<domain>/<domain>.service.ts` (`@injectable()`) and `<domain>.controller.ts` (`@controller('/path', ...)`)
2. Add a token to `TYPES` and bind the service in `container.ts`
3. Import the controller in `app.ts` so its decorators run at startup
4. Add Zod schemas to `packages/validation` and types to `packages/types` if shared with the frontend

## Authentication

- JWT issued as `httpOnly` cookie named `accessToken`; payload shape is `{ sub: userId, email }`
- `AuthMiddleware` (`src/middleware/auth.middleware.ts`) extends `BaseMiddleware`, verifies the cookie, and attaches the decoded payload to `req.user`
- Apply it per-route (`@httpGet('/me', AuthMiddleware)`) or per-controller (`@controller('/expenses', AuthMiddleware)`)
- `req.user` type is augmented in `src/types/express.d.ts`

## Validation

`validateBody(schema)` middleware (in `src/middleware/validate.middleware.ts`) runs Zod `.safeParse` on `req.body` and replaces it with the parsed data, so controllers receive typed, coerced input. Always use schemas from `@repo/validation`.

## Error handling

Throw `HttpError(statusCode, message)` from services or controllers; `errorMiddleware` catches it and returns `{ success: false, error: { message } }`. Unrecognised errors produce a 500.

## Environment variables

`apps/api/.env`: `PORT`, `MONGO_URI`, `JWT_SECRET`, `JWT_EXPIRES_IN`, `NODE_ENV`, `CLIENT_URL`

`src/config/env.ts` validates `MONGO_URI` and `JWT_SECRET` at startup and throws if missing.
