<laravel-boost-guidelines>

## Core Activation & Architecture

- Skills: MUST activate relevant `**/skills/**` domain skills immediately.
- Conventions: Strictly follow existing code structure/naming. Use descriptive names (e.g., `isRegisteredForDiscounts`). Reuse existing components.
- Structure: Stick to existing dirs; no new base folders/dependencies without approval.
- Docs: Only create docs if explicitly requested.
- Frontend: If UI changes aren't visible, ask user to run `pnpm run build/dev` or `composer run dev`.

## Package Management

- Frontend: Use `pnpm add <package>` (not npm).
- Backend: Use `composer require <package>`.

## Tools & Verification

- Boost Tools: Prefer over manual shell/file reads
- `database-query`: Read-only DB queries.
- `database-schema`: Inspect tables before migrations/models.
- `get-absolute-url`: Resolve correct URLs.
- `browser-logs`: Check recent JS errors/logs.
- Search Docs (`search-docs`): **MANDATORY** before code changes. Use broad, topic-based queries (e.g., `['rate limiting', 'routing']`). Do not include package names in queries.
- Testing: Every change must be tested. Write/update tests first. Run minimal affected tests via `php artisan test --compact`. **Never delete tests without approval.**

## PHP & Laravel Standards

- Syntax: PHP 8+ constructor property promotion. Explicit return types/type hints. Curly braces for all control structures. PHPDoc > inline comments. TitleCase Enums.
- Artisan: Use `php artisan make:` for files. Pass `--no-interaction`. Use `route:list`, `config:show`, `.env` for inspection.
- Tinker: Use single quotes (`'Code'`) to prevent shell expansion. Prefer factories/tests over creating models in tinker.
- Eloquent/API: Use API Resources & versioning for APIs (unless convention differs). Use `route()` for links.

## Inertia v3 Specifics

- Setup: Components in `resources/js/pages`. Use `Inertia::render()`.
- v3 Features: `useHttp` hook, optimistic updates, `useLayoutProps`, simplified SSR (`@inertiajs/vite`).
- Changes:
- `Inertia::lazy()` removed → Use `Inertia::optional()`.
- Axios removed → Use built-in XHR or install Axios.
- Events: `invalid` → `httpException`, `exception` → `networkError`.
- `router.cancel()` → `router.cancelAll()`.
- Deferred props need skeleton loading states.

### Form Conventions

- **Use `<Form>` component** (not `useForm`). Every form in the codebase uses `<Form>` with Wayfinder `.form()` spread.
- **Create/Edit toggle**: Use `key={editing?.id ?? 'create'}` on `<Form>` to remount when switching modes. Set initial values via `defaultValue` on inputs.
- **Delete operations**: Use `<Form {...destroy.form(id)}>` inside `<Dialog>` with `<button type="submit">`, not `router.delete()`.
- **Errors**: Access via `errors['field']` bracket notation (required by strict TS `noUncheckedIndexedAccess`).
- **Validation**: Laravel redirects back with validation errors on failure; `<Form>` render props provide `errors` automatically.

### Oxlint: `react/no-unstable-nested-components`

Extract tanstack/react-table `cell` renderers to module-level functions, passing callbacks as parameters. Do NOT use eslint-disable comments.

## Wayfinder & Pint

- Wayfinder: `@laravel/vite-plugin-wayfinder` with `formVariants: true` generates virtual modules (not on disk). Import from `@/actions/App/Http/Controllers/{Controller}` for controller actions, or `@/routes/{group}` for named routes.
- `.form()` returns `{ action: string, method: 'post' }` — PATCH/DELETE are spoofed via `_method` query param.
- Pint: If PHP files modified, MUST run `vendor/bin/pint --dirty --format agent` before finalizing.

## Testing (Pest)

- Creation: `php artisan make:test --pest {Name}` (e.g., `SomeFeatureTest`, not `Feature/SomeFeatureTest`).
- Execution: `php artisan test --compact` (filter with `--filter=name`).
- Factories: Always use model factories/states in tests. Use `fake()` or `$this->faker` per convention.

</laravel-boost-guidelines>
