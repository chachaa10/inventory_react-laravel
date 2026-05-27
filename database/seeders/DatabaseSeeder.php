<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use App\Models\StockMovement;
use App\Models\Supplier;
use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $admin = User::factory()->create([
            'name' => 'Admin User',
            'email' => 'admin@example.com',
            'role' => 'admin',
        ]);

        User::factory()->create([
            'name' => 'Staff User',
            'email' => 'staff@example.com',
            'role' => 'staff',
        ]);

        $electronics = Category::factory()->create(['name' => 'Electronics', 'slug' => 'electronics', 'description' => 'Electronic devices and accessories']);
        $office = Category::factory()->create(['name' => 'Office Supplies', 'slug' => 'office-supplies', 'description' => 'Stationery and office essentials']);
        $cleaning = Category::factory()->create(['name' => 'Cleaning', 'slug' => 'cleaning', 'description' => 'Cleaning products and equipment']);
        $packaging = Category::factory()->create(['name' => 'Packaging', 'slug' => 'packaging', 'description' => 'Boxes, tape, and shipping materials']);
        $beverages = Category::factory()->create(['name' => 'Beverages', 'slug' => 'beverages', 'description' => 'Drinks and refreshments']);

        $techDist = Supplier::factory()->create(['name' => 'TechDistributor Inc.', 'email' => 'orders@techdistributor.com', 'phone' => '555-0101', 'address' => '123 Tech Lane, Silicon Valley, CA']);
        $officeMart = Supplier::factory()->create(['name' => 'OfficeMart', 'email' => 'sales@officemart.com', 'phone' => '555-0102', 'address' => '456 Business Ave, New York, NY']);
        $cleanSupply = Supplier::factory()->create(['name' => 'CleanSupply Co.', 'email' => 'info@cleansupply.com', 'phone' => '555-0103', 'address' => '789 Industrial Blvd, Chicago, IL']);
        $packRight = Supplier::factory()->create(['name' => 'PackRight Ltd.', 'email' => 'hello@packright.com', 'phone' => '555-0104', 'address' => '321 Warehouse Dr, Houston, TX']);
        $bevDistro = Supplier::factory()->create(['name' => 'BevDistro', 'email' => 'contact@bevdistro.com', 'phone' => '555-0105', 'address' => '654 Beverage St, Portland, OR']);

        $mouse = Product::factory()->create(['name' => 'Wireless Mouse', 'sku' => 'SKU-ELEC-001', 'price' => 29.99, 'cost' => 12.50, 'stock_qty' => 44, 'reorder_level' => 10, 'category_id' => $electronics->id, 'supplier_id' => $techDist->id]);
        $usbHub = Product::factory()->create(['name' => 'USB-C Hub', 'sku' => 'SKU-ELEC-002', 'price' => 49.99, 'cost' => 22.00, 'stock_qty' => 30, 'reorder_level' => 8, 'category_id' => $electronics->id, 'supplier_id' => $techDist->id]);
        $hdmiCable = Product::factory()->create(['name' => 'HDMI Cable 2m', 'sku' => 'SKU-ELEC-003', 'price' => 12.99, 'cost' => 4.50, 'stock_qty' => 98, 'reorder_level' => 20, 'category_id' => $electronics->id, 'supplier_id' => $techDist->id]);
        $a4Paper = Product::factory()->create(['name' => 'A4 Printer Paper (500)', 'sku' => 'SKU-OFF-001', 'price' => 8.99, 'cost' => 3.50, 'stock_qty' => 200, 'reorder_level' => 50, 'category_id' => $office->id, 'supplier_id' => $officeMart->id]);
        $pens = Product::factory()->create(['name' => 'Ballpoint Pen (Box/12)', 'sku' => 'SKU-OFF-002', 'price' => 6.99, 'cost' => 2.50, 'stock_qty' => 150, 'reorder_level' => 30, 'category_id' => $office->id, 'supplier_id' => $officeMart->id]);
        $stickyNotes = Product::factory()->create(['name' => 'Sticky Notes (Pack)', 'sku' => 'SKU-OFF-003', 'price' => 4.99, 'cost' => 1.80, 'stock_qty' => 75, 'reorder_level' => 20, 'category_id' => $office->id, 'supplier_id' => $officeMart->id]);
        $cleaner = Product::factory()->create(['name' => 'All-Purpose Cleaner 1L', 'sku' => 'SKU-CLN-001', 'price' => 7.99, 'cost' => 3.20, 'stock_qty' => 60, 'reorder_level' => 15, 'category_id' => $cleaning->id, 'supplier_id' => $cleanSupply->id]);
        $cloth = Product::factory()->create(['name' => 'Microfiber Cloth (Set/5)', 'sku' => 'SKU-CLN-002', 'price' => 9.99, 'cost' => 4.00, 'stock_qty' => 40, 'reorder_level' => 10, 'category_id' => $cleaning->id, 'supplier_id' => $cleanSupply->id]);
        $boxS = Product::factory()->create(['name' => 'Corrugated Box S', 'sku' => 'SKU-PKG-001', 'price' => 2.99, 'cost' => 1.00, 'stock_qty' => 3, 'reorder_level' => 50, 'category_id' => $packaging->id, 'supplier_id' => $packRight->id]);
        $tape = Product::factory()->create(['name' => 'Packing Tape Roll', 'sku' => 'SKU-PKG-002', 'price' => 3.99, 'cost' => 1.50, 'stock_qty' => 2, 'reorder_level' => 30, 'category_id' => $packaging->id, 'supplier_id' => $packRight->id]);
        $bubbleWrap = Product::factory()->create(['name' => 'Bubble Wrap 10m', 'sku' => 'SKU-PKG-003', 'price' => 14.99, 'cost' => 6.00, 'stock_qty' => 1, 'reorder_level' => 10, 'category_id' => $packaging->id, 'supplier_id' => $packRight->id]);
        $water = Product::factory()->create(['name' => 'Spring Water 500ml (Case/24)', 'sku' => 'SKU-BEV-001', 'price' => 18.99, 'cost' => 9.00, 'stock_qty' => 80, 'reorder_level' => 20, 'category_id' => $beverages->id, 'supplier_id' => $bevDistro->id]);
        $greenTea = Product::factory()->create(['name' => 'Organic Green Tea (Box/20)', 'sku' => 'SKU-BEV-002', 'price' => 14.99, 'cost' => 6.50, 'stock_qty' => 35, 'reorder_level' => 10, 'category_id' => $beverages->id, 'supplier_id' => $bevDistro->id]);
        $sparklingWater = Product::factory()->create(['name' => 'Sparkling Water Can (Case/12)', 'sku' => 'SKU-BEV-003', 'price' => 22.99, 'cost' => 11.00, 'stock_qty' => 0, 'reorder_level' => 15, 'category_id' => $beverages->id, 'supplier_id' => $bevDistro->id]);

        StockMovement::factory()->create(['product_id' => $mouse->id, 'type' => 'in', 'qty' => 45, 'before_qty' => 0, 'after_qty' => 45, 'reference' => 'INITIAL', 'notes' => 'Initial stock', 'user_id' => $admin->id]);
        StockMovement::factory()->create(['product_id' => $usbHub->id, 'type' => 'in', 'qty' => 30, 'before_qty' => 0, 'after_qty' => 30, 'reference' => 'INITIAL', 'notes' => 'Initial stock', 'user_id' => $admin->id]);
        StockMovement::factory()->create(['product_id' => $hdmiCable->id, 'type' => 'in', 'qty' => 100, 'before_qty' => 0, 'after_qty' => 100, 'reference' => 'INITIAL', 'notes' => 'Initial stock', 'user_id' => $admin->id]);
        StockMovement::factory()->create(['product_id' => $a4Paper->id, 'type' => 'in', 'qty' => 200, 'before_qty' => 0, 'after_qty' => 200, 'reference' => 'INITIAL', 'notes' => 'Initial stock', 'user_id' => $admin->id]);
        StockMovement::factory()->create(['product_id' => $pens->id, 'type' => 'in', 'qty' => 150, 'before_qty' => 0, 'after_qty' => 150, 'reference' => 'INITIAL', 'notes' => 'Initial stock', 'user_id' => $admin->id]);
        StockMovement::factory()->create(['product_id' => $stickyNotes->id, 'type' => 'in', 'qty' => 75, 'before_qty' => 0, 'after_qty' => 75, 'reference' => 'INITIAL', 'notes' => 'Initial stock', 'user_id' => $admin->id]);
        StockMovement::factory()->create(['product_id' => $cleaner->id, 'type' => 'in', 'qty' => 60, 'before_qty' => 0, 'after_qty' => 60, 'reference' => 'INITIAL', 'notes' => 'Initial stock', 'user_id' => $admin->id]);
        StockMovement::factory()->create(['product_id' => $cloth->id, 'type' => 'in', 'qty' => 40, 'before_qty' => 0, 'after_qty' => 40, 'reference' => 'INITIAL', 'notes' => 'Initial stock', 'user_id' => $admin->id]);
        StockMovement::factory()->create(['product_id' => $boxS->id, 'type' => 'in', 'qty' => 50, 'before_qty' => 0, 'after_qty' => 50, 'reference' => 'INITIAL', 'notes' => 'Initial stock', 'user_id' => $admin->id]);
        StockMovement::factory()->create(['product_id' => $tape->id, 'type' => 'in', 'qty' => 30, 'before_qty' => 0, 'after_qty' => 30, 'reference' => 'INITIAL', 'notes' => 'Initial stock', 'user_id' => $admin->id]);
        StockMovement::factory()->create(['product_id' => $bubbleWrap->id, 'type' => 'in', 'qty' => 10, 'before_qty' => 0, 'after_qty' => 10, 'reference' => 'INITIAL', 'notes' => 'Initial stock', 'user_id' => $admin->id]);
        StockMovement::factory()->create(['product_id' => $water->id, 'type' => 'in', 'qty' => 80, 'before_qty' => 0, 'after_qty' => 80, 'reference' => 'INITIAL', 'notes' => 'Initial stock', 'user_id' => $admin->id]);
        StockMovement::factory()->create(['product_id' => $greenTea->id, 'type' => 'in', 'qty' => 35, 'before_qty' => 0, 'after_qty' => 35, 'reference' => 'INITIAL', 'notes' => 'Initial stock', 'user_id' => $admin->id]);
        StockMovement::factory()->create(['product_id' => $sparklingWater->id, 'type' => 'in', 'qty' => 50, 'before_qty' => 0, 'after_qty' => 50, 'reference' => 'INITIAL', 'notes' => 'Initial stock', 'user_id' => $admin->id]);

        StockMovement::factory()->create(['product_id' => $sparklingWater->id, 'type' => 'out', 'qty' => 50, 'before_qty' => 50, 'after_qty' => 0, 'reference' => 'ORD-20260527-0002', 'notes' => 'Bulk order fulfillment', 'user_id' => $admin->id]);
        StockMovement::factory()->create(['product_id' => $bubbleWrap->id, 'type' => 'out', 'qty' => 9, 'before_qty' => 10, 'after_qty' => 1, 'reference' => 'ORD-20260527-0003', 'notes' => 'Order fulfillment', 'user_id' => $admin->id]);
        StockMovement::factory()->create(['product_id' => $tape->id, 'type' => 'out', 'qty' => 28, 'before_qty' => 30, 'after_qty' => 2, 'reference' => 'ORD-20260527-0004', 'notes' => 'Order fulfillment', 'user_id' => $admin->id]);
        StockMovement::factory()->create(['product_id' => $boxS->id, 'type' => 'out', 'qty' => 47, 'before_qty' => 50, 'after_qty' => 3, 'reference' => 'ORD-20260527-0005', 'notes' => 'Order fulfillment', 'user_id' => $admin->id]);

        $this->callOnce(OrderSeeder::class);
    }
}
