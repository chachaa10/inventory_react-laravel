# WBS: Inventory Management System

## 1. Project Setup & Foundation

### 1.1 Environment & Dependencies

- [x] 1.1.1 Install `spatie/laravel-medialibrary`
- [x] 1.1.2 Install `@tanstack/react-table`
- [x] 1.1.3 Install `recharts`
- [x] 1.1.4 Configure Wayfinder for typed routes

### 1.2 Database Schema

- [x] 1.2.1 Create migration: add `role` column to `users`
- [x] 1.2.2 Create migration: `categories` table (with soft deletes)
- [x] 1.2.3 Create migration: `suppliers` table
- [x] 1.2.4 Create migration: `products` table (unit, category_id required, soft deletes)
- [x] 1.2.5 Create migration: `customers` table (with address)
- [x] 1.2.6 Create migration: `stock_movements` table (before_qty, after_qty, polymorphic, restrictOnDelete FKs)
- [x] 1.2.7 Create migration: `orders` table (nullOnDelete customer, restrictOnDelete user)
- [x] 1.2.8 Create migration: `order_items` table (restrictOnDelete product)

### 1.3 PHP Backed Enums

- [x] 1.3.1 Create `App\Enums\StockMovementType` (In, Out, Adjustment)
- [x] 1.3.2 Create `App\Enums\OrderStatus` (Pending, Completed, Cancelled)

### 1.4 Eloquent Models & Factories

- [x] 1.4.1 Create `Category` model + factory
- [x] 1.4.2 Create `Supplier` model + factory
- [x] 1.4.3 Create `Product` model + factory
- [x] 1.4.4 Create `Customer` model + factory
- [x] 1.4.5 Create `StockMovement` model + factory
- [x] 1.4.6 Create `Order` model + factory
- [x] 1.4.7 Create `OrderItem` model + factory
- [x] 1.4.8 Create `User` model updates (role enum, casts)
- [x] 1.4.9 Create database seeder with realistic demo data

### 1.5 Frontend Foundation

- [ ] 1.5.1 Create `DataGrid` reusable component (`@tanstack/react-table`)
- [ ] 1.5.2 Create `SearchBar` debounced input component
- [ ] 1.5.3 Create `ConfirmDialog` destructive confirmation modal
- [ ] 1.5.4 Create `EmptyState` placeholder component
- [ ] 1.5.5 Create `KPICard` dashboard metric component
- [ ] 1.5.6 Create `StatusBadge` stock status badge component
- [ ] 1.5.7 Set up sidebar navigation (Dashboard, Inventory, Purchasing, Sales, Settings)
- [ ] 1.5.8 Set up Inertia shared props for auth user with role

## 2. Catalog Domain

### 2.1 Categories (Sheet-based CRUD)

- [ ] 2.1.1 Create `CategoryController` + routes
- [ ] 2.1.2 Create `StoreCategoryRequest` / `UpdateCategoryRequest`
- [ ] 2.1.3 Create `Actions/Catalog/CreateCategoryAction`
- [ ] 2.1.4 Create `Actions/Catalog/UpdateCategoryAction`
- [ ] 2.1.5 Create `Actions/Catalog/DeleteCategoryAction`
- [ ] 2.1.6 Create `CategoryPolicy` (admin: all, staff: view only)
- [ ] 2.1.7 Build `Categories/Index.tsx` (DataGrid + Sheet-based create/edit)
- [ ] 2.1.8 Write Pest feature tests for Category CRUD + policy

### 2.2 Products (Dedicated Pages)

- [ ] 2.2.1 Create `ProductController` + routes
- [ ] 2.2.2 Create `StoreProductRequest` / `UpdateProductRequest`
- [ ] 2.2.3 Create `Actions/Catalog/CreateProductAction`
- [ ] 2.2.4 Create `Actions/Catalog/UpdateProductAction`
- [ ] 2.2.5 Create `Actions/Catalog/DeleteProductAction`
- [ ] 2.2.6 Create `ProductPolicy` (admin: all, staff: no delete)
- [ ] 2.2.7 Build `Products/Index.tsx` (DataGrid with search, filter by category & stock status)
- [ ] 2.2.8 Build `Products/Create.tsx` (form with image upload via Spatie media)
- [ ] 2.2.9 Build `Products/Edit.tsx` (form with image replacement)
- [ ] 2.2.10 Create `useProductFilters` hook (URL-synced filter state)
- [ ] 2.2.11 Write Pest feature tests for Product CRUD + search/filter + policy

## 3. Parties Domain

### 3.1 Suppliers (Sheet-based CRUD)

