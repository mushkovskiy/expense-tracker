# 📋 Expense Tracker Scaffold — Implementation Plan


## 🎯 Final Stack


| Layer | Technology |
|------|-----------|
| Monorepo | pnpm workspaces + Turborepo |
| Frontend | Next.js 16 (App Router) + React + Tailwind CSS |
| Backend | Node.js 22 LTS + Express + TypeScript (strict) |
| DI Container | InversifyJS + inversify-express-utils |
| Database | MongoDB + Typegoose |
| Authentication | JWT (access token only) in httpOnly cookies |
| Validation | Zod (in shared/validation) |
| Linter/Formatter | Biome |
| Tests | Jest |
| Local DB | Docker Compose |


***


## 📁 Project Structure


```
expence-tracker/
├── apps/
│   ├── web/                         # Next.js 16 frontend
│   │   ├── src/
│   │   │   ├── app/
│   │   │   │   ├── (auth)/
│   │   │   │   │   ├── login/page.tsx
│   │   │   │   │   └── register/page.tsx
│   │   │   │   ├── (dashboard)/
│   │   │   │   │   ├── layout.tsx
│   │   │   │   │   ├── expenses/page.tsx
│   │   │   │   │   ├── categories/page.tsx
│   │   │   │   │   └── budgets/page.tsx
│   │   │   │   ├── api/auth/        # routes for cookie proxying
│   │   │   │   ├── layout.tsx
│   │   │   │   ├── page.tsx
│   │   │   │   └── globals.css
│   │   │   ├── components/
│   │   │   │   ├── ui/              # base UI components
│   │   │   │   └── features/        # feature components
│   │   │   ├── lib/
│   │   │   │   ├── api-client.ts    # fetch wrapper with cookie
│   │   │   │   └── auth.ts          # authentication helpers
│   │   │   ├── hooks/
│   │   │   └── middleware.ts        # private route protection
│   │   ├── public/
│   │   ├── next.config.ts
│   │   ├── tailwind.config.ts
│   │   ├── postcss.config.mjs
│   │   ├── tsconfig.json
│   │   └── package.json
│   │
│   └── api/                         # Express backend
│       ├── src/
│       │   ├── config/
│       │   │   ├── env.ts           # env loading/validation
│       │   │   └── database.ts      # MongoDB connection
│       │   ├── container/           # DI container (InversifyJS)
│       │   │   ├── types.ts         # TYPES symbols
│       │   │   └── container.ts     # Container bindings
│       │   ├── models/              # Typegoose models
│       │   │   ├── user.model.ts
│       │   │   ├── expense.model.ts
│       │   │   ├── category.model.ts
│       │   │   └── budget.model.ts
│       │   ├── modules/             # feature modules
│       │   │   ├── auth/
│       │   │   │   ├── auth.controller.ts   # @controller decorator
│       │   │   │   ├── auth.service.ts      # @injectable
│       │   │   │   └── auth.routes.ts       # (при использовании без inversify-express-utils)
│       │   │   ├── users/
│       │   │   ├── expenses/
│       │   │   ├── categories/
│       │   │   └── budgets/
│       │   ├── middleware/
│       │   │   ├── auth.middleware.ts    # JWT verification from cookie
│       │   │   ├── error.middleware.ts
│       │   │   └── validate.middleware.ts # Zod-based validation
│       │   ├── utils/
│       │   │   ├── jwt.ts
│       │   │   └── password.ts      # bcrypt helpers
│       │   ├── types/
│       │   │   └── express.d.ts     # Request extension
│       │   ├── app.ts               # InversifyExpressServer setup
│       │   └── server.ts            # entry point
│       ├── tests/
│       ├── jest.config.ts
│       ├── tsconfig.json
│       └── package.json
│
├── packages/
│   ├── types/                       # @repo/types
│   │   ├── src/
│   │   │   ├── user.ts
│   │   │   ├── expense.ts
│   │   │   ├── category.ts
│   │   │   ├── budget.ts
│   │   │   ├── auth.ts              # AuthResponse, LoginDto, ...
│   │   │   ├── api.ts               # shared response types
│   │   │   └── index.ts
│   │   ├── tsconfig.json
│   │   └── package.json
│   │
│   ├── config/                      # @repo/config
│   │   ├── src/
│   │   │   ├── constants.ts         # currencies, limits, periods
│   │   │   ├── routes.ts            # API endpoints
│   │   │   └── index.ts
│   │   ├── tsconfig.json
│   │   └── package.json
│   │
│   ├── validation/                  # @repo/validation
│   │   ├── src/
│   │   │   ├── auth.schema.ts
│   │   │   ├── expense.schema.ts
│   │   │   ├── category.schema.ts
│   │   │   ├── budget.schema.ts
│   │   │   └── index.ts
│   │   ├── tsconfig.json
│   │   └── package.json
│   │
│   ├── tsconfig/                    # @repo/tsconfig
│   │   ├── base.json
│   │   ├── nextjs.json
│   │   ├── node.json
│   │   └── package.json
│   │
│   └── biome-config/                # @repo/biome-config
│       ├── biome.json
│       └── package.json
│
├── docker-compose.yml               # MongoDB + mongo-express (optional)
├── turbo.json
├── biome.json                       # root, extends @repo/biome-config
├── package.json                     # root
├── pnpm-workspace.yaml
├── tsconfig.json                    # root
├── .gitignore
├── .nvmrc                           # 22
└── README.md
```


