# PRD: Inventory Management System

## Problem Statement

The project is a greenfield Laravel 13 + Inertia + React application with authentication scaffolded (Fortify, shadcn/ui sidebar layout, settings pages) but no business domain logic. The user wants to build a portfolio-ready inventory management system over 8 weeks that demonstrates modern Laravel backend concepts (Actions pattern, service classes, events/listeners, queued jobs, notifications, policies with role-based authorization, form requests, Eloquent scopes, Pest tests) while delivering a functional MVP with shadcn/ui on the frontend.

The user follows the 80/20 principle — maximize learning and portfolio impact per unit of effort, avoid over-engineering.

## Solution

Build a three-role (superadmin + admin + staff) inventory management system with 6 database entities organized into 4 domains (Catalog, Parties, Inventory, Sales). All business logic lives in single-action classes under `app/Actions/`. Frontend uses shadcn/ui primitives with `@tanstack/react-table` DataGrid for list views, reusable Sheet-based CRUD for simple entities, and dedicated pages for complex entities (Products, Orders). Dashboard shows KPI cards, recharts charts, and low-stock alerts. Backend demonstrates Actions pattern, service classes, events/listeners, queued jobs, notifications, policies with role-based authorization, form requests, Eloquent scopes, and Pest feature tests.

## User Stories

1. As an administrator, I want to create categories for my products, so that I can organize my catalog.
2. As an administrator, I want to edit a category, so that I can correct mistakes or update descriptions.
3. As an administrator, I want to delete a category, so that I can remove unused groupings.
4. As an administrator, I want to create suppliers, so that I can track who I purchase products from.
5. As an administrator, I want to edit a supplier, so that I can update their contact information.
6. As an administrator, I want to deactivate a supplier without deleting them, so that I keep transaction history intact.
7. As an administrator, I want to reactivate a deactivated supplier, so that they become available for product selection again.
8. As an administrator, I want to archive a deactivated supplier, so that I can retire them completely while preserving history.
9. As an administrator, I want to restore an archived supplier, so that I can bring them back if needed.
10. As an operator, I want to create a product with name, SKU, description, price, cost, category, supplier, image, and reorder level, so that I can track my inventory items.
11. As an operator, I want to upload a product image, so that I can identify products visually.
12. As an operator, I want to edit a product's details, so that I can keep product information up to date.
13. As an administrator, I want to delete a product, so that I can remove discontinued items (subject to policy — no deletion if stock movements exist).
14. As an operator, I want to view a paginated, sortable, searchable list of all products, so that I can quickly find items in my catalog.
15. As an operator, I want to filter products by category and stock status, so that I can narrow down my view.
16. As an operator, I want to search products by name or SKU with debounced input, so that I can find products quickly.
17. As an operator, I want to see a badge indicating stock status (In Stock / Low Stock / Out of Stock) for each product, so that I can identify stock issues at a glance.
18. As an operator, I want to record a stock movement (in/out/adjustment) for a product, so that I can track inventory changes.
19. As an operator, I want to see a paginated history of stock movements, so that I can audit inventory changes.
20. As an operator, I want each stock movement to be recorded with type, quantity, reference, and notes, so that I have a complete audit trail.
21. As an operator, I want stock quantity to automatically update when I record a movement, so that inventory counts stay accurate.
22. As an operator, I want low stock events to fire automatically when product stock drops below reorder level, so that I can reorder in time.
23. As an operator, I want to be notified (in-app database notification) when a product goes low on stock, so that I can take action.
24. As an operator, I want to create a sales order with multiple line items, so that I can fulfill customer purchases.
25. As an operator, I want product stock to automatically decrease when I place an order, so that inventory stays synchronized.
26. As an operator, I want stock movements to be automatically created when I place an order, so that I have a complete audit trail linking orders to inventory changes.
27. As an operator, I want to cancel an order and have stock automatically restored, so that I can handle order changes.
28. As an operator, I want to view a list of all orders with their status, so that I can track fulfillment.
29. As an operator, I want to see a dashboard with KPI cards (total products, low stock count, recent orders, total revenue), so that I can monitor my business at a glance.
30. As an operator, I want to see a chart (recharts) on the dashboard showing stock distribution by category, so that I can visualize my inventory composition.
31. As an administrator, I want to export product data as CSV via a queued job, so that I can analyze data in a spreadsheet.
32. As an operator, I want to be notified when my CSV export is ready, so that I can download it.
33. As an operator, I want all destructive actions (delete, cancel, deactivate) to show a confirmation dialog, so that I don't accidentally lose data.
34. As an operator, I want to access all inventory features via a sidebar navigation, so that I can move between sections efficiently.
35. As a developer, I want Pest feature tests covering all critical flows, so that I can verify the system works correctly.
36. As a developer, I want realistic demo data via seeders and factories, so that I can demonstrate the application immediately.
37. As an administrator, I want to view the staff list with their roles and status, so that I can monitor who has access.
38. As an administrator, I want to change a staff user's role, so that I can grant or restrict permissions.
39. As an administrator, I want to deactivate or activate a staff user, so that I can control system access.
40. As an administrator, I want a confirmation dialog before deactivating or activating a staff user, so that I don't change access by accident.
41. As a staff user, I want to view products, categories, suppliers, and stock movements, so that I can do my daily work.
42. As a staff user, I want to record stock movements and create orders, so that I can handle inventory and sales operations.
43. As a staff user, I want to be prevented from deleting products, suppliers, or categories, so that I don't accidentally destroy data.
44. As a staff user, I want to be prevented from exporting data (CSV), so that sensitive business data stays controlled.

