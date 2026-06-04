<?php

declare(strict_types=1);

use App\Models\Category;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\StockMovement;
use App\Models\Supplier;
use App\Models\User;
use Illuminate\Support\Facades\Date;
use Inertia\Testing\AssertableInertia as Assert;

test('guests are redirected to the login page', function (): void {
    $response = $this->get(route('dashboard'));
    $response->assertRedirect(route('login'));
});

test('authenticated users can visit the dashboard', function (): void {
    $user = User::factory()->create();
    $this->actingAs($user);

    $response = $this->get(route('dashboard'));
    $response->assertOk();
});

test('dashboard shows total products count', function (): void {
    $user = User::factory()->create();
    $this->actingAs($user);

    $category = Category::factory()->create();
    Product::factory()->count(3)->create([
        'stock_qty' => 50,
        'reorder_level' => 10,
        'category_id' => $category->id,
    ]);

    $this->get(route('dashboard'))
        ->assertInertia(fn (Assert $assert): Assert => $assert
            ->component('dashboard/Index')
            ->where('totalProducts', 3)
            ->where('lowStockCount', 0)
            ->has('stockByCategory', 1)
            ->has('recentMovements')
            ->has('lowStockAlerts')
        );
});

test('dashboard counts low stock products', function (): void {
    $user = User::factory()->create();
    $this->actingAs($user);

    $category = Category::factory()->create();
    Product::factory()->create(['stock_qty' => 5, 'reorder_level' => 10, 'category_id' => $category->id]);
    Product::factory()->create(['stock_qty' => 20, 'reorder_level' => 10, 'category_id' => $category->id]);

    $this->get(route('dashboard'))
        ->assertInertia(fn (Assert $assert): Assert => $assert
            ->where('lowStockCount', 1)
        );
});

test('dashboard shows recent orders count', function (): void {
    $user = User::factory()->create(['role' => 'admin']);
    $this->actingAs($user);

    $category = Category::factory()->create();
    $product = Product::factory()->create(['price' => 10, 'stock_qty' => 100, 'category_id' => $category->id]);

    Order::factory()->count(2)->create([
        'customer_name' => 'Test Customer',
        'status' => 'completed',
        'user_id' => $user->id,
    ]);

    $this->get(route('dashboard'))
        ->assertInertia(fn (Assert $assert): Assert => $assert
            ->where('recentOrdersCount', 2)
        );
});

test('dashboard shows total revenue', function (): void {
    $user = User::factory()->create(['role' => 'admin']);
    $this->actingAs($user);

    $category = Category::factory()->create();
    $product = Product::factory()->create(['price' => 10, 'stock_qty' => 100, 'category_id' => $category->id]);

    Order::factory()->create([
        'customer_name' => 'Test Customer',
        'total' => 100.50,
        'status' => 'completed',
        'user_id' => $user->id,
    ]);

    $this->get(route('dashboard'))
        ->assertInertia(fn (Assert $assert): Assert => $assert
            ->where('totalRevenue', '$100.50')
        );
});

test('dashboard limits recent movements to 5', function (): void {
    $user = User::factory()->create();
    $this->actingAs($user);

    $category = Category::factory()->create();
    $product = Product::factory()->create(['category_id' => $category->id]);

    StockMovement::factory()->count(7)->create([
        'product_id' => $product->id,
        'user_id' => $user->id,
    ]);

    $this->get(route('dashboard'))
        ->assertInertia(fn (Assert $assert): Assert => $assert
            ->count('recentMovements', 5)
        );
});

test('dashboard shows low stock alerts', function (): void {
    $user = User::factory()->create();
    $this->actingAs($user);

    $category = Category::factory()->create();
    $lowStock = Product::factory()->create([
        'name' => 'Low Stock Item',
        'stock_qty' => 3,
        'reorder_level' => 10,
        'category_id' => $category->id,
    ]);

    $this->get(route('dashboard'))
        ->assertInertia(fn (Assert $assert): Assert => $assert
            ->has('lowStockAlerts', 1)
            ->where('lowStockAlerts.0.name', 'Low Stock Item')
            ->where('lowStockAlerts.0.stock', 3)
            ->where('lowStockAlerts.0.reorder', 10)
        );
});

test('dashboard shows monthly revenue chart data', function (): void {
    $user = User::factory()->create(['role' => 'admin']);
    $this->actingAs($user);

    $category = Category::factory()->create();
    $product = Product::factory()->create(['category_id' => $category->id]);

    Order::factory()->create([
        'total' => 500,
        'status' => 'completed',
        'user_id' => $user->id,
        'created_at' => Date::create(now()->year, 1, 15),
    ]);
    Order::factory()->create([
        'total' => 300,
        'status' => 'completed',
        'user_id' => $user->id,
        'created_at' => Date::create(now()->year, 2, 10),
    ]);

    $this->get(route('dashboard'))
        ->assertInertia(fn (Assert $assert): Assert => $assert
            ->has('monthlyRevenue')
            ->where('monthlyRevenue.0.revenue', 500)
        );
});