***


## 🛠️ What Will Be Done (Without Installing Dependencies)


### 1. Monorepo Root


- `package.json` with Turborepo scripts (`dev`, `build`, `lint`, `test`, `format`)
- `pnpm-workspace.yaml` with `apps/*` and `packages/*`
- `turbo.json` with pipeline (build → dev, test, lint)
- `biome.json` (root configuration)
- `.gitignore` (node_modules, .next, dist, .env, coverage)
- `.nvmrc` with `22`
- `docker-compose.yml` (MongoDB 7, port 27017, data volume)
- `README.md` with stack description and startup instructions


### 2. Shared Packages


- **`@repo/types`** — interfaces `IUser`, `IExpense`, `ICategory`, `IBudget`, DTOs for auth and API
- **`@repo/config`** — constants (currencies, limits, budget periods), API paths
- **`@repo/validation`** — Zod schemas for all entities and forms
- **`@repo/tsconfig`** — base configs (`base.json`, `nextjs.json`, `node.json`)
- **`@repo/biome-config`** — shared Biome configuration
- Each package includes: `package.json` with correct `main`/`types`/`exports`


### 3. `apps/api` (Express + InversifyJS)


- Folder structure (controllers / services / middleware + DI container)
- Typegoose models for User, Expense, Category, Budget
- **Dependency Injection** setup (see section below)
- Controller/service scaffolds for all modules (with TODO comments inside)
- JWT middleware (reads from httpOnly cookie, verifies token)
- Validation middleware using Zod schemas from `@repo/validation`
- Global error handler
- Env config (via `process.env`, with required field checks)
- `app.ts` — `InversifyExpressServer` setup (cors with credentials, cookie-parser, json)
- `server.ts` — entry point, MongoDB connection
- `tsconfig.json` extends `@repo/tsconfig/node.json`
- `jest.config.ts` for tests
- A sample stub test


### 4. `apps/web` (Next.js 16)


- App Router structure with route groups `(auth)` and `(dashboard)`
- Base scaffold pages: login, register, expenses, categories, budgets
- `middleware.ts` — private route protection (cookie verification)
- `lib/api-client.ts` — fetch wrapper with `credentials: 'include'`
- Tailwind CSS configured (`tailwind.config.ts`, `globals.css`)
- Next.js API routes for proxying authentication (login/logout)
- `tsconfig.json` extends `@repo/tsconfig/nextjs.json`
- `next.config.ts` with `transpilePackages` configured for shared packages


### 5. TypeScript Configuration


- Strict mode everywhere
- Path aliases (`@/`, `@repo/*`)
- Project references between packages


***


## 💉 Dependency Injection (InversifyJS)


Бэкенд использует **InversifyJS** как IoC-контейнер и **inversify-express-utils** для интеграции с Express. Это позволяет декларативно описывать зависимости через декораторы и управлять жизненным циклом объектов (singleton, transient, request scope).

### Зависимости


```json
// apps/api/package.json (зависимости, относящиеся к DI)
{
  "dependencies": {
    "inversify": "^6.x",
    "inversify-express-utils": "^6.x",
    "reflect-metadata": "^0.2.x"
  }
}
```

> `reflect-metadata` является обязательным полифиллом для работы декораторов InversifyJS. Его необходимо импортировать **первой строкой** в точке входа (`server.ts`).

### Настройки TypeScript


В `apps/api/tsconfig.json` обязательно включить поддержку декораторов:

```json
{
  "compilerOptions": {
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true
  }
}
```

### Структура контейнера


```
apps/api/src/container/
├── types.ts        # Символы (TYPES) для идентификации привязок
└── container.ts    # Создание и настройка контейнера
```

**`container/types.ts`** — символы для всех сервисов:

