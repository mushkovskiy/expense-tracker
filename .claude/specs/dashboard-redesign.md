# Dashboard Redesign — Implementation Plan

## Context

The web app's dashboard is a placeholder: `(dashboard)/dashboard/page.tsx` shows a "Welcome back" heading, the profile card, a category grid, and two "Coming soon" stat cards. The sidebar in `(dashboard)/layout.tsx` is four plain text links — no logo, icons, search, or profile footer. The goal is to redesign the frontend to match the attached financial-dashboard reference (dark sidebar + light content, bar/line/donut charts, stat cards, transactions table) while adapting it to this app's **expense-only** domain and giving it a distinctive visual identity rather than a pixel copy.

Two gaps block a faithful build and must be filled:

- **Backend:** the entire expense module is stubbed (`501 Not Implemented`), and there are **no analytics/aggregation endpoints**. The reference's Revenue/Cashflow/income concepts have no backing data (models are expense-outflow only). Per the decisions below we adapt the charts to expense data, which still requires completing the expense CRUD and adding **one new analytics endpoint**.
- **Frontend:** no charting library, no icon library, and no custom fonts are installed. Radix Themes is the only UI kit.

## Decisions (confirmed with user)

- **Domain:** adapt the reference to the existing **expense-only** domain. No income/transaction-type/status concept. Charts repurpose expense data (monthly spend bar, spend trend line, spend-by-category donut, spend stat cards, expenses table).
- **Charts:** use **Recharts**.
- **Nav & brand:** match the reference's visual style (dark sidebar, icons, search, profile footer) but use this app's real sections — Dashboard, Expenses, Categories, Budgets — and keep the app's own name.
- **Visual identity:** keep the reference's structure but apply a deliberate, distinctive palette/typography (see Design system) — not a pixel-faithful clone.

> On approval, copy this file to `.claude/specs/dashboard-redesign.md` (repo spec home) as the first step.

## Reference patterns to follow (reuse, do not reinvent)

- **Backend service/mapper pattern:** `apps/api/src/modules/categories/category.service.ts` + `category.mapper.ts` are the exact template for the expense service (paginated `list` with `find/skip/limit/countDocuments`, `create/update/remove`, `HttpError`, a `toIExpense` mapper). `category.controller.ts` is the template for wiring the controller (reads `req.user.sub`, `validateQuery`/`validateBody`, `{ success, data }` envelope).
- **Query schema:** `categoryQuerySchema` in `packages/validation/src/category.schema.ts` (search/page/pageSize with coercion + defaults from `@repo/config` `LIMITS`) is the template for the new expense/analytics query schemas.
- **DI wiring:** add tokens in `apps/api/src/container/types.ts`, bind in `container/container.ts`, import the controller in `app.ts` (see `apps/api/CLAUDE.md` "Adding a new module").
- **Aggregation index:** `Expense` already has `@index({ user: 1, date: -1 })` — well-suited for the date-range aggregation.
- **Client data fetching:** `apps/web/src/components/category-menu.tsx` is the pattern for a `'use client'` component fetching via `apiFetch` (`src/lib/api-client.ts`, `credentials: 'include'`) using `API_ROUTES` from `@repo/config` and types from `@repo/types`.
- **Radix conventions:** `Flex/Box/Grid/Container`, `Card`, `Heading/Text`, `Button` (loading prop), `TextField.Root`, `Avatar`, `Link asChild`, `SegmentedControl`. Reuse `profile-card.tsx`, `logout-button.tsx`, `theme-toggle.tsx`. Nested dark subtree via `<Theme appearance="dark">`.

---

## Design system

Distinctive identity, kept within Radix tokens where possible.

- **Color:**
  - Accent → **jade** (money/growth), replacing the current `indigo` on `<Theme>`. Gray → `slate`, radius → `large` (softer cards than the reference).
  - Sidebar → a fixed near-black surface via a nested `<Theme appearance="dark">`, background `var(--gray-1)`/`#0b0d10`.
  - Categorical donut palette (curated, contrast-checked, light+dark): jade / iris / amber / ruby / cyan / plum — sourced from Radix step-9 scale vars (`var(--jade-9)`, `var(--iris-9)`, …) so they track theme.
  - Positive/negative deltas: `var(--jade-11)` / `var(--red-11)`.
- **Type:**
  - Display + all money figures → **Space Grotesk** (geometric, strong tabular numerals) via `next/font/google`, exposed as `--font-display`.
  - Body/UI → **Inter** via `next/font/google` as `--font-body`, with `font-variant-numeric: tabular-nums` on figures.
- **Signature:** the period **"Total spent"** hero figure — a large Space Grotesk number with a period-over-period delta chip — paired with the category donut. Boldness spent here; every other card stays quiet (hairline borders, muted labels).
- **Layout (unchanged from reference structure):**

