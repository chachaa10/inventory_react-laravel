<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Enums\Role;
use App\Models\Category;
use App\Models\Product;
use App\Models\Supplier;
use App\Models\User;
use Illuminate\Database\Eloquent\Collection as EloquentCollection;
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
        $furniture = Category::query()
            ->firstOrCreate(['slug' => 'furniture'], ['name' => 'Furniture', 'description' => 'Chairs, desks, and office furniture']);
        $food = Category::query()
            ->firstOrCreate(['slug' => 'food-snacks'], ['name' => 'Food & Snacks', 'description' => 'Non-perishable food items and snacks']);
        $safety = Category::query()
            ->firstOrCreate(['slug' => 'safety-equipment'], ['name' => 'Safety Equipment', 'description' => 'PPE and safety gear']);
        $clothing = Category::query()
            ->firstOrCreate(['slug' => 'clothing'], ['name' => 'Clothing', 'description' => 'Uniforms and apparel']);
        $tools = Category::query()
            ->firstOrCreate(['slug' => 'tools-hardware'], ['name' => 'Tools & Hardware', 'description' => 'Hand tools and hardware supplies']);

        $allCategories = [$category, $office, $cleaning, $packaging, $beverages, $furniture, $food, $safety, $clothing, $tools];

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
        $furnitureWorld = Supplier::query()
            ->firstOrCreate(['email' => 'orders@furnitureworld.com'], ['name' => 'Furniture World', 'phone' => '555-0106', 'address' => '987 Design Ave, Seattle, WA']);
        $snackFactory = Supplier::query()
            ->firstOrCreate(['email' => 'sales@snackfactory.com'], ['name' => 'Snack Factory', 'phone' => '555-0107', 'address' => '246 Food St, Denver, CO']);
        $safetyFirst = Supplier::query()
            ->firstOrCreate(['email' => 'info@safetyfirst.com'], ['name' => 'SafetyFirst Supplies', 'phone' => '555-0108', 'address' => '135 Protection Blvd, Miami, FL']);
        $wearablesInc = Supplier::query()
            ->firstOrCreate(['email' => 'hello@wearablesinc.com'], ['name' => 'Wearables Inc.', 'phone' => '555-0109', 'address' => '753 Fashion Rd, Los Angeles, CA']);
        $hardwarePro = Supplier::query()
            ->firstOrCreate(['email' => 'parts@hardwarepro.com'], ['name' => 'HardwarePro', 'phone' => '555-0110', 'address' => '888 Tool St, Detroit, MI']);

        $allSuppliers = [$supplier, $officeMart, $cleanSupply, $packRight, $bevDistro, $furnitureWorld, $snackFactory, $safetyFirst, $wearablesInc, $hardwarePro];

        // Core manual products
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

        $manualProducts = [$product, $usbHub, $hdmiCable, $a4Paper, $pens, $stickyNotes, $cleaner, $cloth, $boxS, $tape, $bubbleWrap, $water, $greenTea, $sparklingWater];

        BulkProductSeeder::run(new EloquentCollection($allCategories), new EloquentCollection($allSuppliers), new EloquentCollection($manualProducts), $user);

        $this->callOnce(OrderSeeder::class);
    }
}
