<?php

declare(strict_types=1);

use App\Models\Category;
use App\Models\Supplier;
use App\Models\User;

test('guests are redirected to login', function (): void {
    $this->get(route('suppliers.index'))->assertRedirect(route('login'));
});

test('supplier name is required', function (): void {
    $admin = User::factory()->create(['role' => 'admin']);
    $this->actingAs($admin);

    $this->post(route('suppliers.store'), [])
        ->assertSessionHasErrors('name');
});

test('supplier name must be unique', function (): void {
    $admin = User::factory()->create(['role' => 'admin']);
    $this->actingAs($admin);

    Supplier::factory()->create(['name' => 'TechSupply Co.']);

    $this->post(route('suppliers.store'), ['name' => 'TechSupply Co.'])
        ->assertSessionHasErrors('name');
});

test('superadmin can create a supplier', function (): void {
    $superadmin = User::factory()->create(['role' => 'superadmin']);
    $this->actingAs($superadmin);

    $this->post(route('suppliers.store'), [
        'name' => 'SuperSupplier',
        'email' => 'super@supplier.com',
        'phone' => '+1-555-0200',
    ])->assertRedirect();

    $this->assertDatabaseHas('suppliers', [
        'name' => 'SuperSupplier',
        'email' => 'super@supplier.com',
    ]);
});

test('superadmin can update a supplier', function (): void {
    $superadmin = User::factory()->create(['role' => 'superadmin']);
    $this->actingAs($superadmin);

    $supplier = Supplier::factory()->create(['name' => 'Old Name']);

    $this->put(route('suppliers.update', $supplier), [
        'name' => 'New Name',
        'email' => 'new@supplier.com',
    ])->assertRedirect();

    $supplier->refresh();
    expect($supplier->name)->toBe('New Name');
});

test('superadmin can deactivate a supplier', function (): void {
    $superadmin = User::factory()->create(['role' => 'superadmin']);
    $this->actingAs($superadmin);

    $supplier = Supplier::factory()->create(['is_active' => true]);

    $this->put(route('suppliers.deactivate', $supplier))
        ->assertRedirect();

    $this->assertDatabaseHas('suppliers', [
        'id' => $supplier->id,
        'is_active' => 0,
    ]);
});

test('superadmin can reactivate a supplier', function (): void {
    $superadmin = User::factory()->create(['role' => 'superadmin']);
    $this->actingAs($superadmin);

    $supplier = Supplier::factory()->create([
        'is_active' => false,
        'deactivated_at' => now()->subMonth(),
    ]);

    $this->put(route('suppliers.activate', $supplier))
        ->assertRedirect();

    $supplier->refresh();
    expect($supplier->is_active)->toBeTrue();
    expect($supplier->deactivated_at)->toBeNull();
});

test('superadmin can archive an inactive supplier', function (): void {
    $superadmin = User::factory()->create(['role' => 'superadmin']);
    $this->actingAs($superadmin);

    $supplier = Supplier::factory()->create(['is_active' => false]);

    $this->put(route('suppliers.archive', $supplier))
        ->assertRedirect();

    $supplier->refresh();
    expect($supplier->is_active)->toBeFalse();
    expect($supplier->archived_at)->not->toBeNull();
});

test('superadmin can restore an archived supplier', function (): void {
    $superadmin = User::factory()->create(['role' => 'superadmin']);
    $this->actingAs($superadmin);

    $supplier = Supplier::factory()->create([
        'is_active' => false,
        'deactivated_at' => now()->subMonth(),
        'archived_at' => now()->subDay(),
    ]);

    $this->put(route('suppliers.restore', $supplier))
        ->assertRedirect();

    $supplier->refresh();
    expect($supplier->is_active)->toBeFalse();
    expect($supplier->deactivated_at)->not->toBeNull();
    expect($supplier->archived_at)->toBeNull();
});

test('admin can create a supplier', function (): void {
    $admin = User::factory()->create(['role' => 'admin']);
    $this->actingAs($admin);

    $this->post(route('suppliers.store'), [
        'name' => 'TechSupply Co.',
        'email' => 'orders@techsupply.com',
        'phone' => '+1-555-0100',
    ])->assertRedirect();

    $this->assertDatabaseHas('suppliers', [
        'name' => 'TechSupply Co.',
        'email' => 'orders@techsupply.com',
        'phone' => '+1-555-0100',
        'is_active' => true,
    ]);
});

