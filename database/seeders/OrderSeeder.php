<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\StockMovement;
use Illuminate\Database\Seeder;

class OrderSeeder extends Seeder
{
    public function run(): void
    {
        $order = Order::factory()->create([
            'customer_name' => 'Alice Johnson',
            'customer_email' => 'alice@example.com',
            'order_number' => 'ORD-20260527-0001',
            'status' => 'completed',
            'total' => 74.97,
            'notes' => 'First customer order',
            'user_id' => 1,
        ]);

        OrderItem::factory()->createMany([
            ['order_id' => $order->id, 'product_id' => 3, 'qty' => 2, 'unit_price' => 12.99, 'subtotal' => 25.98],
            ['order_id' => $order->id, 'product_id' => 1, 'qty' => 1, 'unit_price' => 29.99, 'subtotal' => 29.99],
            ['order_id' => $order->id, 'product_id' => 8, 'qty' => 2, 'unit_price' => 9.50, 'subtotal' => 19.00],
        ]);

        StockMovement::factory()->create([
            'product_id' => 3,
            'type' => 'out',
            'qty' => 2,
            'before_qty' => 102,
            'after_qty' => 100,
            'reference' => 'ORD-20260527-0001',
            'notes' => 'Order fulfillment',
            'user_id' => 1,
            'movementable_id' => $order->id,
            'movementable_type' => Order::class,
        ]);

        StockMovement::factory()->create([
            'product_id' => 1,
            'type' => 'out',
            'qty' => 1,
            'before_qty' => 46,
            'after_qty' => 45,
            'reference' => 'ORD-20260527-0001',
            'notes' => 'Order fulfillment',
            'user_id' => 1,
            'movementable_id' => $order->id,
            'movementable_type' => Order::class,
        ]);
    }
}