## Implementation Decisions

### Architecture

- **Actions Pattern**: All business logic lives in single-action classes under `app/Actions/{Domain}/`. Each Action has a single public `__invoke()` method and may use constructor injection for dependencies. Controllers are thin — they validate via FormRequest, call an Action, and return an Inertia response or redirect.
- **Actions Pattern (enforced)**: All business logic uses single-action classes. No service classes. Stock movement orchestration uses `RecordMovementAction` with DB transactions and `lockForUpdate()` for race-condition safety. Order-linked movements call the action directly.
- **Wayfinder**: All route-to-controller calls from frontend use Wayfinder-generated typed functions. No hardcoded URLs or raw `router.post()` calls.
- **Role Model**: A `role` enum column on the `users` table (`superadmin`, `admin`, `staff`). No separate roles/pivot table — 80/20. Superadmin has unrestricted access. Admin has full business access but can only manage staff-role users (not other admins or superadmins). Staff is restricted to operational tasks via Policies.
- **Policies**: `ProductPolicy`, `OrderPolicy`, `StockMovementPolicy`, `CategoryPolicy`, `SupplierPolicy`, `StaffPolicy` control authorization. Permission matrix:

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

- **Form Requests**: One `Store{Entity}Request` and one `Update{Entity}Request` per entity with validation rules, authorization logic, and custom error messages. Staff management uses only `UpdateStaffRequest` (no store — staff self-registers via Fortify).

### Database Schema

- PostgreSQL or SQLite. 9 tables total (7 domain + Spatie media + users).

**users** (extends default Laravel users table)

- Adds: role (enum: superadmin/admin/staff, default: staff), is_active (boolean, default true)

**categories**

- id, name (string), slug (string, unique), description (text, nullable), timestamps

**suppliers**

- id, name (string), email (string, nullable), phone (string, nullable), address (text, nullable), is_active (boolean, default true), deactivated_at (timestamp, nullable), archived_at (timestamp, nullable), timestamps

**products**

- id, name (string), sku (string, unique), description (text, nullable), price (decimal 10,2), cost (decimal 10,2, nullable), stock_qty (integer, default 0), reorder_level (integer, default 5), is_active (boolean, default true), category_id (foreign), supplier_id (foreign, nullable), timestamps, soft_deletes

**stock_movements**

- id, product_id (foreign), type (enum: in/out/adjustment), qty (integer), reference (string, nullable — order number or manual ref), notes (text, nullable), user_id (foreign), movementable_id (nullable integer), movementable_type (nullable string), timestamps

**orders**