test('admin can update a supplier', function (): void {
    $admin = User::factory()->create(['role' => 'admin']);
    $this->actingAs($admin);

    $supplier = Supplier::factory()->create(['name' => 'Old Name']);

    $this->put(route('suppliers.update', $supplier), [
        'name' => 'New Name',
        'email' => 'new@supplier.com',
    ])->assertRedirect();

    $supplier->refresh();
    expect($supplier->name)->toBe('New Name');
    expect($supplier->email)->toBe('new@supplier.com');
});

test('admin cannot update an archived supplier', function (): void {
    $admin = User::factory()->create(['role' => 'admin']);
    $this->actingAs($admin);

    $supplier = Supplier::factory()->create([
        'name' => 'Archived Supplier',
        'is_active' => false,
        'archived_at' => now(),
    ]);

    $this->put(route('suppliers.update', $supplier), ['name' => 'New Name'])
        ->assertForbidden();

    $supplier->refresh();
    expect($supplier->name)->toBe('Archived Supplier');
});

test('admin can deactivate a supplier', function (): void {
    $admin = User::factory()->create(['role' => 'admin']);
    $this->actingAs($admin);

    $supplier = Supplier::factory()->create(['is_active' => true]);

    $this->put(route('suppliers.deactivate', $supplier))
        ->assertRedirect();

    $this->assertDatabaseHas('suppliers', [
        'id' => $supplier->id,
        'is_active' => 0,
    ]);

    $supplier->refresh();
    expect($supplier->deactivated_at)->not->toBeNull();
});

test('staff can view suppliers', function (): void {
    $staff = User::factory()->create(['role' => 'staff']);
    $this->actingAs($staff);

    $this->get(route('suppliers.index'))->assertOk();
});

test('staff cannot create a supplier', function (): void {
    $staff = User::factory()->create(['role' => 'staff']);
    $this->actingAs($staff);

    $this->post(route('suppliers.store'), ['name' => 'Test'])
        ->assertForbidden();
});

test('staff cannot update a supplier', function (): void {
    $staff = User::factory()->create(['role' => 'staff']);
    $this->actingAs($staff);

    $supplier = Supplier::factory()->create();

    $this->put(route('suppliers.update', $supplier), ['name' => 'New'])
        ->assertForbidden();
});

test('staff cannot deactivate a supplier', function (): void {
    $staff = User::factory()->create(['role' => 'staff']);
    $this->actingAs($staff);

    $supplier = Supplier::factory()->create();

    $this->put(route('suppliers.deactivate', $supplier))
        ->assertForbidden();
});

test('staff cannot reactivate a supplier', function (): void {
    $staff = User::factory()->create(['role' => 'staff']);
    $this->actingAs($staff);

    $supplier = Supplier::factory()->create(['is_active' => false]);

    $this->put(route('suppliers.activate', $supplier))
        ->assertForbidden();
});

test('admin can reactivate a supplier', function (): void {
    $admin = User::factory()->create(['role' => 'admin']);
    $this->actingAs($admin);

    $supplier = Supplier::factory()->create([
        'is_active' => false,
        'deactivated_at' => now()->subMonth(),
    ]);

    $this->put(route('suppliers.activate', $supplier))
        ->assertRedirect();

    $supplier->refresh();
    expect($supplier->is_active)->toBeTrue();
    expect($supplier->deactivated_at)->toBeNull();
    expect($supplier->archived_at)->toBeNull();
});

test('admin cannot reactivate an archived supplier', function (): void {
    $admin = User::factory()->create(['role' => 'admin']);
    $this->actingAs($admin);

    $supplier = Supplier::factory()->create([
        'is_active' => false,
        'deactivated_at' => now()->subMonth(),
        'archived_at' => now()->subDay(),
    ]);

    $this->put(route('suppliers.activate', $supplier))
        ->assertForbidden();

    $supplier->refresh();
    expect($supplier->is_active)->toBeFalse();
    expect($supplier->archived_at)->not->toBeNull();
});

