# Radix UI Themes Integration Plan (web app)

## Context

The web app (`apps/web`) currently styles every page with hand-written Tailwind
utility classes: a home landing page, full login/register forms, a dashboard
layout with a sidebar, and three stub dashboard pages (categories/expenses/budgets).
There is no component library — every button, input, and layout primitive is raw
HTML + Tailwind.

Goal: adopt **`@radix-ui/themes`** as the UI/component system across all existing
pages, **remove Tailwind entirely**, and support **system appearance with a
light/dark toggle** (per chosen options). Outcome: consistent, themeable UI built
from Radix Themes components and tokens, with no Tailwind dependency.

## Decisions (confirmed with user)
- **Remove Tailwind** — drop deps, config, and `@tailwind` directives; rely solely on Radix Themes components + CSS variables.
- **Appearance** — system default with a user-facing light/dark toggle, via `next-themes` (the integration `@radix-ui/themes` officially documents).

## Dependencies
- Add: `@radix-ui/themes` (^3), `next-themes` (^0.4).
- Remove from `apps/web/package.json` devDeps: `tailwindcss`, `autoprefixer`, `postcss`.
- Delete files: `apps/web/tailwind.config.ts`, `apps/web/postcss.config.mjs`.
- Note: `react@^19` / `next@^16` are compatible with Radix Themes 3 and next-themes 0.4.

## Implementation

### 1. Global styles — `apps/web/src/app/globals.css`
Replace the three `@tailwind` directives with:
```css
@import '@radix-ui/themes/styles.css';
```
Keep the file (Next.js imports it in the root layout) — add any minimal global rules here later if needed (e.g. `html, body { height: 100%; }`).

### 2. Theme provider — root layout `apps/web/src/app/layout.tsx`
- Wrap `{children}` in `next-themes` `ThemeProvider` (`attribute="class"`) → `@radix-ui/themes` `<Theme>`.
- Give `<Theme>` a default `accentColor` (e.g. `"indigo"`), `grayColor`, and `radius`; let `next-themes` drive appearance via the class attribute (do **not** hardcode `appearance` on `<Theme>`).
- Add `suppressHydrationWarning` to `<html>` (required by next-themes).
- Because `ThemeProvider` is a client component, extract the provider tree into a small `'use client'` wrapper, e.g. `apps/web/src/app/providers.tsx`, and render it from the (server) root layout.

### 3. Theme toggle (new) — `apps/web/src/components/theme-toggle.tsx`
- `'use client'` component using `useTheme()` from `next-themes` to switch between `light`/`dark`/`system`.
- Build from Radix Themes `IconButton`/`DropdownMenu` (or a simple `SegmentedControl`). Place it in the dashboard layout header and on the home/auth pages' top corner.

### 4. Convert pages to Radix Themes components
Replace Tailwind markup with Radix primitives — pattern applied across all pages:
- Layout: `Flex`, `Box`, `Container`, `Grid`, `Section` instead of `div` + flex utilities.
- Typography: `Heading`, `Text` instead of `h1/p` + text utilities.
- Forms: `TextField.Root` (+ `TextField.Slot` if needed), `Button` (with `loading` prop), `Text color="red"` for errors, in place of raw `input`/`button`.
- Navigation: Radix `Link` (asChild with `next/link`) for nav/links.
- Cards/containers: `Card` for the login/register form wrapper.

Files to convert:
- `apps/web/src/app/page.tsx` — home: `Container` + `Flex` centered, `Heading`, `Text`, two `Button asChild`→`Link`.
- `apps/web/src/app/(auth)/login/page.tsx` and `(auth)/register/page.tsx` — keep all existing state/`handleSubmit` logic untouched; swap only the returned JSX to `Card` + `Flex` + `TextField.Root` + `Button loading={loading}` + error `Text`.
- `apps/web/src/app/(dashboard)/layout.tsx` — sidebar via `Flex` + `Box` + nav `Link`s; add the theme toggle.
- `apps/web/src/app/(dashboard)/{categories,expenses,budgets}/page.tsx` — wrap heading in `Box`/`Heading`, keep the TODO comments.

Do **not** touch: API route handlers (`src/app/api/**`), `middleware.ts`, `lib/*`, or any data logic — this is a presentation-only change.

### 5. Cleanup
- Remove `tailwind.config.ts`, `postcss.config.mjs`, Tailwind/PostCSS deps.
- Confirm no remaining `className` strings rely on Tailwind utilities (search `apps/web/src` for `className=` after conversion; only Radix-compatible classes or none should remain).

## Verification
1. `pnpm install` (root) to pick up new/removed deps.
2. `pnpm --filter web build` — must compile with no Tailwind/PostCSS references and no TS errors.
3. `pnpm --filter web lint` — Biome clean.
4. `pnpm dev` and manually verify in the browser (`http://localhost:3000`):
   - Home, `/login`, `/register` render with Radix styling; forms still submit and redirect to `/expenses` (login/register logic unchanged).
   - Dashboard layout shows sidebar + three pages; nav links work.
   - Theme toggle switches light/dark and respects system on first load (no hydration warning in console).
5. Sanity check dark mode: Radix tokens recolor correctly (no unstyled/white flashes).

## Out of scope
- Building out the actual categories/expenses/budgets data UIs (still stubs).
- Wiring categories search/pagination from the API into the web UI.
- Auth/route-protection changes.
