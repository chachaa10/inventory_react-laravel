<?php

declare(strict_types=1);

namespace App\Actions\Dashboard;

use App\Models\Order;
use App\Models\Product;
use App\Models\StockMovement;
use Illuminate\Support\Collection;
use Illuminate\Support\Number;

class GetDashboardDataAction
{
    /** @return array{totalProducts: int, lowStockCount: int, recentOrdersCount: int, totalRevenue: string, stockByCategory: Collection<int, array{category: string, count: int}>, recentMovements: Collection<int, array{id: int, product: string, type: string, qty: int, date: string}>, lowStockAlerts: Collection<int, array{id: int, name: string, stock: int, reorder: int}>} */
    public function execute(): array
    {
        $totalProducts = Product::query()->getQuery()->count();

        $lowStockQuery = Product::query();
        $lowStockQuery->getQuery()->whereColumn('stock_qty', '<=', 'reorder_level');
        $lowStockCount = $lowStockQuery->getQuery()->count();

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
                if (! is_string($category)) {
                    throw new \RuntimeException('Category must be a string');
                }

                $count = $row->count;
                if (! is_int($count)) {
                    throw new \RuntimeException('Count must be an int');
                }

                return [
                    'category' => $category,
                    'count' => $count,
                ];
            });

        $recentMovementsQuery = StockMovement::query();
        $recentMovementsQuery->getQuery()->take(5);
        $recentMovements = $recentMovementsQuery
            ->with('product:id,name')
            ->latest()
            ->get()
            ->map(fn (StockMovement $movement): array => $this->extractMovement($movement));

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
            'recentMovements' => $recentMovements,
            'lowStockAlerts' => $lowStockAlerts,
        ];
    }

    /** @return array{id: int, product: string, type: string, qty: int, date: string} */
    private function extractMovement(StockMovement $movement): array
    {
        return [
            'id' => $movement->id,
            'product' => isset($movement->product) ? $movement->product->name : 'Deleted Product',
            'type' => is_string($movement->type) ? $movement->type : $movement->type->value,
            'qty' => $movement->qty,
            'date' => $movement->created_at?->toISOString() ?? '',
        ];
    }
}