test('admin cannot reactivate an already active supplier', function (): void {
    $admin = User::factory()->create(['role' => 'admin']);
    $this->actingAs($admin);

    $supplier = Supplier::factory()->create(['is_active' => true]);

    $this->put(route('suppliers.activate', $supplier))
        ->assertForbidden();

    $supplier->refresh();
    expect($supplier->is_active)->toBeTrue();
});

test('admin can archive an inactive supplier', function (): void {
    $admin = User::factory()->create(['role' => 'admin']);
    $this->actingAs($admin);

    $supplier = Supplier::factory()->create(['is_active' => false]);

    $this->put(route('suppliers.archive', $supplier))
        ->assertRedirect();

    $supplier->refresh();
    expect($supplier->is_active)->toBeFalse();
    expect($supplier->archived_at)->not->toBeNull();
});

test('admin cannot archive an active supplier', function (): void {
    $admin = User::factory()->create(['role' => 'admin']);
    $this->actingAs($admin);

    $supplier = Supplier::factory()->create(['is_active' => true]);

    $this->put(route('suppliers.archive', $supplier))
        ->assertForbidden();

    $supplier->refresh();
    expect($supplier->is_active)->toBeTrue();
    expect($supplier->archived_at)->toBeNull();
});

test('admin cannot restore a non-archived supplier', function (): void {
    $admin = User::factory()->create(['role' => 'admin']);
    $this->actingAs($admin);

    $activeSupplier = Supplier::factory()->create(['is_active' => true]);

    $this->put(route('suppliers.restore', $activeSupplier))
        ->assertForbidden();

    $inactiveSupplier = Supplier::factory()->create(['is_active' => false]);

    $this->put(route('suppliers.restore', $inactiveSupplier))
        ->assertForbidden();
});

test('admin can restore an archived supplier as inactive', function (): void {
    $admin = User::factory()->create(['role' => 'admin']);
    $this->actingAs($admin);

    $supplier = Supplier::factory()->create([
        'is_active' => false,
        'deactivated_at' => now()->subMonth(),
        'archived_at' => now()->subDay(),
    ]);

    $this->put(route('suppliers.restore', $supplier))
        ->assertRedirect();

    $supplier->refresh();
    expect($supplier->is_active)->toBeFalse();
    expect($supplier->deactivated_at)->not->toBeNull();
    expect($supplier->archived_at)->toBeNull();
});

test('supplier list shows all suppliers by default', function (): void {
    $admin = User::factory()->create(['role' => 'admin']);
    $this->actingAs($admin);

    Supplier::factory()->create(['name' => 'Active Supplier', 'is_active' => true]);
    Supplier::factory()->create(['name' => 'Inactive Supplier', 'is_active' => false]);
    Supplier::factory()->create([
        'name' => 'Archived Supplier',
        'is_active' => false,
        'archived_at' => now(),
    ]);

    $this->get(route('suppliers.index'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->has('suppliers.data', 3)
            ->where('filters.status', 'all')
        );
});

test('supplier list can be filtered to archived suppliers', function (): void {
    $admin = User::factory()->create(['role' => 'admin']);
    $this->actingAs($admin);

    Supplier::factory()->create(['name' => 'Active Supplier', 'is_active' => true]);
    Supplier::factory()->create([
        'name' => 'Archived Supplier',
        'is_active' => false,
        'archived_at' => now(),
    ]);

    $this->get(route('suppliers.index', ['status' => 'archived']))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->has('suppliers.data', 1)
            ->where('suppliers.data.0.name', 'Archived Supplier')
            ->where('filters.status', 'archived')
        );
});

test('admin can list suppliers with products count', function (): void {
    $admin = User::factory()->create(['role' => 'admin']);
    $this->actingAs($admin);

    $category = Category::factory()->create();
    $supplier = Supplier::factory()->create();
    $supplier->products()->create([
        'name' => 'Test Product',
        'sku' => 'SKU-TEST-001',
        'price' => 10.00,
        'cost' => 5.00,
        'stock_qty' => 10,
        'category_id' => $category->id,
    ]);

    $this->get(route('suppliers.index'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('suppliers/Index')
            ->has('suppliers.data', 1)
            ->where('suppliers.data.0.id', $supplier->id)
            ->where('suppliers.data.0.name', $supplier->name)
            ->where('suppliers.data.0.products_count', 1)
        );
});
