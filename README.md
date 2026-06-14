# Expense Tracker

A monorepo expense tracking application.

## Stack

| Layer | Technology |
|------|-----------|
| Monorepo | pnpm workspaces + Turborepo |
| Frontend | Next.js 16 (App Router) + React + Tailwind CSS |
| Backend | Node.js 22 LTS + Express + TypeScript (strict) |
| DI Container | InversifyJS + inversify-express-utils |
| Database | MongoDB + Typegoose |
| Authentication | JWT (access token only) in httpOnly cookies |
| Validation | Zod (in `@repo/validation`) |
| Linter/Formatter | Biome |
| Tests | Jest |
| Local DB | Docker Compose |

## Project Structure

```
expence-tracker/
├── apps/
│   ├── web/      # Next.js 16 frontend
│   └── api/       # Express + InversifyJS backend
├── packages/
│   ├── types/         # @repo/types - shared TS interfaces & DTOs
│   ├── config/        # @repo/config - constants & API routes
│   ├── validation/     # @repo/validation - Zod schemas
│   ├── tsconfig/      # @repo/tsconfig - shared TS configs
│   └── biome-config/  # @repo/biome-config - shared Biome config
├── docker-compose.yml
├── turbo.json
└── pnpm-workspace.yaml
```

## Getting Started

### 1. Install dependencies

```bash
pnpm install
```

### 2. Start MongoDB (via Docker Compose)

```bash
docker compose up -d
```

This starts MongoDB on `localhost:27017` and mongo-express (DB admin UI) on `localhost:8081`.

### 3. Environment Variables

Create a `.env` file in `apps/api` with:

```bash
PORT=4000
MONGO_URI=mongodb://localhost:27017/expense-tracker
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=1d
NODE_ENV=development
CLIENT_URL=http://localhost:3000
```

Create a `.env.local` file in `apps/web` with:

```bash
NEXT_PUBLIC_API_URL=http://localhost:4000/api
API_URL=http://localhost:4000/api
```

### 4. Run the apps

```bash
pnpm dev
```

This runs both `apps/web` (http://localhost:3000) and `apps/api` (http://localhost:4000) via Turborepo.

### Other scripts

```bash
pnpm build    # build all apps/packages
pnpm lint     # lint all apps/packages
pnpm test     # run all tests
pnpm format   # format codebase with Biome
```

## Status

This is a scaffold only — no business logic has been implemented yet. Modules contain
TODO comments marking where implementation should be added.