```typescript
// Уникальные идентификаторы зависимостей
const TYPES = {
  AuthService:     Symbol.for('AuthService'),
  UserService:     Symbol.for('UserService'),
  ExpenseService:  Symbol.for('ExpenseService'),
  CategoryService: Symbol.for('CategoryService'),
  BudgetService:   Symbol.for('BudgetService'),
} as const;

export { TYPES };
```

**`container/container.ts`** — привязки зависимостей:

```typescript
import { Container } from 'inversify';
import { TYPES } from './types';
import { AuthService } from '../modules/auth/auth.service';
import { UserService } from '../modules/users/user.service';
// ... остальные сервисы

const container = new Container();

container.bind<AuthService>(TYPES.AuthService).to(AuthService).inSingletonScope();
container.bind<UserService>(TYPES.UserService).to(UserService).inSingletonScope();
// TODO: добавить привязки для ExpenseService, CategoryService, BudgetService

export { container };
```

### Сервис (пример)


```typescript
// modules/auth/auth.service.ts
import { injectable } from 'inversify';

@injectable()
export class AuthService {
  // TODO: implement login, register, logout
}
```

### Контроллер (пример)


```typescript
// modules/auth/auth.controller.ts
import { inject } from 'inversify';
import { controller, httpPost, requestBody } from 'inversify-express-utils';
import { TYPES } from '../../container/types';
import { AuthService } from './auth.service';

@controller('/auth')
export class AuthController {
  constructor(
    @inject(TYPES.AuthService) private readonly authService: AuthService,
  ) {}

  @httpPost('/login')
  async login(/* @requestBody() body: LoginDto */) {
    // TODO: implement
  }

  @httpPost('/register')
  async register() {
    // TODO: implement
  }
}
```

### Интеграция с Express (`app.ts`)


Вместо стандартного `express()` используется `InversifyExpressServer`, который автоматически регистрирует все контроллеры из контейнера:

```typescript
// app.ts
import 'reflect-metadata'; // должен быть первым импортом
import { InversifyExpressServer } from 'inversify-express-utils';
import { container } from './container/container';

// Импортируем контроллеры, чтобы они зарегистрировались через декораторы
import './modules/auth/auth.controller';
import './modules/users/user.controller';
import './modules/expenses/expense.controller';
import './modules/categories/category.controller';
import './modules/budgets/budget.controller';

const server = new InversifyExpressServer(container, null, { rootPath: '/api' });

server.setConfig((app) => {
  // cors, cookie-parser, json — настройки middleware
});

server.setErrorConfig((app) => {
  // глобальный error handler
});

export const app = server.build();
```

### Жизненные циклы (Scope)


| Scope | Метод | Когда использовать |
|---|---|---|
| Singleton | `.inSingletonScope()` | Сервисы без состояния (AuthService, ExpenseService и т.д.) |
| Transient | `.inTransientScope()` _(по умолчанию)_ | Объекты с состоянием, нужные в единственном экземпляре per-call |
| Request | `.inRequestScope()` | Зависимости, живущие в рамках одного HTTP-запроса |

Для этого приложения все сервисы регистрируются как **singleton** — они не хранят пользовательское состояние и просто содержат бизнес-логику.

### Middleware в DI-контексте


Middleware, которым нужны сервисы (например, `auth.middleware.ts`), наследуются от `BaseMiddleware` из `inversify-express-utils`:

```typescript
// middleware/auth.middleware.ts
import { injectable, inject } from 'inversify';
import { BaseMiddleware } from 'inversify-express-utils';
import { Request, Response, NextFunction } from 'express';

@injectable()
export class AuthMiddleware extends BaseMiddleware {
  handler(req: Request, res: Response, next: NextFunction): void {
    // TODO: проверка JWT из httpOnly cookie
    next();
  }
}
```

Такой middleware регистрируется в контейнере и подключается к контроллеру через декоратор:

```typescript
container.bind<AuthMiddleware>(AuthMiddleware).toSelf();

// В контроллере:
@httpGet('/profile', AuthMiddleware)
async getProfile() { /* ... */ }
```


***


## ⚠️ What Will NOT Be Done


- ❌ `pnpm install` is not run (structure only, no dependencies)
- ❌ No `node_modules` or `pnpm-lock.yaml` are created
- ❌ No full business logic — only scaffolds with TODO comments
- ❌ No `.env.example` files (per your request) — env variables are documented in README only
- ❌ No Husky / lint-staged
- ❌ No UI components on top of Tailwind (only basic page markup)


***


## 🚀 Next Steps After Approval


1. Create the directory structure and all files
2. Show commands for the first run (`pnpm install`, `docker compose up`, `pnpm dev`)
3. After your testing — proceed with implementing business logic module by module