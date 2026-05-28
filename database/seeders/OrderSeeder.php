<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\StockMovement;
use App\Models\User;
use Illuminate\Database\Seeder;

class OrderSeeder extends Seeder
{
    public function run(): void
    {
        $user = User::query()->where('email', 'admin@example.com')->firstOrFail();

        $hdmiCable = Product::query()->where('sku', 'SKU-ELEC-003')->firstOrFail();
        $mouse = Product::query()->where('sku', 'SKU-ELEC-001')->firstOrFail();

        $order = Order::factory()->create([
            'customer_name' => 'Alice Johnson',
            'customer_email' => 'alice@example.com',
            'order_number' => 'ORD-20260527-0001',
            'status' => 'completed',
            'total' => 55.97,
            'notes' => 'First customer order',
            'user_id' => $user->id,
        ]);

        $lineItems = [
            [$hdmiCable, 2, 100],
            [$mouse, 1, 45],
        ];

        $orderItemData = [];
        foreach ($lineItems as [$product, $qty, $beforeQty]) {
            $afterQty = $beforeQty - $qty;

            $orderItemData[] = [
                'order_id' => $order->id,
                'product_id' => $product->id,
                'qty' => $qty,
                'unit_price' => $product->price,
                'subtotal' => $qty * $product->price,
            ];

            StockMovement::factory()->create([
                'product_id' => $product->id,
                'type' => 'out',
                'qty' => $qty,
                'before_qty' => $beforeQty,
                'after_qty' => $afterQty,
                'reference' => $order->order_number,
                'notes' => 'Order fulfillment',
                'user_id' => $user->id,
                'movementable_id' => $order->id,
                'movementable_type' => Order::class,
            ]);
        }

        OrderItem::factory()->createMany($orderItemData);
    }
}
