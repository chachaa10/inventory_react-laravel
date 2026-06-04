<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\StockMovement;
use App\Models\User;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Seeder;

class OrderSeeder extends Seeder
{
    public function run(): void
    {
        if (Order::query()->getQuery()->count() > 5) {
            return;
        }

        /** @var Collection<int, User> */
        $users = User::all();

        /** @var Collection<int, Product> */
        $products = Product::all();

        $orderCount = 100;

        for ($i = 0; $i < $orderCount; $i++) {
            $daysAgo = random_int(1, 365);
            $hoursAgo = random_int(0, 23);
            $createdAt = now()->subDays($daysAgo)->subHours($hoursAgo);

            $status = random_int(0, 10) > 1 ? 'completed' : 'cancelled';

            $order = Order::factory()->create([
                'user_id' => $users->random()->id,
                'status' => $status,
                'created_at' => $createdAt,
                'updated_at' => $createdAt,
            ]);

            $itemCount = random_int(1, 5);
            $selected = $products->random(min($itemCount, $products->count()));
            $total = 0;

            foreach ($selected as $product) {
                $qty = random_int(1, 5);
                $subtotal = (float) ($qty * $product->price);
                $total += $subtotal;

                OrderItem::factory()->create([
                    'order_id' => $order->id,
                    'product_id' => $product->id,
                    'qty' => $qty,
                    'unit_price' => $product->price,
                    'subtotal' => $subtotal,
                ]);

                if ($status === 'completed') {
                    $beforeQty = $product->stock_qty;
                    $afterQty = max(0, $beforeQty - $qty);

                    StockMovement::factory()->create([
                        'product_id' => $product->id,
                        'type' => 'out',
                        'qty' => $qty,
                        'before_qty' => $beforeQty,
                        'after_qty' => $afterQty,
                        'reference' => $order->order_number,
                        'notes' => 'Order fulfillment',
                        'user_id' => $order->user_id,
                        'movementable_id' => $order->id,
                        'movementable_type' => Order::class,
                        'created_at' => $createdAt,
                        'updated_at' => $createdAt,
                    ]);

                    $product->decrement('stock_qty', $qty);
                }
            }

            $order->update(['total' => $total]);
        }

        for ($i = 0; $i < 40; $i++) {
            $product = $products->random();
            $qty = random_int(10, 100);
            $daysAgo = random_int(1, 365);
            $createdAt = now()->subDays($daysAgo);

            $beforeQty = $product->stock_qty;

            StockMovement::factory()->create([
                'product_id' => $product->id,
                'type' => 'in',
                'qty' => $qty,
                'before_qty' => $beforeQty,
                'after_qty' => $beforeQty + $qty,
                'reference' => 'RESTOCK-'.$createdAt->format('Ymd'),
                'notes' => 'Supplier restock',
                'user_id' => $users->random()->id,
                'created_at' => $createdAt,
                'updated_at' => $createdAt,
            ]);

            $product->increment('stock_qty', $qty);
        }

        for ($i = 0; $i < 15; $i++) {
            $product = $products->random();
            $qty = random_int(1, 10);
            $daysAgo = random_int(1, 365);
            $createdAt = now()->subDays($daysAgo);

            $beforeQty = $product->stock_qty;
            $isAddition = (bool) random_int(0, 1);
            $delta = $isAddition ? $qty : -$qty;
            $afterQty = max(0, $beforeQty + $delta);

            StockMovement::factory()->create([
                'product_id' => $product->id,
                'type' => 'adjustment',
                'qty' => $qty,
                'before_qty' => $beforeQty,
                'after_qty' => $afterQty,
                'reference' => 'ADJ-'.$createdAt->format('Ymd'),
                'notes' => ($isAddition ? 'Cycle count surplus' : 'Cycle count discrepancy'),
                'user_id' => $users->random()->id,
                'created_at' => $createdAt,
                'updated_at' => $createdAt,
            ]);

            $product->update(['stock_qty' => $afterQty]);
        }
    }
}
