<?php

declare(strict_types=1);

use App\Models\Category;
use App\Models\Order;
use App\Models\Product;
use App\Models\StockMovement;
use App\Models\User;
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