- id, customer_name (string), customer_email (string, nullable), order_number (string, unique — auto-generated, format `ORD-{YYYYMMDD}-{XXXX}`), status (enum: pending/completed/cancelled), total (decimal 12,2), notes (text, nullable), user_id (foreign), timestamps
- Polymorphic relationship: orders have many stock_movements via movementable

**order_items**

- id, order_id (foreign), product_id (foreign), qty (integer), unit_price (decimal 10,2), subtotal (decimal 12,2), timestamps

**media** — via Spatie Media Library (default migration)

### Frontend Structure (Spatie-inspired)

```
resources/js/
├── common/
│   ├── DataGrid/           — reusable tanstack/react-table wrapper
│   ├── SearchBar/          — debounced input synced with Inertia URL
│   ├── ConfirmDialog/      — modal wrapper for destructive confirmations
│   ├── EmptyState/         — illustrated empty list placeholder
│   ├── KPICard/            — dashboard metric card with icon
│   ├── TableActions/       — shared dropdown menu for table row actions
│   └── StatusBadge/        — color-coded badge (in stock/low stock/out of stock)
├── modules/
│   ├── products/hooks/     — useProductFilters (URL-synced filter state)
│   └── orders/hooks/       — useOrderForm (line items array, dynamic totals)
├── pages/
│   ├── dashboard/
│   │   └── Index.tsx
│   ├── products/
│   │   ├── Index.tsx
│   │   ├── Create.tsx
│   │   └── Edit.tsx
│   ├── categories/
│   │   └── Index.tsx       — Sheet-based CRUD inline
│   ├── suppliers/
│   │   └── Index.tsx       — Sheet-based CRUD inline
│   ├── stock-movements/
│   │   ├── Index.tsx
│   │   └── Create.tsx
│   └── orders/
│       ├── Index.tsx
│       ├── Create.tsx
│       └── Edit.tsx
└── components/ui/          — existing shadcn primitives
```

### Routes

```
GET       /dashboard                         → DashboardController@index
GET|POST  /products                          → ProductController@index / store
GET|PUT   /products/{product}                → ProductController@edit / update
DELETE    /products/{product}                → ProductController@destroy
GET|POST  /categories                        → CategoryController@index / store
PUT|DELETE /categories/{category}            → CategoryController@update / destroy
GET|POST  /suppliers                         → SupplierController@index / store
PUT       /suppliers/{supplier}              → SupplierController@update
PUT       /suppliers/{supplier}/deactivate   → SupplierController@deactivate
PUT       /suppliers/{supplier}/activate     → SupplierController@activate
PUT       /suppliers/{supplier}/archive      → SupplierController@archive
PUT       /suppliers/{supplier}/restore      → SupplierController@restore
GET|POST  /stock-movements                   → StockMovementController@index / store
GET|POST  /orders                            → OrderController@index / store
GET|PUT   /orders/{order}                    → OrderController@edit / update (cancel)
POST      /exports/products                  → ExportController@products (queued CSV)
GET       /notifications                     → NotificationController@index
GET      /settings/staff                    → StaffController@index
PUT|DELETE /settings/staff/{user}            → StaffController@update / destroy
```

### Navigation Structure

```
Dashboard
Inventory
  └─ Products
  └─ Categories
  └─ Stock Movements
Purchasing
  └─ Suppliers
Sales
  └─ Orders
Settings (existing — profile, password, 2FA)
  └─ Staff Management (admin only)
```

### Key Interactions

- **Record Movement**: User selects product → enters type (in/out/adjustment), qty, reference, notes → submits → `StockMovementService` validates sufficient stock (if type=out) → creates StockMovement → updates product.stock_qty → dispatches `StockMoved` event → if new stock_qty <= reorder_level, dispatches `LowStockDetected` event → listener creates database notification.
- **Place Order**: User creates order with customer name + line items → submits → `CreateOrderAction` wraps in DB transaction: creates Order → creates OrderItems (computes subtotals/total) → calls `StockMovementService` to record out movement for each product (linked via movementable morph) → dispatches events.
- **Cancel Order**: User clicks cancel → `CancelOrderAction` wraps in DB transaction: sets order status to cancelled → calls `StockMovementService` to record in movement for each cancelled item (restoring stock) → dispatches events.
- **CSV Export**: User clicks "Export Products" → dispatches `ExportProductsCsv` job → job generates CSV in storage → job creates database notification "Export ready" → user sees notification badge → clicks to download.