```
┌──────────┬──────────────────────────────────────────────┐
│ SIDEBAR  │  Welcome, {name}      [ USD ▾ ] [ 6 Months ▾ ]│
│ (dark)   │  ┌───────────────────────────┐ ┌────────────┐ │
│ logo     │  │ Monthly spending (bars)   │ │ Total spent│ │
│ search   │  │                           │ ├────────────┤ │
│ ─ menu ─ │  │                           │ │ Avg / month│ │
│ Dashboard│  └───────────────────────────┘ └────────────┘ │
│ Expenses │  ┌───────────────────────────┐ ┌────────────┐ │
│ Categories│ │ Spend trend (line)        │ │ By category│ │
│ Budgets  │  │                           │ │  (donut)   │ │
│ ──────── │  └───────────────────────────┘ └────────────┘ │
│ profile  │  Recent expenses (table)                      │
└──────────┴──────────────────────────────────────────────┘
```

---

## Implementation

### Backend

#### 1. Expense mapper — `apps/api/src/modules/expenses/expense.mapper.ts` (new)
`toIExpense(doc)` returning `IExpense` (`packages/types/src/expense.ts`). Mirror `category.mapper.ts`; map `category` ref → `categoryId`, `date`/timestamps → ISO strings.

#### 2. Expense query schema — `packages/validation/src/expense.schema.ts`
Add `expenseQuerySchema` (mirror `categoryQuerySchema`): `page`, `pageSize` (coerced, defaults/max from `LIMITS`), optional `categoryId`, optional `from`/`to` ISO dates, optional `search` (matches `description`). Export `ExpenseQueryInput`. Re-export from `packages/validation/src/index.ts`.

#### 3. Expense service — `apps/api/src/modules/expenses/expense.service.ts`
Implement the four stubbed methods against `ExpenseModel`, mirroring `CategoryService`:
- `list(userId, query)` → filter by `user` (+ optional `categoryId`, `date` range, `description` regex), `sort({ date: -1 })`, `skip/limit`, `countDocuments`; return `PaginatedResult<IExpense>` shape (`items/total/page/pageSize`) mapped via `toIExpense`.
- `create/update/remove` → user-scoped, `HttpError(404)` when not found. Validate the referenced `categoryId` belongs to the user (mirror the ownership guard style in `CategoryService`).

#### 4. Expense controller — `apps/api/src/modules/expenses/expense.controller.ts`
Replace the 501 bodies: read `req.user.sub`, call the service, return `{ success, data }`. Add `@httpGet('/', validateQuery(expenseQuerySchema))`. Mirror `category.controller.ts` exactly (status codes: 200 list/update/delete, 201 create).

#### 5. Analytics module — `apps/api/src/modules/analytics/` (new)
- `analytics.query.schema` in `packages/validation` (`analyticsQuerySchema`): `months` (enum/coerced: 3|6|12, default 6), `currency` (from `CURRENCIES`, **default `DEFAULT_CURRENCY` = 'USD'** so the aggregation never sums mixed currencies — always `$match` on a single currency).
- `analytics.service.ts` (`@injectable`) — one MongoDB **aggregation** over `ExpenseModel` for the user within the last N months:
  - `monthlyTotals: { month: 'YYYY-MM', total }[]` — `$group` by year+month (zero-fill missing months in JS).
  - `byCategory: { categoryId, name, color, total }[]` — `$group` by category + `$lookup` categories for `name`/`color`.
  - `totalSpent`, `avgPerMonth`, and `previousPeriodTotal` (same-length prior window) for the delta chip.
- `analytics.controller.ts` — `@controller('/analytics', AuthMiddleware)`, `@httpGet('/overview', validateQuery(analyticsQuerySchema))` → `{ success, data: IExpenseOverview }`.
- Shared type `IExpenseOverview` in `packages/types/src/analytics.ts` (+ `index.ts` re-export).
- Wire DI: add `AnalyticsService` token to `container/types.ts`, bind in `container.ts`, import the controller in `app.ts`.
- Add `ANALYTICS: { OVERVIEW: '/analytics/overview' }` to `packages/config/src/routes.ts`.