- [ ] 3.1.1 Create `SupplierController` + routes
- [ ] 3.1.2 Create `StoreSupplierRequest` / `UpdateSupplierRequest`
- [ ] 3.1.3 Create `Actions/Parties/CreateSupplierAction`
- [ ] 3.1.4 Create `Actions/Parties/UpdateSupplierAction`
- [ ] 3.1.5 Create `Actions/Parties/DeactivateSupplierAction`
- [ ] 3.1.6 Create `SupplierPolicy` (admin: all, staff: view only)
- [ ] 3.1.7 Build `Suppliers/Index.tsx` (DataGrid + Sheet-based CRUD)
- [ ] 3.1.8 Write Pest feature tests for Supplier CRUD + policy

## 4. Inventory Domain

### 4.1 Stock Movements

- [ ] 4.1.1 Create `StockMovementController` + routes
- [ ] 4.1.2 Create `StoreStockMovementRequest`
- [ ] 4.1.3 Create `Actions/Inventory/RecordMovementAction`
- [ ] 4.1.4 Create `StockMovementService` (transactional orchestration)
- [ ] 4.1.5 Create `StockMovementPolicy` (admin/staff: create & view)
- [ ] 4.1.6 Create `Events/StockMoved` event
- [ ] 4.1.7 Create `Events/LowStockDetected` event
- [ ] 4.1.8 Create `Listeners/HandleLowStock` (creates database notification)
- [ ] 4.1.9 Add `stock_qty` auto-update logic on movement creation
- [ ] 4.1.10 Build `StockMovements/Index.tsx` (paginated history DataGrid)
- [ ] 4.1.11 Build `StockMovements/Create.tsx` (product select, type, qty, reference, notes)
- [ ] 4.1.12 Write Pest feature tests for stock movement CRUD, insufficient stock, notification

## 5. Sales Domain

### 5.1 Orders

- [ ] 5.1.1 Create `OrderController` + routes
- [ ] 5.1.2 Create `StoreOrderRequest` / `UpdateOrderRequest`
- [ ] 5.1.3 Create `Actions/Sales/CreateOrderAction` (transaction: order + items + stock deduction)
- [ ] 5.1.4 Create `Actions/Sales/CancelOrderAction` (transaction: cancel + stock restoration)
- [ ] 5.1.5 Create `OrderPolicy` (admin/staff: create & view; admin: cancel)
- [ ] 5.1.6 Build `Orders/Index.tsx` (DataGrid with status filter)
- [ ] 5.1.7 Build `Orders/Create.tsx` (customer name input + dynamic line items via `useOrderForm`)
- [ ] 5.1.8 Build `Orders/Edit.tsx` (cancel action with ConfirmDialog)
- [ ] 5.1.9 Create `useOrderForm` hook (line items array, subtotals, total computation)
- [ ] 5.1.10 Write Pest feature tests for order lifecycle (create, cancel, stock sync)

## 6. Dashboard

### 6.1 Dashboard Page

- [ ] 6.1.1 Create `DashboardController` + route
- [ ] 6.1.2 Create `Actions/Dashboard/GetDashboardDataAction`
- [ ] 6.1.3 Build `Dashboard/Index.tsx` with KPI cards (total products, low stock, recent orders, revenue)
- [ ] 6.1.4 Add recharts chart (stock distribution by category)
- [ ] 6.1.5 Add recent stock movements list
- [ ] 6.1.6 Add low stock alerts section
- [ ] 6.1.7 Replace placeholder dashboard file with directory-based page

## 7. Notifications & Exports

### 7.1 In-App Notifications

- [ ] 7.1.1 Create `NotificationController` + route
- [ ] 7.1.2 Build notification badge in sidebar
- [ ] 7.1.3 Build `Notifications/Index.tsx` (list of database notifications)
- [ ] 7.1.4 Mark-as-read functionality

### 7.2 CSV Export

- [ ] 7.2.1 Create `ExportController` + route
- [ ] 7.2.2 Create `Jobs/ExportProductsCsv` queued job
- [ ] 7.2.3 Create notification "Export Ready" on job completion
- [ ] 7.2.4 Build download link in export notification
- [ ] 7.2.5 Write Pest feature tests for export job + notification

## 8. User Management (Admin)

### 8.1 Staff Management

- [ ] 8.1.1 Create `StaffController` + routes (under Settings)
- [ ] 8.1.2 Create `StoreStaffRequest` / `UpdateStaffRequest`
- [ ] 8.1.3 Create `Actions/Admin/InviteStaffAction`
- [ ] 8.1.4 Create `Actions/Admin/UpdateStaffAction`
- [ ] 8.1.5 Create `Actions/Admin/DeactivateStaffAction`
- [ ] 8.1.6 Build `Settings/Staff/Index.tsx` (admin-only, DataGrid + Sheet-based CRUD)
- [ ] 8.1.7 Write Pest feature tests for staff management + policy
