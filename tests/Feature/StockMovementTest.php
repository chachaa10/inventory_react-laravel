<?php

declare(strict_types=1);

use App\Models\Product;
use App\Models\StockMovement;
use App\Models\User;
use App\Notifications\ProductLowStock;
use Illuminate\Support\Facades\Notification;

use function Pest\Laravel\actingAs;
use function Pest\Laravel\assertDatabaseHas;
use function Pest\Laravel\get;

beforeEach(function (): void {
    Notification::fake();
});

describe('Stock Movement CRUD', function (): void {
    it('redirects guest to login', function (): void {
        get(route('stock-movements.index'))->assertRedirect('login');
    });

    it('lists stock movements paginated', function (): void {
        $user = User::factory()->create(['role' => 'staff']);

        StockMovement::factory()
            ->count(3)
            ->create();

        actingAs($user)
            ->get(route('stock-movements.index'))
            ->assertInertia(fn ($page) => $page
                ->component('stock-movements/Index')
                ->has('movements.data', 3)
            );
    });

    it('validates required fields when recording a movement', function (): void {
        $user = User::factory()->create(['role' => 'staff']);

        actingAs($user)
            ->post(route('stock-movements.store'), [])
            ->assertSessionHasErrors(['product_id', 'type', 'qty']);
    });

    it('records an in movement and updates stock', function (): void {
        $user = User::factory()->create(['role' => 'staff']);
        $product = Product::factory()->create(['stock_qty' => 10]);

        actingAs($user)->post(route('stock-movements.store'), [
            'product_id' => $product->id,
            'type' => 'in',
            'qty' => 5,
            'reference' => 'PO-001',
            'notes' => 'Restock',
        ]);

        $product->refresh();

        assertDatabaseHas('stock_movements', [
            'product_id' => $product->id,
            'type' => 'in',
            'qty' => 5,
            'before_qty' => 10,
            'after_qty' => 15,
            'reference' => 'PO-001',
            'notes' => 'Restock',
            'user_id' => $user->id,
        ]);

        expect($product->stock_qty)->toBe(15);
    });

    it('records an out movement and decreases stock', function (): void {
        $user = User::factory()->create(['role' => 'staff']);
        $product = Product::factory()->create(['stock_qty' => 20]);

        actingAs($user)->post(route('stock-movements.store'), [
            'product_id' => $product->id,
            'type' => 'out',
            'qty' => 8,
        ]);

        $product->refresh();

        expect($product->stock_qty)->toBe(12);
        expect(StockMovement::query()
            ->where('product_id', $product->id)->first()->after_qty)->toBe(12);
    });

    it('records an adjustment movement', function (): void {
        $user = User::factory()->create(['role' => 'staff']);
        $product = Product::factory()->create(['stock_qty' => 10]);

        actingAs($user)->post(route('stock-movements.store'), [
            'product_id' => $product->id,
            'type' => 'adjustment',
            'qty' => 3,
        ]);

        $product->refresh();

        expect($product->stock_qty)->toBe(13);
    });

    it('rejects out movement when stock is insufficient', function (): void {
        $user = User::factory()->create(['role' => 'staff']);
        $product = Product::factory()->create(['stock_qty' => 5]);

        actingAs($user)
            ->post(route('stock-movements.store'), [
                'product_id' => $product->id,
                'type' => 'out',
                'qty' => 10,
            ])
            ->assertSessionHasErrors('qty');

        $product->refresh();

        expect($product->stock_qty)->toBe(5);
    });

    it('staff can view and create movements', function (): void {
        $user = User::factory()->create(['role' => 'staff']);

        actingAs($user)
            ->get(route('stock-movements.index'))
            ->assertInertia(fn ($page) => $page->component('stock-movements/Index'));

        $product = Product::factory()->create();

        actingAs($user)->post(route('stock-movements.store'), [
            'product_id' => $product->id,
            'type' => 'in',
            'qty' => 5,
        ]);

        expect(StockMovement::query()
            ->count())->toBe(1);
    });
});

describe('Low Stock Notifications', function (): void {
    it('dispatches low stock notification when stock drops below reorder level', function (): void {
        $admin = User::factory()->create(['role' => 'admin']);
        $user = User::factory()->create(['role' => 'staff']);
        $product = Product::factory()->create([
            'stock_qty' => 6,
            'reorder_level' => 5,
        ]);

        actingAs($user)->post(route('stock-movements.store'), [
            'product_id' => $product->id,
            'type' => 'out',
            'qty' => 1,
        ]);

        $product->refresh();

        Notification::assertSentTo(
            [$admin],
            ProductLowStock::class,
            fn (ProductLowStock $productLowStock): bool => $productLowStock->product->id === $product->id,
        );
    });

    it('does not dispatch low stock notification when stock is above reorder level', function (): void {
        $admin = User::factory()->create(['role' => 'admin']);
        $user = User::factory()->create(['role' => 'staff']);
        $product = Product::factory()->create([
            'stock_qty' => 20,
            'reorder_level' => 5,
        ]);

        actingAs($user)->post(route('stock-movements.store'), [
            'product_id' => $product->id,
            'type' => 'out',
            'qty' => 1,
        ]);

        Notification::assertNotSentTo(
            [$admin],
            ProductLowStock::class,
        );
    });

    it('does not dispatch duplicate notifications on subsequent movements while already low', function (): void {
        $admin = User::factory()->create(['role' => 'admin']);
        $user = User::factory()->create(['role' => 'staff']);
        $product = Product::factory()->create([
            'stock_qty' => 6,
            'reorder_level' => 5,
        ]);

        actingAs($user)->post(route('stock-movements.store'), [
            'product_id' => $product->id,
            'type' => 'out',
            'qty' => 1,
        ]);

        Notification::assertSentTo(
            [$admin],
            ProductLowStock::class,
        );

        Notification::fake();

        actingAs($user)->post(route('stock-movements.store'), [
            'product_id' => $product->id,
            'type' => 'out',
            'qty' => 1,
        ]);

        Notification::assertNotSentTo(
            [$admin],
            ProductLowStock::class,
        );
    });

    it('sends only one notification per admin for a single stock movement', function (): void {
        $admin = User::factory()->create(['role' => 'admin']);
        $user = User::factory()->create(['role' => 'staff']);
        $product = Product::factory()->create([
            'stock_qty' => 6,
            'reorder_level' => 5,
        ]);

        Notification::fake();

        actingAs($user)->post(route('stock-movements.store'), [
            'product_id' => $product->id,
            'type' => 'out',
            'qty' => 1,
        ]);

        Notification::assertSentTo(
            [$admin],
            ProductLowStock::class,
            1,
        );
    });
});
