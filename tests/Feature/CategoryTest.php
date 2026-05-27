<?php

declare(strict_types=1);

use App\Models\Category;
use App\Models\User;

test('guests are redirected to login', function (): void {
    $this->get(route('categories.index'))->assertRedirect(route('login'));
});

test('category name is required', function (): void {
    $admin = User::factory()->create(['role' => 'admin']);
    $this->actingAs($admin);

    $this->post(route('categories.store'), [])
        ->assertSessionHasErrors('name');
});

test('category name must be unique', function (): void {
    $admin = User::factory()->create(['role' => 'admin']);
    $this->actingAs($admin);

    Category::factory()->create(['name' => 'Electronics']);
    Category::factory()->create(['name' => 'Clothing']);

    $this->post(route('categories.store'), ['name' => 'Electronics'])
        ->assertSessionHasErrors('name');
});

test('admin can create a category', function (): void {
    $admin = User::factory()->create(['role' => 'admin']);
    $this->actingAs($admin);

    $this->post(route('categories.store'), [
        'name' => 'Electronics',
    ])->assertRedirect();

    $this->assertDatabaseHas('categories', [
        'name' => 'Electronics',
        'slug' => 'electronics',
    ]);
});

test('admin can update a category', function (): void {
    $admin = User::factory()->create(['role' => 'admin']);
    $this->actingAs($admin);

    $category = Category::factory()->create(['name' => 'Old Name']);

    $this->put(route('categories.update', $category), [
        'name' => 'New Name',
    ])->assertRedirect();

    $category->refresh();
    expect($category->name)->toBe('New Name');
    expect($category->slug)->toBe('new-name');
});

test('admin can delete a category', function (): void {
    $admin = User::factory()->create(['role' => 'admin']);
    $this->actingAs($admin);

    $category = Category::factory()->create();

    $this->delete(route('categories.destroy', $category))
        ->assertRedirect();

    $this->assertSoftDeleted($category);
});

test('staff can view categories', function (): void {
    $staff = User::factory()->create(['role' => 'staff']);
    $this->actingAs($staff);

    $this->get(route('categories.index'))->assertOk();
});

test('staff cannot create a category', function (): void {
    $staff = User::factory()->create(['role' => 'staff']);
    $this->actingAs($staff);

    $this->post(route('categories.store'), ['name' => 'Test'])
        ->assertForbidden();
});

test('staff cannot update a category', function (): void {
    $staff = User::factory()->create(['role' => 'staff']);
    $this->actingAs($staff);

    $category = Category::factory()->create();

    $this->put(route('categories.update', $category), ['name' => 'New'])
        ->assertForbidden();
});

test('staff cannot delete a category', function (): void {
    $staff = User::factory()->create(['role' => 'staff']);
    $this->actingAs($staff);

    $category = Category::factory()->create();

    $this->delete(route('categories.destroy', $category))
        ->assertForbidden();
});

test('cannot delete category with products', function (): void {
    $admin = User::factory()->create(['role' => 'admin']);
    $this->actingAs($admin);

    $category = Category::factory()->create();
    $category->products()->create([
        'name' => 'Test Product',
        'sku' => 'SKU-TEST-001',
        'price' => 10.00,
        'cost' => 5.00,
        'stock_qty' => 10,
    ]);

    $this->delete(route('categories.destroy', $category))
        ->assertRedirect();
    $this->assertNotSoftDeleted($category);
});

test('admin can list categories with products count', function (): void {
    $admin = User::factory()->create(['role' => 'admin']);
    $this->actingAs($admin);

    $category = Category::factory()->create();
    $category->products()->create([
        'name' => 'Test Product',
        'sku' => 'SKU-TEST-001',
        'price' => 10.00,
        'cost' => 5.00,
        'stock_qty' => 10,
    ]);

    $this->get(route('categories.index'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('categories/Index')
            ->has('categories', 1)
            ->where('categories.0.id', $category->id)
            ->where('categories.0.name', $category->name)
            ->where('categories.0.products_count', 1)
        );
});