#### 6. Seed script — `apps/api/src/scripts/seed.ts` (new) + `package.json` script
Because the expense module was stubbed, the DB has **no expense data** — nothing for the charts to render. Add a `seed` script (e.g. `pnpm --filter api seed`) that, for the demo user, upserts a handful of categories (with distinct `color`s for the donut) and generates ~40–60 `Expense` records spread across the last 6 months in a single currency (`DEFAULT_CURRENCY`). Reuse `ExpenseModel`/`CategoryModel`/`UserModel` and the same Mongo connection helper as `server.ts`. Idempotent (clear the demo user's expenses first, or upsert). This is the primary way to populate the dashboard; there is **no in-app expense-creation form** (out of scope).

### Frontend

#### 7. Dependencies — `apps/web/package.json`
Add `recharts` and `lucide-react`. (Space Grotesk + Inter come from `next/font/google` — no dep.) Run `pnpm install`.

#### 8. Fonts & theme — `app/layout.tsx`, `app/providers.tsx`, `app/globals.css`
- `layout.tsx`: load `Space_Grotesk` + `Inter` via `next/font/google`, attach their CSS variables (`--font-display`, `--font-body`) to `<html>`.
- `providers.tsx`: change `<Theme accentColor="indigo">` → `accentColor="jade"`, `radius="large"`; keep `grayColor="slate"` and the `next-themes` wrapper.
- `globals.css`: set body to `--font-body`, add a `.font-display` / numeric `tabular-nums` helper and the donut categorical palette CSS vars.

#### 9. Sidebar shell — `app/(dashboard)/layout.tsx` + `src/components/sidebar.tsx` (new)
Replace the inline nav with a `<Sidebar>`: fixed-width, wrapped in nested `<Theme appearance="dark">`. Contains logo/wordmark, a `TextField.Root` search (decorative for now) with a lucide search icon, a "Main menu" nav (Dashboard/Expenses/Categories/Budgets, each a `Link asChild` + lucide icon, **active state** from `usePathname`), and a footer reusing `ProfileCard` + `LogoutButton`. Keep `ThemeToggle` in the footer. Main content stays light in a scrollable `Box`.
- **Responsive (mobile):** below a breakpoint the sidebar is hidden and opened via a **hamburger button** as an overlay **drawer** — use Radix `Dialog` (portal + overlay) hosting the same `<Sidebar>` content, closing on nav-item click. On desktop it stays a static column. Extract the sidebar body into a shared component so both the static column and the drawer render it.

#### 10. Dashboard chart components — `src/components/dashboard/` (new, all `'use client'`)
Fetch via `apiFetch(API_ROUTES.ANALYTICS.OVERVIEW…)` / `API_ROUTES.EXPENSES.BASE`, following `category-menu.tsx`. Theme charts with Radix CSS vars. **Every data component handles three states explicitly:** `loading` (Radix `Skeleton`/`Spinner`), `error` (quiet inline message with a retry, in the interface voice — not an apology), and `empty` (a short "No expenses yet" invitation, since a new user has zero expenses). A shared `<ChartCard>` wrapper (title + state handling) keeps this consistent.
- `dashboard-header.tsx` — greeting + currency `SegmentedControl`/`Select` and period (`3/6/12 Months`) `Select`; lifts selection to drive query params (URL search params or context).
- `stat-card.tsx` — label + Space Grotesk figure + delta chip. Two instances: "Total spent", "Avg / month".
- `monthly-bar-chart.tsx` — Recharts `BarChart` of `monthlyTotals`.
- `trend-line-chart.tsx` — Recharts `AreaChart`/`LineChart` of `monthlyTotals` (cumulative or per-month trend).
- `category-donut.tsx` — Recharts `PieChart` (donut) of `byCategory` + legend with amounts, center label = `totalSpent`.
- `transactions-table.tsx` — Radix `Table` of recent expenses (id, category, date, amount, currency), fetched from `EXPENSES.BASE` (first page). Reused on the Expenses page.
- `lib/format.ts` (new) — `formatCurrency(amount, currency)` and `formatMonth(...)` via native `Intl` (incl. `$80K`-style compact notation), shared by cards/charts/table.

#### 11. Dashboard page — `app/(dashboard)/dashboard/page.tsx`
Keep as a server component for the `getCurrentUser()` auth guard; render `<DashboardHeader>` and the chart grid (client components fetch their own data). Remove the "Coming soon" placeholder cards and `CategoryMenu`.

#### 12. Expenses page — `app/(dashboard)/expenses/page.tsx`
Fill the stub with the full expenses list reusing `<TransactionsTable>` (paginated via `expenseQuerySchema` params). Categories/Budgets pages inherit the new shell but their full build-out stays out of scope.

---

## Задачи (чеклист реализации)

Порядок: сначала бэкенд (1–4), затем фронтенд (5–10), в конце проверка (11). Задачи 1→2→3 идут последовательно; seed (4) после 1–2; на фронте 6 и 7 можно параллельно после 5.

### Бэкенд
- [ ] **1. Маппер и query-схема расходов** — создать `expense.mapper.ts` (`toIExpense`, по образцу `category.mapper.ts`) и добавить `expenseQuerySchema` + `ExpenseQueryInput` в `packages/validation/src/expense.schema.ts` (пагинация + фильтры по категории/датам/описанию). Основа для листинга расходов.
- [ ] **2. Реализовать сервис и контроллер расходов** — заменить заглушки `501` в `expense.service.ts`/`expense.controller.ts` реальной логикой (`list/create/update/remove`, проверка владельца) по образцу `CategoryService`. Даёт рабочий CRUD и данные для таблицы транзакций.
- [ ] **3. Модуль аналитики** — новый модуль `modules/analytics/` (схема запроса `months` + `currency` с дефолтом `DEFAULT_CURRENCY`, сервис с MongoDB-агрегацией по одной валюте: `monthlyTotals`, `byCategory`, `totalSpent`, `avgPerMonth`, `previousPeriodTotal`; контроллер `/analytics/overview`), тип `IExpenseOverview`, роут `ANALYTICS`, DI-обвязка (`types.ts`/`container.ts`/`app.ts`). Питает графики и стат-карточки.
- [ ] **4. Seed-скрипт демо-данных** — `apps/api/src/scripts/seed.ts` + npm-скрипт `pnpm --filter api seed`: категории с цветами и ~40–60 расходов за 6 месяцев в одной валюте для демо-пользователя (идемпотентно). Без него дашборд пустой; формы создания расхода в UI нет (вне рамок).

### Фронтенд
- [ ] **5. Зависимости, шрифты и тема** — добавить `recharts` и `lucide-react`; подключить Space Grotesk + Inter через `next/font`; сменить акцент на `jade` в `providers.tsx`; токены и `tabular-nums` в `globals.css`. Базис визуальной идентичности.
- [ ] **6. Боковая панель (shell) + адаптив** — создать `components/sidebar.tsx` (тёмная вложенная `<Theme appearance="dark">`, логотип, поиск, меню с иконками и активным состоянием по `usePathname`, футер с профилем) и переписать `(dashboard)/layout.tsx`. На мобильных — бургер + overlay-drawer через Radix `Dialog` с тем же контентом. Общий каркас всех страниц.
- [ ] **7. Компоненты графиков дашборда** — клиентские компоненты в `components/dashboard/`: `dashboard-header` (валюта/период), `stat-card`, `monthly-bar-chart`, `trend-line-chart`, `category-donut`, `transactions-table` + общий `<ChartCard>` и `lib/format.ts`. Каждый компонент явно обрабатывает **loading / error / empty**. Данные тянут через `apiFetch` по образцу `category-menu.tsx`.
- [ ] **8. Страница дашборда** — переписать `(dashboard)/dashboard/page.tsx`: серверный auth-guard + `<DashboardHeader>` и сетка графиков; убрать заглушки «Coming soon» и `CategoryMenu`.
- [ ] **9. Страница расходов** — заполнить заглушку `(dashboard)/expenses/page.tsx` полным списком расходов, переиспользуя `<TransactionsTable>` с пагинацией.

### Проверка
- [ ] **10. Сборка, линт и прогон приложения** — `pnpm build`/`lint`/`test`, seed демо-данных, smoke-тест API (см. раздел Verification) и визуальная проверка дашборда в light/dark + адаптив (drawer на мобильном, пустые состояния).

---

## Verification

1. **Backend build/lint/tests:** `pnpm --filter api build`, `pnpm lint`, `pnpm --filter api test`. Then seed demo data: `pnpm --filter api seed`.
2. **API smoke (Mongo up via `docker compose up -d`, `pnpm dev`):** log in to get the cookie, then with cookies:
   - `POST /api/expenses` (valid body) → 201; `GET /api/expenses` → 200 paginated `{ items, total, page, pageSize }`.
   - `PUT /api/expenses/:id` → 200; `DELETE /api/expenses/:id` → 200.
   - `GET /api/analytics/overview?months=6` → 200 with `monthlyTotals`, `byCategory`, `totalSpent`, `avgPerMonth`, `previousPeriodTotal`.
3. **Frontend:** `pnpm dev`, log in, open `/dashboard`. Confirm: dark sidebar with icons + active state + profile footer; bar/line/donut render from seeded data; stat cards show Space Grotesk figures + delta; changing period/currency refetches; transactions table populates; Expenses page lists expenses. Check **empty state** (a fresh user with no expenses shows the "No expenses yet" invitation, not a broken chart) and error/loading states. Verify light **and** dark app theme, keyboard focus visibility, and mobile: sidebar collapses to a hamburger + drawer.
4. **Type/contract check:** shared types compile across `@repo/types`/`@repo/validation`/`@repo/config`; no `any` leaks.

## Out of scope

- Any income / revenue / transaction-type / status concept (domain is expense-only).
- An in-app expense-creation form/dialog — data is populated via the seed script or API (deferred to a follow-up).
- Completing the **budgets** module (still stubbed 501) and full Categories/Budgets page UIs.
- The reference's "Templates" sidebar section, "Discovery/Reports/Help" nav items, and multi-currency FX conversion (currency is a filter, not a converter).
- Automated tests for the new analytics endpoint and frontend components (add in a follow-up).
