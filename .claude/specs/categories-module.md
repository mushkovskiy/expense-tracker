# Categories Module Implementation Plan

## Context

The categories module is fully **scaffolded** but its business logic is stubbed:
- `CategoryService` methods throw `Not implemented`
- `CategoryController` routes return `501 Not Implemented`

Everything around the logic already exists and should be **reused, not recreated**:
- **Model** — `apps/api/src/models/category.model.ts` (`CategoryModel`: `user` ref, `name`, `color`, `icon`, timestamps)
- **Validation** — `packages/validation/src/category.schema.ts` (`createCategorySchema`, `updateCategorySchema`, `CreateCategoryInput`, `UpdateCategoryInput`)
- **Shared type** — `packages/types/src/category.ts` (`ICategory`)
- **DI wiring** — `CategoryService` already bound in `container.ts`; controller already imported in `app.ts`
- **Auth** — `@controller('/categories', AuthMiddleware)` already applied; `req.user.sub` holds the user id

The goal: make all four CRUD endpoints functional, scoped to the authenticated user, following the existing auth/users module patterns. Per decisions: **enforce unique category name per user**, **no automated tests** this round.

## Reference patterns to follow

- **Mapper**: `apps/api/src/modules/users/user.mapper.ts` (`toIUser`) — doc → shared interface
- **Service**: `apps/api/src/modules/users/user.service.ts` + `auth.service.ts` (uses `HttpError` for domain errors)
- **Controller**: `apps/api/src/modules/users/user.controller.ts` (reads `req.user?.sub`, returns `{ success: true, data: {...} }`)
- **Errors**: throw `HttpError(status, message)` from `apps/api/src/middleware/error.middleware.ts` — caught globally

## Checklist

### 1. Model — enforce per-user unique name
- [ ] In `apps/api/src/models/category.model.ts`, replace the existing `@index({ user: 1 })` with a compound unique index `@index({ user: 1, name: 1 }, { unique: true })`.

### 2. Mapper (new file)
- [ ] Create `apps/api/src/modules/categories/category.mapper.ts` with `toICategory(doc: DocumentType<Category>): ICategory`, mirroring `toIUser`:
  - `id: doc._id.toString()`
  - `userId: doc.user.toString()`
  - `name`, `color`, `icon`
  - `createdAt` / `updatedAt` via `new Date(doc.createdAt ?? 0).toISOString()`

### 3. Service — `apps/api/src/modules/categories/category.service.ts`
- [ ] `list(userId)` → `CategoryModel.find({ user: userId }).sort({ createdAt: -1 })`, map each via `toICategory`.
- [ ] `create(userId, dto)` → guard against duplicate name: `findOne({ user: userId, name: dto.name })`; if found, `throw new HttpError(409, 'Category name already exists')`. Otherwise `CategoryModel.create({ user: userId, ...dto })`, return `toICategory`.
- [ ] `update(userId, id, dto)` → if `dto.name` provided, reject a collision with a *different* category (`findOne({ user: userId, name, _id: { $ne: id } })` → 409). Then `findOneAndUpdate({ _id: id, user: userId }, dto, { new: true })`; if `null` → `throw new HttpError(404, 'Category not found')`; return `toICategory`.
- [ ] `remove(userId, id)` → `findOneAndDelete({ _id: id, user: userId })`; if `null` → `throw new HttpError(404, 'Category not found')`; return nothing (controller sends 204/success).
- [ ] Replace stub imports: drop the `throw` bodies; import `CategoryModel`, `HttpError`, `toICategory`. Keep `@injectable()`.
- [ ] Ownership is always enforced by including `user: userId` in every query filter.

### 4. Controller — `apps/api/src/modules/categories/category.controller.ts`
- [ ] Add `@request() req: Request` + `import type { Request } from 'express'`; helper to read `const userId = req.user?.sub` and `throw new HttpError(401, 'Unauthorized')` if missing (matches `user.controller.ts`).
- [ ] `list` → `res.status(200).json({ success: true, data: { categories } })`.
- [ ] `create` → typed `@requestBody() body: CreateCategoryInput`; `res.status(201).json({ success: true, data: { category } })`.
- [ ] `update` → typed `@requestBody() body: UpdateCategoryInput`; `res.status(200).json({ success: true, data: { category } })`.
- [ ] `remove` → `res.status(200).json({ success: true, data: { success: true } })` (consistent with `auth.controller` logout shape).
- [ ] Remove the `_` underscore prefixes and the `TODO`/501 lines; keep `validateBody(...)` middleware already wired on create/update.

### 5. Verify build & lint
- [ ] `pnpm --filter api build` — compiles clean (tsc).
- [ ] `pnpm lint` — no Biome issues (no unused imports/vars left from the stubs).

## Verification (end-to-end)

1. Start infra + API: `docker compose up -d` then `pnpm --filter api dev` (and `MONGO_URI` set).
2. Register/login to obtain the `accessToken` cookie (use a cookie jar):
   ```bash
   curl -c jar.txt -X POST localhost:4000/api/auth/register \
     -H 'Content-Type: application/json' \
     -d '{"email":"t@t.com","password":"password123","name":"T"}'
   ```
3. Exercise CRUD with the cookie jar (`-b jar.txt`):
   - `POST /api/categories` `{"name":"Food","color":"#ff0000"}` → **201**, returns category with `id`.
   - `POST` same name again → **409**.
   - `GET /api/categories` → **200**, array contains the category.
   - `PUT /api/categories/:id` `{"color":"#00ff00"}` → **200**, updated.
   - `PUT`/`DELETE` with a random/foreign id → **404** (ownership scoping).
   - `DELETE /api/categories/:id` → **200**; subsequent `GET` no longer lists it.
4. Confirm any request **without** the cookie → **401** (AuthMiddleware).

## Out of scope
- Automated tests (explicitly deferred).
- Frontend wiring (`apps/web`).
- Changes to validation schemas / shared types (already sufficient).
