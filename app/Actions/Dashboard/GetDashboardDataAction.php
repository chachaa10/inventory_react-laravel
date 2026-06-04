<?php

declare(strict_types=1);

namespace App\Actions\Dashboard;

use App\Exceptions\UnexpectedDataException;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\StockMovement;
use Illuminate\Support\Collection;
use Illuminate\Support\Number;

class GetDashboardDataAction
{
    /** @return array{totalProducts: int, lowStockCount: int, recentOrdersCount: int, totalRevenue: string, stockByCategory: Collection<int, array{category: string, count: int}>, recentMovements: Collection<int, array{id: int, product: string, type: string, qty: int, date: string}>, lowStockAlerts: Collection<int, array{id: int, name: string, stock: int, reorder: int}>, monthlyRevenue: Collection<int, array{month: string, revenue: float}>, monthlyOrders: Collection<int, array{month: string, count: int}>, ordersByStatus: Collection<int, array{status: string, count: int}>, topSellingProducts: Collection<int, array{name: string, qty: int}>, supplierDistribution: Collection<int, array{supplier: string, count: int}>, stockLevelDistribution: Collection<int, array{range: string, count: int}>, stockMovementsTrend: Collection<int, array{month: string, in: int, out: int, adjustment: int}>} */
    public function execute(): array
    {
        $totalProducts = Product::query()->getQuery()->count();

        $builder = Product::query();
        $builder->getQuery()->whereColumn('stock_qty', '<=', 'reorder_level');
        $lowStockCount = $builder->getQuery()->count();

        $recentOrdersQuery = Order::query();
        $recentOrdersQuery->getQuery()->where('created_at', '>=', now()->subDays(30));
        $recentOrdersCount = $recentOrdersQuery->getQuery()->count();

        $revenueQuery = Order::query();
        $revenueQuery->getQuery()->where('status', 'completed');
        $totalRevenue = $revenueQuery->getQuery()->sum('total');

        $stockByCategory = Product::query()
            ->getQuery()
            ->selectRaw('categories.name as category, count(*) as count')
            ->join('categories', 'products.category_id', '=', 'categories.id')
            ->groupBy('categories.name')
            ->orderByDesc('count')
            ->get()
            ->map(function (object $row): array {
                $category = $row->category;
                throw_unless(is_string($category), UnexpectedDataException::class, 'Category must be a string');

                $count = $row->count;
                throw_unless(is_int($count), UnexpectedDataException::class, 'Count must be an int');

                return [
                    'category' => $category,
                    'count' => $count,
                ];
            });

        $monthlyRevenue = Order::query()
            ->getQuery()
            ->selectRaw("strftime('%Y-%m', created_at) as month, sum(total) as revenue")
            ->where('status', 'completed')
            ->where('created_at', '>=', now()->subYear())
            ->groupBy('month')
            ->orderBy('month')
            ->get()
            ->map(function (object $row): array {
                $month = $row->month;
                throw_unless(is_string($month), UnexpectedDataException::class, 'Month must be a string');

                $revenue = $row->revenue;
                throw_unless(is_numeric($revenue), UnexpectedDataException::class, 'Revenue must be numeric');

                return [
                    'month' => $month,
                    'revenue' => (float) $revenue,
                ];
            });

        $monthlyOrders = Order::query()
            ->getQuery()
            ->selectRaw("strftime('%Y-%m', created_at) as month, count(*) as count")
            ->where('created_at', '>=', now()->subYear())
            ->groupBy('month')
            ->orderBy('month')
            ->get()
            ->map(function (object $row): array {
                $month = $row->month;
                throw_unless(is_string($month), UnexpectedDataException::class, 'Month must be a string');

                $count = $row->count;
                throw_unless(is_int($count), UnexpectedDataException::class, 'Count must be an int');

                return [
                    'month' => $month,
                    'count' => $count,
                ];
            });

        $ordersByStatus = Order::query()
            ->getQuery()
            ->selectRaw('status, count(*) as count')
            ->groupBy('status')
            ->orderByDesc('count')
            ->get()
            ->map(function (object $row): array {
                $status = $row->status;
                throw_unless(is_string($status), UnexpectedDataException::class, 'Status must be a string');

                $count = $row->count;
                throw_unless(is_int($count), UnexpectedDataException::class, 'Count must be an int');

                return [
                    'status' => $status,
                    'count' => $count,
                ];
            });

        $topSellingProducts = OrderItem::query()
            ->getQuery()
            ->selectRaw('products.name as name, sum(order_items.qty) as qty')
            ->join('products', 'order_items.product_id', '=', 'products.id')
            ->groupBy('products.name')
            ->orderByDesc('qty')
            ->limit(10)
            ->get()
            ->map(function (object $row): array {
                $name = $row->name;
                throw_unless(is_string($name), UnexpectedDataException::class, 'Name must be a string');

                $qty = $row->qty;
                throw_unless(is_int($qty), UnexpectedDataException::class, 'Qty must be an int');

                return [
                    'name' => $name,
                    'qty' => $qty,
                ];
            });

        $supplierDistribution = Product::query()
            ->getQuery()
            ->selectRaw('suppliers.name as supplier, count(*) as count')
            ->join('suppliers', 'products.supplier_id', '=', 'suppliers.id')
            ->groupBy('suppliers.name')
            ->orderByDesc('count')
            ->get()
            ->map(function (object $row): array {
                $supplier = $row->supplier;
                throw_unless(is_string($supplier), UnexpectedDataException::class, 'Supplier must be a string');

                $count = $row->count;
                throw_unless(is_int($count), UnexpectedDataException::class, 'Count must be an int');

                return [
                    'supplier' => $supplier,
                    'count' => $count,
                ];
            });

        $stockLevelDistribution = Product::query()
            ->getQuery()
            ->selectRaw("
                CASE
                    WHEN stock_qty = 0 THEN '0'
                    WHEN stock_qty <= 10 THEN '1-10'
                    WHEN stock_qty <= 50 THEN '11-50'
                    WHEN stock_qty <= 100 THEN '51-100'
                    WHEN stock_qty <= 500 THEN '101-500'
                    ELSE '500+'
                END as range,
                count(*) as count
            ")
            ->groupBy('range')
            ->get()
            ->map(function (object $row): array {
                $range = $row->range;
                throw_unless(is_string($range), UnexpectedDataException::class, 'Range must be a string');

                $count = $row->count;
                throw_unless(is_int($count), UnexpectedDataException::class, 'Count must be an int');

                return [
                    'range' => $range,
                    'count' => $count,
                ];
            });

        $stockMovementsTrend = StockMovement::query()
            ->getQuery()
            ->selectRaw("strftime('%Y-%m', created_at) as month")
            ->selectRaw("sum(CASE WHEN type = 'in' THEN qty ELSE 0 END) as \"in\"")
            ->selectRaw("sum(CASE WHEN type = 'out' THEN qty ELSE 0 END) as \"out\"")
            ->selectRaw("sum(CASE WHEN type = 'adjustment' THEN qty ELSE 0 END) as adjustment")
            ->where('created_at', '>=', now()->subYear())
            ->groupBy('month')
            ->orderBy('month')
            ->get()
            ->map(function (object $row): array {
                $month = $row->month;
                throw_unless(is_string($month), UnexpectedDataException::class, 'Month must be a string');

                $in = $row->in;
                throw_unless(is_numeric($in), UnexpectedDataException::class, 'In must be numeric');

                $out = $row->out;
                throw_unless(is_numeric($out), UnexpectedDataException::class, 'Out must be numeric');

                $adjustment = $row->adjustment;
                throw_unless(is_numeric($adjustment), UnexpectedDataException::class, 'Adjustment must be numeric');

                return [
                    'month' => $month,
                    'in' => (int) $in,
                    'out' => (int) $out,
                    'adjustment' => (int) $adjustment,
                ];
            });

        $recentMovementsQuery = StockMovement::query();
        $recentMovementsQuery->getQuery()->take(5);
        $recentMovements = $recentMovementsQuery
            ->with('product:id,name')
            ->latest()
            ->get()
            ->map(fn (StockMovement $stockMovement): array => $this->extractMovement($stockMovement));

        $lowStockAlertsQuery = Product::query();
        $lowStockAlertsQuery->getQuery()->whereColumn('stock_qty', '<=', 'reorder_level');
        $lowStockAlertsQuery->getQuery()->orderBy('stock_qty');
        $lowStockAlertsQuery->getQuery()->limit(10);
        $lowStockAlerts = $lowStockAlertsQuery
            ->get()
            ->map(fn (Product $product): array => [
                'id' => $product->id,
                'name' => $product->name,
                'stock' => $product->stock_qty,
                'reorder' => $product->reorder_level,
            ]);

        $currencyResult = Number::currency((float) $totalRevenue, 'USD');
        $formattedRevenue = $currencyResult !== false ? $currencyResult : '$0.00';

        return [
            'totalProducts' => $totalProducts,
            'lowStockCount' => $lowStockCount,
            'recentOrdersCount' => $recentOrdersCount,
            'totalRevenue' => $formattedRevenue,
            'stockByCategory' => $stockByCategory,
            'monthlyRevenue' => $monthlyRevenue,
            'monthlyOrders' => $monthlyOrders,
            'ordersByStatus' => $ordersByStatus,
            'topSellingProducts' => $topSellingProducts,
            'supplierDistribution' => $supplierDistribution,
            'stockLevelDistribution' => $stockLevelDistribution,
            'stockMovementsTrend' => $stockMovementsTrend,
            'recentMovements' => $recentMovements,
            'lowStockAlerts' => $lowStockAlerts,
        ];
    }

    /** @return array{id: int, product: string, type: string, qty: int, date: string} */
    private function extractMovement(StockMovement $stockMovement): array
    {
        return [
            'id' => $stockMovement->id,
            'product' => isset($stockMovement->product) ? $stockMovement->product->name : 'Deleted Product',
            'type' => is_string($stockMovement->type) ? $stockMovement->type : $stockMovement->type->value,
            'qty' => $stockMovement->qty,
            'date' => $stockMovement->created_at?->toISOString() ?? '',
        ];
    }
}
