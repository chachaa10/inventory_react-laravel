<?php

declare(strict_types=1);

use App\Enums\OrderStatus;
use App\Models\Category;
use App\Models\Order;
use App\Models\Product;
use App\Models\User;

test('guests are redirected to login', function (): void {
    $this->get(route('orders.index'))->assertRedirect(route('login'));
});

test('customer name is required', function (): void {
    $user = User::factory()->create(['role' => 'admin']);
    $this->actingAs($user);

    $this->post(route('orders.store'), [
        'customer_name' => '',
        'items' => '[]',
    ])->assertSessionHasErrors(['customer_name', 'items']);
});

test('items json is required', function (): void {
    $user = User::factory()->create(['role' => 'admin']);
    $this->actingAs($user);

    $this->post(route('orders.store'), [
        'customer_name' => 'John Doe',
    ])->assertSessionHasErrors('items');
});

test('invalid product id fails', function (): void {
    $user = User::factory()->create(['role' => 'admin']);
    $this->actingAs($user);

    $this->post(route('orders.store'), [
        'customer_name' => 'John Doe',
        'items' => json_encode([['product_id' => 999, 'qty' => 1]]),
    ])->assertSessionHasErrors('items.0.product_id');
});

test('admin can create an order with stock deduction', function (): void {
    $admin = User::factory()->create(['role' => 'admin']);
    $this->actingAs($admin);

    $category = Category::factory()->create();
    $product = Product::factory()->create([
        'name' => 'Test Product',
        'price' => 29.99,
        'stock_qty' => 10,
        'category_id' => $category->id,
    ]);

    $this->post(route('orders.store'), [
        'customer_name' => 'John Doe',
        'customer_email' => 'john@example.com',
        'notes' => 'Test order',
        'items' => json_encode([
            ['product_id' => $product->id, 'qty' => 3],
        ]),
    ])->assertRedirect(route('orders.index'));

    $order = Order::query()->first();
    expect($order)->not->toBeNull();
    expect($order->customer_name)->toBe('John Doe');
    expect($order->customer_email)->toBe('john@example.com');
    expect($order->status)->toBe(OrderStatus::Completed);
    expect($order->notes)->toBe('Test order');
    expect($order->total)->toBe(89.97);
    expect($order->order_number)->toMatch('/^ORD-\d{8}-\d{4}$/');

    expect($order->items->count())->toBe(1);
    expect($order->items->first()->qty)->toBe(3);
    expect($order->items->first()->unit_price)->toBe(29.99);
    expect($order->items->first()->subtotal)->toBe(89.97);

    expect($order->stockMovements()->count())->toBe(1);
    expect($order->stockMovements()->first()->type->value)->toBe('out');
    expect($order->stockMovements()->first()->qty)->toBe(3);

    $product->refresh();
    expect($product->stock_qty)->toBe(7);
});

test('order fails with insufficient stock', function (): void {
    $admin = User::factory()->create(['role' => 'admin']);
    $this->actingAs($admin);

    $category = Category::factory()->create();
    $product = Product::factory()->create([
        'name' => 'Low Stock Product',
        'stock_qty' => 2,
        'category_id' => $category->id,
    ]);

    $this->post(route('orders.store'), [
        'customer_name' => 'John Doe',
        'items' => json_encode([
            ['product_id' => $product->id, 'qty' => 5],
        ]),
    ])->assertRedirect();

    $this->assertDatabaseCount('orders', 0);
});

test('staff can create an order', function (): void {
    $staff = User::factory()->create(['role' => 'staff']);
    $this->actingAs($staff);

    $category = Category::factory()->create();
    $product = Product::factory()->create([
        'name' => 'Staff Product',
        'price' => 15.00,
        'stock_qty' => 10,
        'category_id' => $category->id,
    ]);

    $this->post(route('orders.store'), [
        'customer_name' => 'Staff Customer',
        'items' => json_encode([
            ['product_id' => $product->id, 'qty' => 2],
        ]),
    ])->assertRedirect();

    $order = Order::query()->first();
    expect($order)->not->toBeNull();
    expect($order->user_id)->toBe($staff->id);
});

test('superadmin can cancel an order and restore stock', function (): void {
    $superadmin = User::factory()->create(['role' => 'superadmin']);
    $this->actingAs($superadmin);

    $category = Category::factory()->create();
    $product = Product::factory()->create([
        'name' => 'Cancellable Product',
        'price' => 10.00,
        'stock_qty' => 5,
        'category_id' => $category->id,
    ]);

    $this->post(route('orders.store'), [
        'customer_name' => 'Super Cancel Test',
        'items' => json_encode([
            ['product_id' => $product->id, 'qty' => 3],
        ]),
    ]);

    $order = Order::query()->first();

    $this->put(route('orders.update', [$order->id]))
        ->assertRedirect();

    $order->refresh();
    expect($order->status)->toBe(OrderStatus::Cancelled);

    expect($order->stockMovements()->count())->toBe(2);

    $product->refresh();
    expect($product->stock_qty)->toBe(5);
});

