<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Enums\Role;
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
        $user = User::query()
            ->firstOrCreate(['email' => 'superadmin@example.com'], array_merge(User::factory()->raw(), ['name' => 'Super Admin', 'email' => 'superadmin@example.com', 'role' => Role::Superadmin->value]));

        User::query()
            ->firstOrCreate(['email' => 'admin@example.com'], array_merge(User::factory()->raw(), ['name' => 'Admin User', 'email' => 'admin@example.com', 'role' => 'admin']));

        User::query()
            ->firstOrCreate(['email' => 'admin2@example.com'], array_merge(User::factory()->raw(), ['name' => 'Admin User 2', 'email' => 'admin2@example.com', 'role' => 'admin']));

        User::query()
            ->firstOrCreate(['email' => 'admin3@example.com'], array_merge(User::factory()->raw(), ['name' => 'Admin User 3', 'email' => 'admin3@example.com', 'role' => 'admin']));

        User::query()
            ->firstOrCreate(['email' => 'staff@example.com'], array_merge(User::factory()->raw(), ['name' => 'Staff User', 'email' => 'staff@example.com', 'role' => 'staff']));

        $category = Category::query()
            ->firstOrCreate(['slug' => 'electronics'], ['name' => 'Electronics', 'description' => 'Electronic devices and accessories']);
        $office = Category::query()
            ->firstOrCreate(['slug' => 'office-supplies'], ['name' => 'Office Supplies', 'description' => 'Stationery and office essentials']);
        $cleaning = Category::query()
            ->firstOrCreate(['slug' => 'cleaning'], ['name' => 'Cleaning', 'description' => 'Cleaning products and equipment']);
        $packaging = Category::query()
            ->firstOrCreate(['slug' => 'packaging'], ['name' => 'Packaging', 'description' => 'Boxes, tape, and shipping materials']);
        $beverages = Category::query()
            ->firstOrCreate(['slug' => 'beverages'], ['name' => 'Beverages', 'description' => 'Drinks and refreshments']);

        $supplier = Supplier::query()
            ->firstOrCreate(['email' => 'orders@techdistributor.com'], ['name' => 'TechDistributor Inc.', 'phone' => '555-0101', 'address' => '123 Tech Lane, Silicon Valley, CA']);
        $officeMart = Supplier::query()
            ->firstOrCreate(['email' => 'sales@officemart.com'], ['name' => 'OfficeMart', 'phone' => '555-0102', 'address' => '456 Business Ave, New York, NY']);
        $cleanSupply = Supplier::query()
            ->firstOrCreate(['email' => 'info@cleansupply.com'], ['name' => 'CleanSupply Co.', 'phone' => '555-0103', 'address' => '789 Industrial Blvd, Chicago, IL']);
        $packRight = Supplier::query()
            ->firstOrCreate(['email' => 'hello@packright.com'], ['name' => 'PackRight Ltd.', 'phone' => '555-0104', 'address' => '321 Warehouse Dr, Houston, TX']);
        $bevDistro = Supplier::query()
            ->firstOrCreate(['email' => 'contact@bevdistro.com'], ['name' => 'BevDistro', 'phone' => '555-0105', 'address' => '654 Beverage St, Portland, OR']);

        $product = Product::query()
            ->firstOrCreate(['sku' => 'SKU-ELEC-001'], ['name' => 'Wireless Mouse', 'price' => 29.99, 'cost' => 12.50, 'stock_qty' => 44, 'reorder_level' => 10, 'category_id' => $category->id, 'supplier_id' => $supplier->id]);
        $usbHub = Product::query()
            ->firstOrCreate(['sku' => 'SKU-ELEC-002'], ['name' => 'USB-C Hub', 'price' => 49.99, 'cost' => 22.00, 'stock_qty' => 30, 'reorder_level' => 8, 'category_id' => $category->id, 'supplier_id' => $supplier->id]);
        $hdmiCable = Product::query()
            ->firstOrCreate(['sku' => 'SKU-ELEC-003'], ['name' => 'HDMI Cable 2m', 'price' => 12.99, 'cost' => 4.50, 'stock_qty' => 98, 'reorder_level' => 20, 'category_id' => $category->id, 'supplier_id' => $supplier->id]);
        $a4Paper = Product::query()
            ->firstOrCreate(['sku' => 'SKU-OFF-001'], ['name' => 'A4 Printer Paper (500)', 'price' => 8.99, 'cost' => 3.50, 'stock_qty' => 200, 'reorder_level' => 50, 'category_id' => $office->id, 'supplier_id' => $officeMart->id]);
        $pens = Product::query()
            ->firstOrCreate(['sku' => 'SKU-OFF-002'], ['name' => 'Ballpoint Pen (Box/12)', 'price' => 6.99, 'cost' => 2.50, 'stock_qty' => 150, 'reorder_level' => 30, 'category_id' => $office->id, 'supplier_id' => $officeMart->id]);
        $stickyNotes = Product::query()
            ->firstOrCreate(['sku' => 'SKU-OFF-003'], ['name' => 'Sticky Notes (Pack)', 'price' => 4.99, 'cost' => 1.80, 'stock_qty' => 75, 'reorder_level' => 20, 'category_id' => $office->id, 'supplier_id' => $officeMart->id]);
        $cleaner = Product::query()
            ->firstOrCreate(['sku' => 'SKU-CLN-001'], ['name' => 'All-Purpose Cleaner 1L', 'price' => 7.99, 'cost' => 3.20, 'stock_qty' => 60, 'reorder_level' => 15, 'category_id' => $cleaning->id, 'supplier_id' => $cleanSupply->id]);
        $cloth = Product::query()
            ->firstOrCreate(['sku' => 'SKU-CLN-002'], ['name' => 'Microfiber Cloth (Set/5)', 'price' => 9.99, 'cost' => 4.00, 'stock_qty' => 40, 'reorder_level' => 10, 'category_id' => $cleaning->id, 'supplier_id' => $cleanSupply->id]);
        $boxS = Product::query()
            ->firstOrCreate(['sku' => 'SKU-PKG-001'], ['name' => 'Corrugated Box S', 'price' => 2.99, 'cost' => 1.00, 'stock_qty' => 3, 'reorder_level' => 50, 'category_id' => $packaging->id, 'supplier_id' => $packRight->id]);
        $tape = Product::query()
            ->firstOrCreate(['sku' => 'SKU-PKG-002'], ['name' => 'Packing Tape Roll', 'price' => 3.99, 'cost' => 1.50, 'stock_qty' => 2, 'reorder_level' => 30, 'category_id' => $packaging->id, 'supplier_id' => $packRight->id]);
        $bubbleWrap = Product::query()
            ->firstOrCreate(['sku' => 'SKU-PKG-003'], ['name' => 'Bubble Wrap 10m', 'price' => 14.99, 'cost' => 6.00, 'stock_qty' => 1, 'reorder_level' => 10, 'category_id' => $packaging->id, 'supplier_id' => $packRight->id]);
        $water = Product::query()
            ->firstOrCreate(['sku' => 'SKU-BEV-001'], ['name' => 'Spring Water 500ml (Case/24)', 'price' => 18.99, 'cost' => 9.00, 'stock_qty' => 80, 'reorder_level' => 20, 'category_id' => $beverages->id, 'supplier_id' => $bevDistro->id]);
        $greenTea = Product::query()
            ->firstOrCreate(['sku' => 'SKU-BEV-002'], ['name' => 'Organic Green Tea (Box/20)', 'price' => 14.99, 'cost' => 6.50, 'stock_qty' => 35, 'reorder_level' => 10, 'category_id' => $beverages->id, 'supplier_id' => $bevDistro->id]);
        $sparklingWater = Product::query()
            ->firstOrCreate(['sku' => 'SKU-BEV-003'], ['name' => 'Sparkling Water Can (Case/12)', 'price' => 22.99, 'cost' => 11.00, 'stock_qty' => 0, 'reorder_level' => 15, 'category_id' => $beverages->id, 'supplier_id' => $bevDistro->id]);

        StockMovement::factory()->create(['product_id' => $product->id, 'type' => 'in', 'qty' => 45, 'before_qty' => 0, 'after_qty' => 45, 'reference' => 'INITIAL', 'notes' => 'Initial stock', 'user_id' => $user->id]);
        StockMovement::factory()->create(['product_id' => $usbHub->id, 'type' => 'in', 'qty' => 30, 'before_qty' => 0, 'after_qty' => 30, 'reference' => 'INITIAL', 'notes' => 'Initial stock', 'user_id' => $user->id]);
        StockMovement::factory()->create(['product_id' => $hdmiCable->id, 'type' => 'in', 'qty' => 100, 'before_qty' => 0, 'after_qty' => 100, 'reference' => 'INITIAL', 'notes' => 'Initial stock', 'user_id' => $user->id]);
        StockMovement::factory()->create(['product_id' => $a4Paper->id, 'type' => 'in', 'qty' => 200, 'before_qty' => 0, 'after_qty' => 200, 'reference' => 'INITIAL', 'notes' => 'Initial stock', 'user_id' => $user->id]);
        StockMovement::factory()->create(['product_id' => $pens->id, 'type' => 'in', 'qty' => 150, 'before_qty' => 0, 'after_qty' => 150, 'reference' => 'INITIAL', 'notes' => 'Initial stock', 'user_id' => $user->id]);
        StockMovement::factory()->create(['product_id' => $stickyNotes->id, 'type' => 'in', 'qty' => 75, 'before_qty' => 0, 'after_qty' => 75, 'reference' => 'INITIAL', 'notes' => 'Initial stock', 'user_id' => $user->id]);
        StockMovement::factory()->create(['product_id' => $cleaner->id, 'type' => 'in', 'qty' => 60, 'before_qty' => 0, 'after_qty' => 60, 'reference' => 'INITIAL', 'notes' => 'Initial stock', 'user_id' => $user->id]);
        StockMovement::factory()->create(['product_id' => $cloth->id, 'type' => 'in', 'qty' => 40, 'before_qty' => 0, 'after_qty' => 40, 'reference' => 'INITIAL', 'notes' => 'Initial stock', 'user_id' => $user->id]);
        StockMovement::factory()->create(['product_id' => $boxS->id, 'type' => 'in', 'qty' => 50, 'before_qty' => 0, 'after_qty' => 50, 'reference' => 'INITIAL', 'notes' => 'Initial stock', 'user_id' => $user->id]);
        StockMovement::factory()->create(['product_id' => $tape->id, 'type' => 'in', 'qty' => 30, 'before_qty' => 0, 'after_qty' => 30, 'reference' => 'INITIAL', 'notes' => 'Initial stock', 'user_id' => $user->id]);
        StockMovement::factory()->create(['product_id' => $bubbleWrap->id, 'type' => 'in', 'qty' => 10, 'before_qty' => 0, 'after_qty' => 10, 'reference' => 'INITIAL', 'notes' => 'Initial stock', 'user_id' => $user->id]);
        StockMovement::factory()->create(['product_id' => $water->id, 'type' => 'in', 'qty' => 80, 'before_qty' => 0, 'after_qty' => 80, 'reference' => 'INITIAL', 'notes' => 'Initial stock', 'user_id' => $user->id]);
        StockMovement::factory()->create(['product_id' => $greenTea->id, 'type' => 'in', 'qty' => 35, 'before_qty' => 0, 'after_qty' => 35, 'reference' => 'INITIAL', 'notes' => 'Initial stock', 'user_id' => $user->id]);
        StockMovement::factory()->create(['product_id' => $sparklingWater->id, 'type' => 'in', 'qty' => 50, 'before_qty' => 0, 'after_qty' => 50, 'reference' => 'INITIAL', 'notes' => 'Initial stock', 'user_id' => $user->id]);

        StockMovement::factory()->create(['product_id' => $sparklingWater->id, 'type' => 'out', 'qty' => 50, 'before_qty' => 50, 'after_qty' => 0, 'reference' => 'ORD-20260527-0002', 'notes' => 'Bulk order fulfillment', 'user_id' => $user->id]);
        StockMovement::factory()->create(['product_id' => $bubbleWrap->id, 'type' => 'out', 'qty' => 9, 'before_qty' => 10, 'after_qty' => 1, 'reference' => 'ORD-20260527-0003', 'notes' => 'Order fulfillment', 'user_id' => $user->id]);
        StockMovement::factory()->create(['product_id' => $tape->id, 'type' => 'out', 'qty' => 28, 'before_qty' => 30, 'after_qty' => 2, 'reference' => 'ORD-20260527-0004', 'notes' => 'Order fulfillment', 'user_id' => $user->id]);
        StockMovement::factory()->create(['product_id' => $boxS->id, 'type' => 'out', 'qty' => 47, 'before_qty' => 50, 'after_qty' => 3, 'reference' => 'ORD-20260527-0005', 'notes' => 'Order fulfillment', 'user_id' => $user->id]);

        $this->callOnce(OrderSeeder::class);
    }
}
