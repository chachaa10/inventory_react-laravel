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

## Wayfinder & Pint

- Wayfinder: Import TS functions from `@/actions/` (controllers) or `@/routes/` (named routes).
- Pint: If PHP files modified, MUST run `vendor/bin/pint --dirty --format agent` before finalizing.

## Testing (Pest)

- Creation: `php artisan make:test --pest {Name}` (e.g., `SomeFeatureTest`, not `Feature/SomeFeatureTest`).
- Execution: `php artisan test --compact` (filter with `--filter=name`).
- Factories: Always use model factories/states in tests. Use `fake()` or `$this->faker` per convention.

</laravel-boost-guidelines>