test('admin can cancel an order and restore stock', function (): void {
    $admin = User::factory()->create(['role' => 'admin']);
    $this->actingAs($admin);

    $category = Category::factory()->create();
    $product = Product::factory()->create([
        'name' => 'Cancellable Product',
        'price' => 10.00,
        'stock_qty' => 5,
        'category_id' => $category->id,
    ]);

    $this->post(route('orders.store'), [
        'customer_name' => 'Cancel Test',
        'items' => json_encode([
            ['product_id' => $product->id, 'qty' => 3],
        ]),
    ]);

    $order = Order::query()->first();

    $this->put(route('orders.update', [$order->id]))
        ->assertRedirect();

    $order->refresh();
    expect($order->status)->toBe(OrderStatus::Cancelled);

    expect($order->stockMovements()->count())->toBe(2);

    $product->refresh();
    expect($product->stock_qty)->toBe(5);
});

test('staff cannot cancel an order', function (): void {
    $admin = User::factory()->create(['role' => 'admin']);
    $staff = User::factory()->create(['role' => 'staff']);

    $category = Category::factory()->create();
    $product = Product::factory()->create([
        'stock_qty' => 5,
        'category_id' => $category->id,
    ]);

    $this->actingAs($admin);
    $this->post(route('orders.store'), [
        'customer_name' => 'Auth Test',
        'items' => json_encode([
            ['product_id' => $product->id, 'qty' => 2],
        ]),
    ]);

    $order = Order::query()->first();

    $this->actingAs($staff);
    $this->put(route('orders.update', [$order->id]))
        ->assertForbidden();
});

test('cannot cancel already cancelled order', function (): void {
    $admin = User::factory()->create(['role' => 'admin']);
    $this->actingAs($admin);

    $category = Category::factory()->create();
    $product = Product::factory()->create([
        'stock_qty' => 5,
        'category_id' => $category->id,
    ]);

    $this->post(route('orders.store'), [
        'customer_name' => 'Double Cancel Test',
        'items' => json_encode([
            ['product_id' => $product->id, 'qty' => 2],
        ]),
    ]);

    $order = Order::query()->first();

    $this->put(route('orders.update', [$order->id]));
    $this->put(route('orders.update', [$order->id]))
        ->assertRedirect();

    $order->refresh();
    expect($order->status)->toBe(OrderStatus::Cancelled);
});

test('can list orders with items count', function (): void {
    $admin = User::factory()->create(['role' => 'admin']);
    $this->actingAs($admin);

    $category = Category::factory()->create();
    $product = Product::factory()->create([
        'stock_qty' => 10,
        'category_id' => $category->id,
    ]);

    $this->post(route('orders.store'), [
        'customer_name' => 'List Test',
        'items' => json_encode([
            ['product_id' => $product->id, 'qty' => 1],
        ]),
    ]);

    $this->get(route('orders.index'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('orders/Index')
            ->has('orders.data', 1)
            ->where('orders.data.0.customer_name', 'List Test')
            ->where('orders.data.0.items_count', 1)
        );
});

test('can search orders by order number', function (): void {
    $admin = User::factory()->create(['role' => 'admin']);
    $this->actingAs($admin);

    $category = Category::factory()->create();
    $product = Product::factory()->create([
        'stock_qty' => 10,
        'category_id' => $category->id,
    ]);

    $this->post(route('orders.store'), [
        'customer_name' => 'Search Test',
        'items' => json_encode([
            ['product_id' => $product->id, 'qty' => 1],
        ]),
    ]);

    $order = Order::query()->first();

    $this->get(route('orders.index', ['search' => $order->order_number]))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('orders/Index')
            ->has('orders.data', 1)
        );
});

test('can filter orders by status', function (): void {
    $admin = User::factory()->create(['role' => 'admin']);
    $this->actingAs($admin);

    $category = Category::factory()->create();
    $product = Product::factory()->create([
        'stock_qty' => 10,
        'category_id' => $category->id,
    ]);

    $this->post(route('orders.store'), [
        'customer_name' => 'Filter Test',
        'items' => json_encode([
            ['product_id' => $product->id, 'qty' => 1],
        ]),
    ]);

    $this->get(route('orders.index', ['status' => 'pending']))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('orders/Index')
            ->has('orders.data', 0)
        );

    $this->get(route('orders.index', ['status' => 'completed']))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('orders/Index')
            ->has('orders.data', 1)
        );
});