test('dashboard shows monthly orders chart data', function (): void {
    $user = User::factory()->create();
    $this->actingAs($user);

    $category = Category::factory()->create();
    $product = Product::factory()->create(['category_id' => $category->id]);

    Order::factory()->count(3)->create([
        'user_id' => $user->id,
        'created_at' => Date::create(now()->year, 1, 15),
    ]);

    $this->get(route('dashboard'))
        ->assertInertia(fn (Assert $assert): Assert => $assert
            ->has('monthlyOrders')
            ->where('monthlyOrders.0.count', 3)
        );
});

test('dashboard shows orders by status breakdown', function (): void {
    $user = User::factory()->create(['role' => 'admin']);
    $this->actingAs($user);

    $category = Category::factory()->create();
    $product = Product::factory()->create(['category_id' => $category->id]);

    Order::factory()->count(2)->create([
        'status' => 'completed',
        'user_id' => $user->id,
    ]);
    Order::factory()->create([
        'status' => 'cancelled',
        'user_id' => $user->id,
    ]);

    $this->get(route('dashboard'))
        ->assertInertia(fn (Assert $assert): Assert => $assert
            ->has('ordersByStatus', 2)
            ->where('ordersByStatus.0.count', 2)
        );
});

test('dashboard shows top selling products', function (): void {
    $user = User::factory()->create(['role' => 'admin']);
    $this->actingAs($user);

    $category = Category::factory()->create();
    $productA = Product::factory()->create(['name' => 'Top Seller', 'category_id' => $category->id]);
    $productB = Product::factory()->create(['name' => 'Slow Mover', 'category_id' => $category->id]);

    $order = Order::factory()->create([
        'user_id' => $user->id,
    ]);

    OrderItem::factory()->create([
        'order_id' => $order->id,
        'product_id' => $productA->id,
        'qty' => 10,
        'unit_price' => 50,
        'subtotal' => 500,
    ]);
    OrderItem::factory()->create([
        'order_id' => $order->id,
        'product_id' => $productB->id,
        'qty' => 2,
        'unit_price' => 30,
        'subtotal' => 60,
    ]);

    $this->get(route('dashboard'))
        ->assertInertia(fn (Assert $assert): Assert => $assert
            ->has('topSellingProducts')
            ->where('topSellingProducts.0.name', 'Top Seller')
            ->where('topSellingProducts.0.qty', 10)
        );
});

test('dashboard shows supplier distribution', function (): void {
    $user = User::factory()->create();
    $this->actingAs($user);

    $supplierA = Supplier::factory()->create(['name' => 'Supplier A']);
    $supplierB = Supplier::factory()->create(['name' => 'Supplier B']);
    $category = Category::factory()->create();

    Product::factory()->count(3)->create([
        'supplier_id' => $supplierA->id,
        'category_id' => $category->id,
    ]);
    Product::factory()->create([
        'supplier_id' => $supplierB->id,
        'category_id' => $category->id,
    ]);

    $this->get(route('dashboard'))
        ->assertInertia(fn (Assert $assert): Assert => $assert
            ->has('supplierDistribution', 2)
            ->where('supplierDistribution.0.supplier', 'Supplier A')
            ->where('supplierDistribution.0.count', 3)
        );
});

test('dashboard shows stock level distribution', function (): void {
    $user = User::factory()->create();
    $this->actingAs($user);

    $category = Category::factory()->create();
    Product::factory()->create(['stock_qty' => 0, 'category_id' => $category->id]);
    Product::factory()->count(3)->create(['stock_qty' => 5, 'category_id' => $category->id]);
    Product::factory()->count(2)->create(['stock_qty' => 200, 'category_id' => $category->id]);

    $this->get(route('dashboard'))
        ->assertInertia(fn (Assert $assert): Assert => $assert
            ->has('stockLevelDistribution')
            ->where('stockLevelDistribution.0.range', '0')
            ->where('stockLevelDistribution.0.count', 1)
        );
});

test('dashboard shows stock movements trend', function (): void {
    $user = User::factory()->create();
    $this->actingAs($user);

    $category = Category::factory()->create();
    $product = Product::factory()->create(['category_id' => $category->id]);

    StockMovement::factory()->create([
        'product_id' => $product->id,
        'type' => 'in',
        'qty' => 20,
        'user_id' => $user->id,
        'created_at' => Date::create(now()->year, 1, 5),
    ]);
    StockMovement::factory()->create([
        'product_id' => $product->id,
        'type' => 'out',
        'qty' => 5,
        'user_id' => $user->id,
        'created_at' => Date::create(now()->year, 1, 10),
    ]);

    $this->get(route('dashboard'))
        ->assertInertia(fn (Assert $assert): Assert => $assert
            ->has('stockMovementsTrend')
            ->where('stockMovementsTrend.0.in', 20)
            ->where('stockMovementsTrend.0.out', 5)
        );
});