### Dashboard Data Shape (Inertia shared props)

```
{
  kpis: {
    totalProducts: int,
    lowStockCount: int,
    recentOrders: int,
    totalRevenue: float,
  },
  stockByCategory: [{ category: string, count: int }],
  recentMovements: [{ id, product, type, qty, created_at }],
  lowStockAlerts: [{ id, product, stock_qty, reorder_level }],
}
```

## Testing Decisions

### Testing Philosophy

- Tests verify **behavior, not implementation**. Test what the Action does, not how it does it. For example, test that `CreateProductAction` creates a product with the given data and returns a Product model — don't test that it calls `Product::create()` or that it uses a specific query builder method.
- Feature tests interact with the system through HTTP endpoints (Inertia requests). Unit tests test Actions and Services in isolation.
- Avoid testing Laravel internals (framework routing, Eloquent save mechanics) or trivial getters.

### Test Coverage

- **Product CRUD** — create with valid/invalid data, update, delete (with and without stock movements), search/filter
- **Stock Movement** — record in/out/adjustment, insufficient stock rejection, automatic stock_qty update
- **Order Lifecycle** — create order with line items, stock deduction, cancel and restore
- **Low Stock Notification** — stock movement below reorder_level generates notification
- **CSV Export** — job dispatches and creates notification
- **Policies** — unauthenticated user cannot create/edit/delete; staff cannot delete products, categories, or suppliers; staff cannot export CSV

### Prior Art

- `tests/Feature/` already exists with the Laravel default `ExampleTest.php`
- The project already uses Pest (v4) with `pestphp/pest-plugin-laravel`
- Test pattern: `php artisan make:test --pest {Name}` produces test files matching existing convention
- Tests use `RefreshDatabase` trait for isolation
- Factories use model factories (`database/factories/`) — existing `UserFactory.php` is the pattern

## Out of Scope

- **Multi-tenant** — single-tenant; all users share one organization
- **Purchase Orders / Receiving** — manual stock-in movement covers receiving; no separate PO flow
- **Warehouses / Locations** — single virtual warehouse assumed
- **Units of Measure** — `unit` string field on Product covers this trivially
- **Barcode scanning** — hardware integration is a separate project
- **Real-time updates (Reverb)** — adds weeks of setup; user refreshes for data
- **SSR (server-side rendering)** — overkill for single-admin inventory app
- **Inline DataGrid editing** — all edits go through a dedicated form or Sheet
- **Email notifications** — database-only notifications for MVP
- **API endpoints** — Inertia-only; no REST API tier
- **Dark mode toggle** — already supported by existing shadcn/sidebar theme setup

## Changes from Original Spec

The following decisions were made during schema review and deviate from the initial spec. These reflect critical thinking about referential integrity, audit trail quality, and practical inventory management defaults.

### Schema Changes

| Change                                     | Original                  | Revised                                                  | Rationale                                                                                            |
| ------------------------------------------ | ------------------------- | -------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| `products.category_id`                     | nullable, cascadeOnDelete | **required**, nullOnDelete                               | Products must belong to a category. Soft-deleting a category shouldn't cascade-delete products.      |
| `products.unit`                            | (not present)             | **added** — string, default `'pcs'`                      | Without unit, stock_qty is ambiguous (pieces vs kg vs liters). Default 'pcs' covers the common case. |
| `stock_movements.before_qty` / `after_qty` | (not present)             | **added** — integer                                      | Self-verifying audit trail. Enables rebuilding stock_qty from scratch and detecting drift.           |
| `stock_movements.product_id` FK            | cascadeOnDelete           | **restrictOnDelete**                                     | Force-deleting a product must not wipe its stock movement history.                                   |
| `stock_movements.user_id` FK               | cascadeOnDelete           | **restrictOnDelete**                                     | Deleting a user must not wipe their audit trail.                                                     |
| `orders.customer_id` FK → inline fields    | customers table + FK      | **dropped**. `customer_name`, `customer_email` on orders | Customer entity removed (80/20). Inline fields on order are sufficient for MVP.                      |
| `orders.user_id` FK                        | cascadeOnDelete           | **restrictOnDelete**                                     | Same rationale as stock_movements — retain user attribution in transactions.                         |
| `order_items.product_id` FK                | cascadeOnDelete           | **restrictOnDelete**                                     | Force-deleting a product must not wipe order line items.                                             |
| `date:orders.status` string                | plain string (comment)    | **PHP backed enum** `OrderStatus`                        | Type safety, autocomplete, validation. Column stays string in DB.                                    |
| `stock_movements.type` string              | plain string (comment)    | **PHP backed enum** `StockMovementType`                  | Same rationale.                                                                                      |
| `order_number` format                      | unspecified               | **`ORD-{YYYYMMDD}-{XXXX}`**                              | Date-based with daily-reset sequence. Self-documenting, sortable, human-readable.                    |

