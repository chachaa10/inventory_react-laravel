# Inventory Management System

A modern, single-page inventory management application built with Laravel, Inertia.js, React, and shadcn/ui.

## Features

- **Three-role authorization** — superadmin, admin, staff with hierarchical permissions
- **Supplier lifecycle management** — deactivate, activate, archive, restore (no hard deletes)
- **Product catalog with images** — Spatie Media Library for uploads
- **Stock movement audit trail** — pessimistic locking, before/after quantities, polymorphic references
- **Order management** — dynamic line items, auto stock deduction, cancellation with restoration
- **Low-stock notifications** — database notifications via `LowStockDetected` event listener
- **CSV exports** — queued jobs with download notifications
- **Dashboard** — KPI cards + stock distribution chart (recharts)
- **Modern stack** — Laravel 13, Inertia.js v3, React 18, TypeScript, shadcn/ui, Pest tests

## Requirements

- **PHP** — see `composer.json` (`"php"` key in `require`)
- **PNPM** — see `package.json`
- **Database** — SQLite (default) or any database supported by Laravel
- **Composer** — see `composer.json` (`require`)

## Setup

```bash
composer run setup
```

This runs `composer install`, creates `.env`, generates an app key, runs migrations, installs pnpm dependencies, and builds assets.

For development:

```bash
composer run dev
```

Starts the Laravel server, queue worker, log monitor, and Vite dev server concurrently.

## Default Credentials

The database seeder generates the following default user accounts for testing and environment setup:

| Name        | Email                  | Role       |
| ----------- | ---------------------- | ---------- |
| Super Admin | superadmin@example.com | Superadmin |
| Admin       | admin{1-3}@example.com | Admin      |

## Tooling

| Tool               | Purpose             |
| ------------------ | ------------------- |
| Oxlint             | JS/TS linting       |
| Oxfmt              | JS/TS formatting    |
| Laravel Pint       | PHP formatting      |
| PHPStan (Larastan) | PHP static analysis |
| Rector             | PHP refactoring     |
| Pest               | Testing             |

## Available Commands

### Development

| Command            | Description                         |
| ------------------ | ----------------------------------- |
| `composer run dev` | Start all dev services concurrently |
| `pnpm run dev`     | Start Vite dev server only          |

### Code Quality

| Command                   | Description                |
| ------------------------- | -------------------------- |
| `composer run lint`       | Run Rector + Pint          |
| `composer run lint:check` | Dry-run linters (CI)       |
| `pnpm run lint`           | Run oxlint                 |
| `pnpm run format`         | Run oxfmt                  |
| `pnpm run typecheck`      | Run TypeScript type checks |
| `pnpm run check`          | Run all checks             |

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
- **Role-based authorization** — three roles (`superadmin`, `admin`, `staff`) with hierarchy: superadmin manages all accounts, admin manages staff only, staff performs operations
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

| Entity          | Domain     | CRUD                                                                |
| --------------- | ---------- | ------------------------------------------------------------------- |
| Products        | Catalog    | Dedicated page (image upload via Spatie Media Library)              |
| Categories      | Catalog    | Inline Sheet                                                        |
| Suppliers       | Purchasing | Inline Sheet (lifecycle: deactivate → activate → archive → restore) |
| Stock Movements | Inventory  | Dedicated form (via RecordMovementAction)                           |
| Orders          | Sales      | Dedicated page (dynamic line items)                                 |

### Permission Matrix

| Action                                | Superadmin | Admin | Staff |
| ------------------------------------- | ---------- | ----- | ----- |
| View any entity                       | ✅         | ✅    | ✅    |
| Create product, order, stock movement | ✅         | ✅    | ✅    |
| Record stock movement                 | ✅         | ✅    | ✅    |
| Update product, order                 | ✅         | ✅    | ✅    |
| Create/edit categories, suppliers     | ✅         | ✅    | ❌    |
| Delete any entity                     | ✅         | ✅    | ❌    |
| Export CSV                            | ✅         | ✅    | ❌    |
| View staff list                       | ✅         | ✅    | ❌    |
| Manage any staff user                 | ✅         | ❌    | ❌    |
| Manage staff-role users only          | ✅         | ✅    | ❌    |
| Manage admin/superadmin accounts      | ✅         | ❌    | ❌    |
