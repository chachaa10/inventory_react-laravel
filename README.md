# Inventory Management System

A modern, single-page inventory management application built with Laravel, Inertia.js, React, and shadcn/ui.

## Requirements

- **PHP** — see `composer.json` (`"php"` key in `require`)
- **Node** — see `.nvmrc` or `package.json` (`engines.node`)
- **Database** — SQLite (default) or any database supported by Laravel
- **Composer** — see `composer.json` (`require`)

## Setup

```bash
composer run setup
```

This runs `composer install`, creates `.env`, generates an app key, runs migrations, installs npm dependencies, and builds assets.

For development:

```bash
composer run dev
```

Starts the Laravel server, queue worker, log monitor, and Vite dev server concurrently.

## Available Commands

### Development

| Command            | Description                         |
| ------------------ | ----------------------------------- |
| `composer run dev` | Start all dev services concurrently |
| `npm run dev`      | Start Vite dev server only          |

### Code Quality

| Command                   | Description                |
| ------------------------- | -------------------------- |
| `composer run lint`       | Run Rector + Pint          |
| `composer run lint:check` | Dry-run linters (CI)       |
| `npm run lint`            | Run oxlint                 |
| `npm run format`          | Run oxfmt                  |
| `npm run typecheck`       | Run TypeScript type checks |
| `npm run check`           | Run all checks             |

### Testing

| Command                            | Description              |
| ---------------------------------- | ------------------------ |
| `php artisan test`                 | Run all Pest tests       |
| `php artisan test --filter={name}` | Run a specific test      |
| `composer run test:types`          | PHPStan + TS type checks |
| `composer run test:lint`           | All lint checks (CI)     |

Full CI pipeline: `composer run ci:check`

## Architecture

See [PRD](PRD.md) for comprehensive planning details.

### Backend

- **Actions Pattern** — business logic in single-action classes under `app/Actions/`
- **Role-based authorization** — two roles (admin, staff) enforced via Laravel Policies
- **Events + Listeners** — `StockMoved`, `LowStockDetected`
- **Queued Jobs** — CSV exports
- **Database Notifications** — low stock alerts, export ready
- **Pest Tests** — feature tests for all critical flows

### Frontend

- **Inertia.js v3** — SPA-like UX with server-side routing
- **React + TypeScript** — with shadcn/ui primitives on Radix
- **@tanstack/react-table** — DataGrid for list views
- **recharts** — dashboard charts
- **Spatie-inspired structure** — `common/`, `modules/`, `pages/` under `resources/js/`
- **Wayfinder** — typed route/controller functions for the frontend

### Entities

| Entity          | Domain     | CRUD                                                   |
| --------------- | ---------- | ------------------------------------------------------ |
| Products        | Catalog    | Dedicated page (image upload via Spatie Media Library) |
| Categories      | Catalog    | Inline Sheet                                           |
| Suppliers       | Purchasing | Inline Sheet                                           |
| Customers       | Sales      | Inline Sheet                                           |
| Stock Movements | Inventory  | Dedicated form (via StockMovementService)              |
| Orders          | Sales      | Dedicated page (dynamic line items)                    |

### Permission Matrix

| Action                                       | Admin | Staff |
| -------------------------------------------- | ----- | ----- |
| View entities                                | ✅    | ✅    |
| Create/update products, orders, movements    | ✅    | ✅    |
| Create/edit categories, suppliers, customers | ✅    | ❌    |
| Delete entities                              | ✅    | ❌    |
| Export CSV                                   | ✅    | ❌    |
| Manage staff accounts                        | ✅    | ❌    |

### Tooling

| Tool               | Purpose             |
| ------------------ | ------------------- |
| Oxlint             | JS/TS linting       |
| Oxfmt              | JS/TS formatting    |
| Laravel Pint       | PHP formatting      |
| PHPStan (Larastan) | PHP static analysis |
| Rector             | PHP refactoring     |
| Pest               | Testing             |

## Related Documents

- [PRD](PRD.md) — full product requirements, user stories, schema
- `AGENTS.md` — development guidelines
