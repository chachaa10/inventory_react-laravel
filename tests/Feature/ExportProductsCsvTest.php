<?php

declare(strict_types=1);

use App\Jobs\ExportProductsCsv;
use App\Models\Product;
use App\Models\User;
use App\Notifications\ExportReady;
use Illuminate\Support\Facades\Queue;
use Illuminate\Support\Facades\Storage;

test('generates CSV file and updates notification when job runs', function (): void {
    $user = User::factory()->create(['role' => 'admin']);
    Product::factory()->count(2)->create();

    $user->notify(new ExportReady);

    Storage::fake('local');

    new ExportProductsCsv($user)->handle();

    $files = Storage::disk('local')->files('exports');
    expect($files)->toHaveCount(1);

    $csv = Storage::disk('local')->get($files[0]);
    expect($csv)->toContain('Name,SKU');
    expect(explode("\n", trim((string) $csv)))->toHaveCount(3);

    $notification = $user->notifications()->first();
    expect($notification->data['status'])->toBe('completed');
    expect($notification->data['file'])->toContain('exports/products-');
});

test('admin can trigger product export via endpoint', function (): void {
    $admin = User::factory()->create(['role' => 'admin']);
    Product::factory()->count(2)->create();

    Storage::fake('local');

    $this->actingAs($admin)
        ->post(route('exports.products'))
        ->assertRedirect();

    $files = Storage::disk('local')->files('exports');
    expect($files)->toHaveCount(1);
});

test('creates processing notification synchronously on trigger', function (): void {
    $admin = User::factory()->create(['role' => 'admin']);

    Queue::fake();

    $this->actingAs($admin)
        ->post(route('exports.products'))
        ->assertRedirect();

    $notification = $admin->notifications()->first();
    expect($notification)->not->toBeNull();
    expect($notification->data['status'])->toBe('processing');
});

test('staff cannot export products', function (): void {
    $staff = User::factory()->create(['role' => 'staff']);

    $this->actingAs($staff)
        ->post(route('exports.products'))
        ->assertForbidden();
});

test('guest is redirected to login', function (): void {
    $this->post(route('exports.products'))->assertRedirect(route('login'));
});

test('redirects to download from completed export notification', function (): void {
    $admin = User::factory()->create(['role' => 'admin']);

    $admin->notify(new ExportReady('exports/products-20260531-123456.csv'));

    $notification = $admin->notifications()->first();

    $this->actingAs($admin)
        ->get(route('notifications.show', $notification->id))
        ->assertRedirect(route('exports.download', 'products-20260531-123456.csv'));
});

test('redirects to notifications list from processing export notification', function (): void {
    $admin = User::factory()->create(['role' => 'admin']);

    $admin->notify(new ExportReady);

    $notification = $admin->notifications()->first();

    $this->actingAs($admin)
        ->get(route('notifications.show', $notification->id))
        ->assertRedirect(route('notifications.index'));
});

test('download route serves the CSV file', function (): void {
    $admin = User::factory()->create(['role' => 'admin']);

    Storage::fake('local');
    Storage::disk('local')->put('exports/test-products.csv', "Name,SKU\nTest,ABC123");

    $this->actingAs($admin)
        ->get(route('exports.download', 'test-products.csv'))
        ->assertOk();
});

test('download route returns 404 for missing file', function (): void {
    $admin = User::factory()->create(['role' => 'admin']);

    $this->actingAs($admin)
        ->get(route('exports.download', 'nonexistent.csv'))
        ->assertNotFound();
});

test('staff cannot download exports', function (): void {
    $staff = User::factory()->create(['role' => 'staff']);

    $this->actingAs($staff)
        ->get(route('exports.download', 'test.csv'))
        ->assertForbidden();
});
