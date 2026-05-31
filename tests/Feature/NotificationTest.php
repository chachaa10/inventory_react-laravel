<?php

declare(strict_types=1);

use App\Models\Product;
use App\Models\User;
use App\Notifications\ProductLowStock;

use function Pest\Laravel\actingAs;

test('guests are redirected to login', function (): void {
    $this->get(route('notifications.index'))->assertRedirect(route('login'));
});

test('shows unread count in shared props', function (): void {
    $admin = User::factory()->create(['role' => 'admin']);

    actingAs($admin)
        ->get(route('dashboard'))
        ->assertInertia(fn ($page) => $page
            ->where('unreadNotificationsCount', 0)
        );

    $admin->notify(new ProductLowStock(Product::factory()->create()));
    $admin->notify(new ProductLowStock(Product::factory()->create()));

    actingAs($admin)
        ->get(route('dashboard'))
        ->assertInertia(fn ($page) => $page
            ->where('unreadNotificationsCount', 2)
        );
});

test('cannot view another users notification', function (): void {
    $admin = User::factory()->create(['role' => 'admin']);
    $other = User::factory()->create(['role' => 'staff']);

    $admin->notify(new ProductLowStock(Product::factory()->create()));
    $notification = $admin->notifications()->first();

    actingAs($other)
        ->get(route('notifications.show', $notification->id))
        ->assertForbidden();
});

test('redirects to products index from low stock notification', function (): void {
    $admin = User::factory()->create(['role' => 'admin']);
    $product = Product::factory()->create();

    $admin->notify(new ProductLowStock($product));
    $notification = $admin->notifications()->first();

    actingAs($admin)
        ->get(route('notifications.show', $notification->id))
        ->assertRedirect(route('products.index'));
});

test('marks all notifications as read', function (): void {
    $admin = User::factory()->create(['role' => 'admin']);
    $product = Product::factory()->create();

    $admin->notify(new ProductLowStock($product));
    $admin->notify(new ProductLowStock(Product::factory()->create()));

    expect($admin->unreadNotifications()->count())->toBe(2);

    actingAs($admin)
        ->patch(route('notifications.mark-all-read'))
        ->assertRedirect();

    expect($admin->unreadNotifications()->count())->toBe(0);
});

test('shows notification as read and redirects to context', function (): void {
    $admin = User::factory()->create(['role' => 'admin']);
    $product = Product::factory()->create();

    $admin->notify(new ProductLowStock($product));

    $notification = $admin->notifications()->first();

    expect($notification->read_at)->toBeNull();

    actingAs($admin)
        ->get(route('notifications.show', $notification->id))
        ->assertRedirect();

    $this->assertNotNull(
        $admin->notifications()->first()->read_at,
    );
});

test('lists authenticated user notifications', function (): void {
    $admin = User::factory()->create(['role' => 'admin']);

    $admin->notify(new ProductLowStock(Product::factory()->create()));

    actingAs($admin)
        ->get(route('notifications.index'))
        ->assertInertia(fn ($page) => $page
            ->component('notifications/Index')
            ->has('notifications.data', 1)
        );
});
