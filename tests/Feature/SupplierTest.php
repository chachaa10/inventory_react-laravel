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

test('admin can deactivate a supplier', function (): void {
    $admin = User::factory()->create(['role' => 'admin']);
    $this->actingAs($admin);

    $supplier = Supplier::factory()->create(['is_active' => true]);

    $this->delete(route('suppliers.destroy', $supplier))
        ->assertRedirect();

    $this->assertDatabaseHas('suppliers', [
        'id' => $supplier->id,
        'is_active' => 0,
    ]);
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

    $this->delete(route('suppliers.destroy', $supplier))
        ->assertForbidden();
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
