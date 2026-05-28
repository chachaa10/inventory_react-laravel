<laravel-boost-guidelines>

## Core Activation & Architecture

- Skills: MUST activate relevant `**/skills/**` domain skills immediately.
- Conventions: Follow existing code structure/naming. Use descriptive names. Reuse existing components.
- Structure: Stick to existing dirs; no new base folders/dependencies without approval.
- Docs: Only create if explicitly requested.
- Frontend: If UI changes not visible, ask user run `pnpm run build/dev` or `composer run dev`.

## Package Management

- Frontend: pnpm (not npm/yarn/bun)
- Backend: composer

## Tools & Verification

- Boost Tools: Prefer over manual shell/file reads
- `database-query`: Read-only DB queries.
- `database-schema`: Inspect tables before migrations/models.
- `get-absolute-url`: Resolve correct URLs.
- `browser-logs`: Check recent JS errors/logs.
- Search Docs (`search-docs`): **MANDATORY** before code changes. Use broad topic-based queries (e.g., `['rate limiting', 'routing']`). Do not include package names.
- Testing: Every change must be tested. Write/update tests first. Run minimal affected tests via `php artisan test --compact`. **Never delete tests without approval.**

## PHP & Laravel Standards

- Syntax: PHP 8+ constructor property promotion. Explicit return types/type hints. Curly braces for all control structures. PHPDoc > inline comments. TitleCase Enums.
- Artisan: Use `php artisan make:` for files. Pass `--no-interaction`. Use `route:list`, `config:show`, `.env` for inspection.
- Tinker: Use single quotes (`'Code'`) to prevent shell expansion. Prefer factories/tests over creating models in tinker.
- Eloquent/API: Use API Resources & versioning for APIs (unless convention differs). Use `route()` for links.

## Frontend (Inertia + React)

### Inertia v3

- Components in `resources/js/pages`. Use `Inertia::render()`.
- `useHttp` hook, optimistic updates, `useLayoutProps`, simplified SSR (`@inertiajs/vite`).
- `Inertia::lazy()` removed → Use `Inertia::optional()`. Axios removed. Events: `invalid` → `httpException`, `exception` → `networkError`.
- `router.cancel()` → `router.cancelAll()`. Deferred props need skeleton loading states.

### Form Conventions

- **Use `<Form>` component** (not `useForm`). Every form uses `<Form>` with Wayfinder `.form()` spread.
- **Create/Edit toggle**: `key={editing?.id ?? 'create'}` on `<Form>` to remount. Set initial values via `defaultValue` on inputs.
- **Delete operations**: `<Form {...destroy.form(id)}>` inside `<Dialog>` with `<button type="submit">`, not `router.delete()`.
- **Errors**: Access via `errors['field']`.
- **Validation**: Laravel redirects back with validation errors on failure; `<Form>` render props provide `errors` automatically.

### Authorization-based UI hiding

- Access user role via `usePage().props.auth.user['role']`.
- Conditionally include DataGrid columns: `...(canManage ? [createActionsColumn(...)] : [])`.
- Hide create buttons and EmptyState CTAs when user lacks permission (pass `action={undefined}`).
- Route-level `auth` middleware guarantees user is non-null on protected pages.

### Oxlint & TypeScript Strict Rules

- **`noUncheckedIndexedAccess`**: All index-signature props require bracket notation — `errors['field']`, `user['role']`, `user['name']`. Never `errors.field` or `user.role`.
- **`react/no-unstable-nested-components`**: Extract tanstack `cell` renderers to module-level functions, passing callbacks as params. No eslint-disable comments.
- **`@stylistic(padding-line-between-statements)`**: Blank lines required between assignments and control-flow statements inside blocks.

## Wayfinder & Pint

- Wayfinder: `@laravel/vite-plugin-wayfinder` with `formVariants: true` generates virtual modules (not on disk). Import from `@/actions/App/Http/Controllers/{Controller}` for controller actions, or `@/routes/{group}` for named routes.
- `.form()` returns `{ action: string, method: 'post' }` — PATCH/DELETE spoofed via `_method` query param.
- Pint: If PHP files modified, MUST run `vendor/bin/pint --dirty --format agent` before finalizing.

## Testing (Pest)

- Creation: `php artisan make:test --pest {Name}` (e.g., `SomeFeatureTest`, not `Feature/SomeFeatureTest`).
- Execution: `php artisan test --compact` (filter with `--filter=name`).
- Factories: Always use model factories/states in tests. Use `fake()` or `$this->faker`.

## Learnings

### PHPStan max level + Rector

- **Never use `@phpstan-ignore` comments.** Find a real fix.
- PHPStan at max level falsely flags Eloquent Builder methods (`orderBy`, `reorder`) as "Dynamic call to static method". Fix: call via `$builder->getQuery()->orderBy('name')` to bypass.
- Rector's `EloquentMagicMethodToQueryBuilderRector` auto-converts `Model::orderBy()` → `Model::query()->orderBy()`. Always chain through `query()`; static shortcut gets rewritten anyway.

### UI cell renderers

- Extract all `@tanstack/react-table` `cell` renderers to module-level functions taking `{ row }: { row: Row<T> }`. Never define inline — oxlint's `no-unstable-nested-components` blocks it.

### Pagination

- **Always use `->paginate()` on server** for every list (Inertia convention). Small datasets use high per-page (e.g., 100) so all rows return, but shape always `{ data, meta, links }`.
- **DataGrid has no built-in pagination** — renders rows only. Use `<Paginator>` below DataGrid for server pagination controls. All lists follow this pattern.

### Factory Gotchas

- If column `NOT NULL` in migration (e.g., `category_id`), factory MUST set it or tests referencing `Product::factory()` fail with integrity constraint violations.

### Radix Dialog + Inertia Form nesting

- **`<Form>` must go inside `<DialogContent>`, not outside.** Radix DialogContent renders via Portal at `<body>` level. If Form wraps DialogContent, submit button lives outside `<form>` — clicking does nothing. Always: `Dialog > DialogContent > Form > ... > button[type=submit]`.

</laravel-boost-guidelines>
