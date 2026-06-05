<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use App\Models\StockMovement;
use App\Models\Supplier;
use App\Models\User;
use Illuminate\Database\Eloquent\Collection;

class BulkProductSeeder
{
    /**
     * @param  Collection<int, Category>  $categories
     * @param  Collection<int, Supplier>  $suppliers
     * @param  Collection<int, Product>  $manualProducts
     */
    public static function run(Collection $categories, Collection $suppliers, Collection $manualProducts, User $user): void
    {
        $manualSkuMap = [];
        foreach ($manualProducts as $p) {
            $manualSkuMap[$p->sku] = true;
        }

        $existingSkuMap = $manualSkuMap;
        foreach (Product::all(['sku']) as $p) {
            $existingSkuMap[$p->sku] = true;
        }

        $targetPerCategory = 10;

        foreach ($categories as $category) {
            $manualCount = 0;
            foreach ($manualProducts as $manualProduct) {
                if ($manualProduct->category_id === $category->id) {
                    ++$manualCount;
                }
            }

            $needed = $targetPerCategory - $manualCount;

            for ($i = 0; $i < $needed; ++$i) {
                $sku = self::generateUniqueSku($existingSkuMap, $category);

                $supplier = $suppliers->random();

                Product::factory()->create([
                    'sku' => $sku,
                    'category_id' => $category->id,
                    'supplier_id' => $supplier->id,
                ]);

                $existingSkuMap[$sku] = true;
            }
        }

        $bulkProducts = Product::query()->getQuery()
            ->whereNotIn('sku', array_keys($manualSkuMap))
            ->get();

        foreach ($bulkProducts as $bulkProduct) {
            $stockQty = $bulkProduct->stock_qty;

            StockMovement::factory()->create([
                'product_id' => $bulkProduct->id,
                'type' => 'in',
                'qty' => $stockQty,
                'before_qty' => 0,
                'after_qty' => $stockQty,
                'reference' => 'INITIAL',
                'notes' => 'Initial stock',
                'user_id' => $user->id,
            ]);
        }
    }

    /**
     * @param  array<string, mixed>  $existingSkus
     */
    private static function generateUniqueSku(array &$existingSkus, Category $category): string
    {
        $cleaned = preg_replace('/[^A-Z]/', '', $category->slug);
        $prefix = strtoupper(substr((string) $cleaned, 0, 4));

        do {
            $sku = 'SKU-'.$prefix.'-'.str_pad((string) random_int(1, 9999), 4, '0', STR_PAD_LEFT);
        } while (isset($existingSkus[$sku]));

        return $sku;
    }
}