### Behavioral Changes

| Behavior                | Original                  | Revised                                                | Rationale                                                                                                                                                                                                                              |
| ----------------------- | ------------------------- | ------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| SKU uniqueness          | unique (deleted ignored)  | **permanently unique** (including soft-deleted)        | Reusing a SKU from a discontinued product confuses old orders and movements.                                                                                                                                                           |
| Product->category FK    | cascadeOnDelete           | **nullOnDelete**                                       | Category deletion archived → products lose category reference but survive.                                                                                                                                                             |
| Order tax/discount      | unspecified               | **skipped for MVP**                                    | 80/20 — line item subtotals + total cover the MVP. Tax logic adds complexity without proportional learning value.                                                                                                                      |
| Customer entity         | separate entity + CRUD    | **removed** — inline `customer_name`/`email` on orders | 80/20 — managing customer master data adds ~200 lines of code for no inventory logic benefit. Staff types customer name on order form.                                                                                                 |
| Staff invite flow       | store + InviteStaffAction | **removed** — no create/invite                         | Registration is open via Fortify. Admin only needs view, role change, and deactivate.                                                                                                                                                  |
| `users.is_active`       | (not present)             | **added** — boolean, default true                      | Enables deactivation without soft-deleting users. Preserves audit trail FK integrity.                                                                                                                                                  |
| Supplier lifecycle      | delete only               | **deactivate → reactivate → archive → restore**        | Suppliers have a multi-stage lifecycle. Deactivation preserves history, archive is permanent retirement. `destroy` renamed to `deactivate` to match intent.                                                                            |
| Supplier default filter | active only               | **all**                                                | Newly created suppliers are active; deactivated suppliers should remain visible. Default "all" prevents confusion when a supplier disappears after deactivation.                                                                       |
| Table action buttons    | inline icon groups        | **unified EllipsisVertical dropdown**                  | Multiple inline icons cluttered the table. Single `⋮` dropdown with `[icon] + [label]` is cleaner and scales. Shared `TableActions` component across suppliers, categories, products, and staff. Orders excluded (single View action). |
| Staff toggle action     | immediate on click        | **confirmation dialog**                                | Deactivating a user is destructive — now requires dialog confirmation, matching the suppliers pattern.                                                                                                                                 |

## Further Notes

- This PRD expects `spatie/laravel-medialibrary`, `@tanstack/react-table`, and `recharts` to be installed.
- The build order must respect entity dependencies: Categories + Suppliers (independent) → Products → StockMovements → Orders.
- 80/20 rule applies: simple entities (Categories, Suppliers) get Sheet-based inline CRUD; complex entities (Products, Orders) get dedicated pages. Customers are inline on the order form.
- The Actions pattern is from nunomaduro/laravel-starter-kit. Spatie's frontend structure (common/modules/pages) informs the frontend layout. Wayfinder bridges TypeScript type safety between them.
- Role is a simple string enum column on users (`superadmin`/`admin`/`staff`) — not Spatie Permission. 80/20 rule: this covers the authorization learning objective without the overhead of a full package. The three-tier hierarchy allows a superadmin to manage all accounts, an admin to manage staff-only accounts, and staff to only perform operational tasks.
- Dashboard replaces the existing placeholder at `resources/js/pages/dashboard.tsx` and the Dashboard index file should be a directory-based page.
