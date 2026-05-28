<laravel-boost-guidelines>

## Core Setup

- **Skills**: MUST activate relevant `**/skills/**` domain skills immediately.
- **Conventions**: Follow existing code structure/naming. Use descriptive names. Reuse existing components.
- **Structure**: Stick to existing dirs; no new base folders/dependencies without approval.
- **Docs**: Only create if explicitly requested.
- **Packages**: Frontend → pnpm. Backend → composer.
- **Frontend build**: If UI changes not visible, ask user run `pnpm run build/dev` or `composer run dev`.

## Tools & Verification

- **Boost Tools**: Prefer over manual shell/file reads.
- **`database-query`**: Read-only DB queries.
- **`database-schema`**: Inspect tables before migrations/models.
- **`get-absolute-url`**: Resolve correct URLs.
- **`browser-logs`**: Check recent JS errors/logs.
- **Search Docs** (`search-docs`): **MANDATORY** before code changes. Use broad topic queries. Do not include package names.
- **Testing**: Write/update tests first. Run `php artisan test --compact`. **Never delete tests without approval.**

## Pre-Ship Gate

Every change must pass ALL before pushing:

```
composer lint     # phpstan + tsc + oxlint
php artisan test --compact
pnpm run build    # (only if UI files changed)
vendor/bin/pint --dirty --format agent  # (only if PHP files changed)
```

Known quirk: `tsc --noEmit` errors on `.form()` are pre-existing across the project — the Vite plugin provides it at build time, typechecker can't resolve virtual modules. Ignore.

## PHP & Laravel

### Conventions
- Syntax: PHP 8+ constructor property promotion. Explicit return types/type hints. Curly braces for all control structures. PHPDoc > inline comments. TitleCase Enums.
- Artisan: `php artisan make:` with `--no-interaction`. Use `route:list`, `config:show`, `.env` for inspection.
- Tinker: Single quotes (`'Code'`) to prevent shell expansion. Prefer factories/tests over creating models in tinker.
- Eloquent/API: Use API Resources & versioning for APIs (unless convention differs). Use `route()` for links.

### PHPStan Max Level Gotchas
- **Never use `@phpstan-ignore`** — find a real fix.
- **`findOrFail`/`find` returns `Model|Collection`** → Use `$query->where('id', $id)->firstOrFail()` or `->first()` for narrow `TModel` type.
- **"Dynamic call to static method" false positive** on `orderBy`, `reorder`, `lockForUpdate`, `select`, `addSelect`, `leftJoin`, `lockForUpdate`. Fix: `$builder->getQuery()->methodName()`.
- **`fake()->randomElement(Enum::cases())->value`** → `randomElement` returns `mixed`. Fix: `array_map(fn($t) => $t->value, Enum::cases())` to produce typed `list<string>` before `randomElement`.
- **`intval(mixed)` also rejected** → use `is_int()` guard with `throw` instead.

### Eloquent Gotchas
- **`lockForUpdate()` + stale reference**: Locking a row but discarding the result leaves stale data. Read the column directly from the locked query in one round-trip.
- **`SoftDeletes` + eager loading**: `->with('relation')` implicitly adds `WHERE deleted_at IS NULL` on the related model. Use `LEFT JOIN` with aliased columns instead of eager loading when trashed rows should still appear.

## Frontend: Inertia + React

### Inertia v3
- Components in `resources/js/pages`. Use `Inertia::render()`.
- `useHttp` hook, optimistic updates, `useLayoutProps`, simplified SSR (`@inertiajs/vite`).
- `Inertia::lazy()` → `Inertia::optional()`. Axios removed. Events: `invalid` → `httpException`, `exception` → `networkError`.
- `router.cancel()` → `router.cancelAll()`. Deferred props need skeleton loading states.

### Form Conventions
- **Use `<Form>` component** (not `useForm`). Every form uses `<Form>` with Wayfinder `.form()` spread.
- **Create/Edit toggle**: `key={editing?.id ?? 'create'}` on `<Form>` to remount.
- **Delete operations**: `<Form {...destroy.form(id)}>` inside `<Dialog>` with `<button type="submit">`, not `router.delete()`.
- **Errors**: Access via `errors['field']` (bracket notation, see TS strict rules).
- **Validation**: Laravel redirects back with errors on failure; `<Form>` render props provide `errors` automatically.

### `<Form>` Render Props (v3.3.0)
- **Only exposes**: `errors`, `processing`, `submit`, `getData`, `getFormData` — **NO `data`/`setData`**.
- **Text inputs**: Use `name` + `defaultValue` (uncontrolled). The Form reads DOM values on submit.
- **Controlled components** (shadcn `<Select>`, button groups): Use local `useState` + `<input type="hidden" name="field" value={state}>`.

### Sheet/Dialog + Form Nesting
- **`<Form>` goes inside `<SheetContent>`/`<DialogContent>`**, not outside. Radix renders via Portal at `<body>` level.
- Always: `Dialog > DialogContent > Form > button[type=submit]`.
- Use `onSuccess` callback to close the Sheet/Dialog. Use `resetOnSuccess`.

### DataGrid & @tanstack/react-table
- **`accessorKey` does NOT resolve nested dot notation** (`'product.name'` → `undefined`). Use `accessorFn: (row) => row.product?.name`.
- **Cell renderers**: Extract to module-level functions taking `{ row }: { row: Row<T> }`. Never define inline (oxlint blocks it).
- **Pagination**: Always `->paginate()` on server. DataGrid renders rows only — use `<Paginator>` below it.

### Authorization-based UI Hiding
- Access role via `usePage().props.auth.user['role']`.
- Conditionally include DataGrid columns: `...(canManage ? [createActionsColumn(...)] : [])`.
- Hide create buttons and EmptyState CTAs when user lacks permission (pass `action={undefined}`).
- Route-level `auth` middleware guarantees user is non-null on protected pages.

### Oxlint & TypeScript Strict Rules
- **`noUncheckedIndexedAccess`**: Always bracket notation — `errors['field']`, `user['role']`, `user['name']`. Never `errors.field`.
- **`react/no-unstable-nested-components`**: No eslint-disable. Extract inline components to module-level.
- **`@stylistic(padding-line-between-statements)`**: Blank lines between assignments and control-flow inside blocks.

## Wayfinder

- `@laravel/vite-plugin-wayfinder` with `formVariants: true` generates virtual modules (not on disk).
- Import from `@/actions/App/Http/Controllers/{Controller}` for controller actions, or `@/routes/{group}` for named routes.
- `.form()` returns `{ action: string, method: 'post' }` — PATCH/DELETE spoofed via `_method` query param.
- Regenerate after changing routes: `php artisan wayfinder:generate`.

## Testing (Pest)

- Creation: `php artisan make:test --pest {Name}` (e.g., `SomeFeatureTest`, not `Feature/SomeFeatureTest`).
- Execution: `php artisan test --compact` (filter with `--filter=name`).
- Factories: Always use model factories/states in tests. Use `fake()` or `$this->faker`.
- If column `NOT NULL` in migration (e.g., `category_id`), factory MUST set it or tests fail.

</laravel-boost-guidelines>
