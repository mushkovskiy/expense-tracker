# Authentication Mechanism — Implementation Plan

## Context

The monorepo scaffold wired up the entire auth surface but left every method stubbed
(`501 Not Implemented` in controllers, `throw new Error('Not implemented')` in services).
All primitives already exist — bcrypt helpers, JWT sign/verify, `AuthMiddleware`,
`validateBody`, `HttpError`/`errorMiddleware`, `UserModel`, and the Zod schemas. The goal
is to implement a working **JWT-in-httpOnly-cookie** auth flow end to end (access token
only, per the README): register, login, logout, and "current user", plus the web forms and
route handlers that drive them.

Decisions confirmed with the user:
- **Scope:** full stack (API + web route handlers + form UI + `lib/auth.ts`).
- **Cookie expiry:** cookie `maxAge` matches the JWT expiry so they expire together.

## Existing pieces to reuse (do not reinvent)

- `apps/api/src/utils/password.ts` — `hashPassword` / `comparePassword` (bcryptjs)
- `apps/api/src/utils/jwt.ts` — `signAccessToken` / `verifyAccessToken`, payload `{ sub, email }`
- `apps/api/src/middleware/auth.middleware.ts` — reads `accessToken` cookie → `req.user`
- `apps/api/src/middleware/validate.middleware.ts` — `validateBody(schema)` (already on routes)
- `apps/api/src/middleware/error.middleware.ts` — `HttpError(status, message)` + `errorMiddleware`
- `apps/api/src/models/user.model.ts` — `UserModel` (email unique, passwordHash, name, timestamps)
- `@repo/validation` — `registerSchema`, `loginSchema`, `RegisterInput`, `LoginInput`
- `@repo/types` — `IUser`, `AuthResponse { user }`, `ApiResponse<T>` (`{ success, data }` / `{ success, error }`)
- `apps/web/src/lib/api-client.ts` — `apiFetch` (sends `credentials: 'include'`)
- `apps/web/src/app/api/auth/login|logout/route.ts` — cookie-relay pattern to mirror

## API changes

### 1. `UserService` — `apps/api/src/modules/users/user.service.ts`
Implement persistence against `UserModel`:
- `findById(id)` → `UserModel.findById(id)`
- `findByEmail(email)` → `UserModel.findOne({ email })`
- add `create({ email, passwordHash, name })` → `UserModel.create(...)`

### 2. User mapper — `apps/api/src/modules/users/user.mapper.ts` (new)
`toIUser(doc)`: map a Typegoose user doc → shared `IUser` (`id` from `_id.toString()`,
`email`, `name`, `createdAt`/`updatedAt` as ISO strings). Never expose `passwordHash`.

### 3. Cookie helper — `apps/api/src/utils/cookie.ts` (new)
- `setAuthCookie(res, token)`: set `accessToken` cookie with
  `{ httpOnly: true, sameSite: 'lax', secure: env.NODE_ENV === 'production', path: '/', maxAge }`.
  Derive `maxAge` from the token itself — `jwt.decode(token).exp * 1000 - Date.now()` — so the
  cookie tracks `JWT_EXPIRES_IN` without re-parsing the env string.
- `clearAuthCookie(res)`: `res.clearCookie('accessToken', { path: '/', ... })` with matching attrs.
- Export the cookie name as a shared constant (reuse in middleware to avoid the magic string).

### 4. `AuthService` — `apps/api/src/modules/auth/auth.service.ts`
Inject `UserService` (`@inject(TYPES.UserService)`; constructor currently empty):
- `register(dto)`: if `findByEmail` returns a user → `throw new HttpError(409, 'Email already registered')`;
  `hashPassword`; `userService.create`; sign token from `{ sub: user.id, email }`;
  return `{ user: toIUser(user), token }`.
- `login(dto)`: `findByEmail`; if missing **or** `comparePassword` fails →
  `throw new HttpError(401, 'Invalid credentials')` (same message either way); sign token;
  return `{ user, token }`.
- `getCurrentUser(userId)`: `findById`; if missing → `throw new HttpError(401, 'Unauthorized')`;
  return `toIUser(user)`.

### 5. `AuthController` — `apps/api/src/modules/auth/auth.controller.ts`
Replace the four stubs (keep the existing decorators/validation middleware):
- `register`: body typed `RegisterInput` → `authService.register` → `setAuthCookie(res, token)` →
  `res.status(201).json({ success: true, data: { user } })`.
- `login`: → `authService.login` → `setAuthCookie` → `200 { success: true, data: { user } }`.
- `logout`: `clearAuthCookie(res)` → `200 { success: true, data: { success: true } }`.
- `me`: add `@request() req` → `authService.getCurrentUser(req.user!.sub)` →
  `200 { success: true, data: { user } }`.

Errors propagate to `errorMiddleware` (no local try/catch needed).

### 6. `UserController.getMe` — `apps/api/src/modules/users/user.controller.ts`
Add `@request() req`, call `userService.findById(req.user!.sub)`, 404 → `HttpError`,
return `{ success: true, data: { user: toIUser(user) } }`.

## Web changes

### 7. Register route handler — `apps/web/src/app/api/auth/register/route.ts` (new)
Mirror `login/route.ts`: POST forwards body to `${API_URL}/auth/register` and relays the
`Set-Cookie` header back to the browser.

### 8. Login & register pages — make them client components
`apps/web/src/app/(auth)/login/page.tsx` and `.../register/page.tsx`:
- Add `'use client'`, controlled inputs, submit handler.
- POST same-origin to `/api/auth/login` (or `/register`) so the route handler sets the cookie.
- On success `router.push('/expenses')`; on failure show the API error message.

### 9. `lib/auth.ts` — real validation
Replace the presence-only `isAuthenticated` with a call to the API `/auth/me` forwarding the
request cookies; return `true` only on a `200`. Resolves the existing TODO.

## Verification

1. `docker compose up -d` (Mongo), create `apps/api/.env` and `apps/web/.env.local` per README, `pnpm dev`.
2. API directly:
   - `POST /api/auth/register` → `201`, `Set-Cookie: accessToken=...; HttpOnly`, body `{ success: true, data: { user } }`.
   - Re-register same email → `409`.
   - `POST /api/auth/login` (wrong password) → `401`; (correct) → `200` + cookie.
   - `GET /api/auth/me` with cookie → `200` user; without cookie → `401`.
   - `POST /api/auth/logout` → clears cookie.
3. Web: register via UI → redirected to `/expenses`; refresh stays in (middleware sees cookie);
   logout (once wired) → `/expenses` redirects to `/login`.
4. `pnpm --filter api test` — existing `password.test.ts` still passes; add service-level tests
   for register-duplicate and login-invalid if time permits.
5. `pnpm lint` clean.

## Notes / out of scope
- Access token only — no refresh token (matches README). Token lifetime via `JWT_EXPIRES_IN`.
- No rate limiting / account lockout in this pass.
