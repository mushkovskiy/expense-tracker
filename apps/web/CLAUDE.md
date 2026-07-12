# CLAUDE.md — apps/web

Next.js 16 App Router frontend, Radix Themes (no Tailwind). See the root `CLAUDE.md` for monorepo-wide conventions (commands, commits, branching).

## Web → API communication

- Client-side: `src/lib/api-client.ts` (`apiFetch`) — thin `fetch` wrapper, always sends `credentials: 'include'`; reads `NEXT_PUBLIC_API_URL`
- Server-side (Route Handlers): fetch directly to `API_URL` (server env var, not public) and forward `Set-Cookie` headers to the browser — this is the cookie-relay pattern used in `app/api/auth/`
- Server Components can fetch the current user directly via `getCurrentUser()` / `isAuthenticated()` in `src/lib/auth.ts` (same cookie-relay pattern, no client round-trip)
- Route protection: Next.js middleware (`src/middleware.ts`) checks for the `accessToken` cookie and redirects unauthenticated requests to `/login`

## Frontend routes (`apps/web/src/app`)

- `(auth)/login`, `(auth)/register` — public, redirect to `/dashboard` on success
- `(dashboard)/dashboard` — post-login landing page; server component showing the user's profile card and a category selection grid (`src/components/profile-card.tsx`, `category-menu.tsx`)
- `(dashboard)/expenses`, `(dashboard)/categories`, `(dashboard)/budgets` — feature pages, gated by the `(dashboard)/layout.tsx` sidebar
- Protected paths are declared in two places that must stay in sync: `PROTECTED_PATHS` and `matcher` in `src/middleware.ts`

## Environment variables

`apps/web/.env.local`: `NEXT_PUBLIC_API_URL` (browser), `API_URL` (server-side Route Handlers)
