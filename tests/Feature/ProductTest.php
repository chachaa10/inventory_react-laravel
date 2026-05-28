<?php

declare(strict_types=1);

use App\Models\Category;
use App\Models\Product;
use App\Models\Supplier;
use App\Models\User;
use Illuminate\Http\UploadedFile;

test('guests are redirected to login', function (): void {
    $this->get(route('products.index'))->assertRedirect(route('login'));
});

test('product name is required', function (): void {
    $admin = User::factory()->create(['role' => 'admin']);
    $this->actingAs($admin);

    $this->post(route('products.store'), [])
        ->assertSessionHasErrors(['name', 'sku', 'price', 'category_id']);
});

test('sku must be unique', function (): void {
    $admin = User::factory()->create(['role' => 'admin']);
    $this->actingAs($admin);

    $category = Category::factory()->create();
    Product::factory()->create(['sku' => 'TEST-SKU']);

    $this->post(route('products.store'), [
        'name' => 'Test Product',
        'sku' => 'TEST-SKU',
        'price' => 10.00,
        'category_id' => $category->id,
    ])->assertSessionHasErrors('sku');
});

test('admin can create a product', function (): void {
    $admin = User::factory()->create(['role' => 'admin']);
    $this->actingAs($admin);

    $category = Category::factory()->create();

    $this->post(route('products.store'), [
        'name' => 'Test Product',
        'sku' => 'SKU-TEST-001',
        'price' => 29.99,
        'cost' => 15.50,
        'unit' => 'pcs',
        'reorder_level' => 10,
        'category_id' => $category->id,
    ])->assertRedirect();

    $this->assertDatabaseHas('products', [
        'name' => 'Test Product',
        'sku' => 'SKU-TEST-001',
        'price' => 29.99,
        'cost' => 15.50,
    ]);
});

test('product cannot be created with an archived supplier', function (): void {
    $admin = User::factory()->create(['role' => 'admin']);
    $this->actingAs($admin);

    $category = Category::factory()->create();
    $supplier = Supplier::factory()->create([
        'is_active' => false,
        'archived_at' => now(),
    ]);

    $this->post(route('products.store'), [
        'name' => 'Test Product',
        'sku' => 'SKU-TEST-ARCHIVED',
        'price' => 29.99,
        'unit' => 'pcs',
        'reorder_level' => 10,
        'category_id' => $category->id,
        'supplier_id' => $supplier->id,
    ])->assertSessionHasErrors('supplier_id');
});

test('admin can create a product with image', function (): void {
    $admin = User::factory()->create(['role' => 'admin']);
    $this->actingAs($admin);

    $category = Category::factory()->create();
    $image = UploadedFile::fake()->image('product.jpg', 200, 200);

    $this->post(route('products.store'), [
        'name' => 'Product With Image',
        'sku' => 'SKU-IMG-001',
        'price' => 19.99,
        'unit' => 'pcs',
        'reorder_level' => 5,
        'category_id' => $category->id,
        'image' => $image,
    ])->assertRedirect();

    $product = Product::query()->where('sku', 'SKU-IMG-001')->first();
    expect($product)->not->toBeNull();
    expect($product->getFirstMedia('image'))->not->toBeNull();
});

test('admin can update a product', function (): void {
    $admin = User::factory()->create(['role' => 'admin']);
    $this->actingAs($admin);

    $category = Category::factory()->create();
    $product = Product::factory()->create([
        'name' => 'Old Name',
        'category_id' => $category->id,
    ]);

    $this->put(route('products.update', $product), [
        'name' => 'New Name',
        'sku' => $product->sku,
        'price' => 49.99,
        'unit' => 'pcs',
        'reorder_level' => 5,
        'category_id' => $category->id,
    ])->assertRedirect();

    $product->refresh();
    expect($product->name)->toBe('New Name');
    expect($product->price)->toBe(49.99);
});

test('product cannot be updated to an archived supplier', function (): void {
    $admin = User::factory()->create(['role' => 'admin']);
    $this->actingAs($admin);

    $category = Category::factory()->create();
    $product = Product::factory()->create(['category_id' => $category->id]);
    $supplier = Supplier::factory()->create([
        'is_active' => false,
        'archived_at' => now(),
    ]);

    $this->put(route('products.update', $product), [
        'name' => $product->name,
        'sku' => $product->sku,
        'price' => $product->price,
        'unit' => $product->unit,
        'reorder_level' => $product->reorder_level,
        'category_id' => $category->id,
        'supplier_id' => $supplier->id,
    ])->assertSessionHasErrors('supplier_id');
});

test('product can keep its current archived supplier when updated', function (): void {
    $admin = User::factory()->create(['role' => 'admin']);
    $this->actingAs($admin);

    $category = Category::factory()->create();
    $supplier = Supplier::factory()->create([
        'is_active' => false,
        'archived_at' => now(),
    ]);
    $product = Product::factory()->create([
        'category_id' => $category->id,
        'supplier_id' => $supplier->id,
    ]);

    $this->put(route('products.update', $product), [
        'name' => 'Updated Product',
        'sku' => $product->sku,
        'price' => $product->price,
        'unit' => $product->unit,
        'reorder_level' => $product->reorder_level,
        'category_id' => $category->id,
        'supplier_id' => $supplier->id,
    ])->assertRedirect();

    $product->refresh();
    expect($product->name)->toBe('Updated Product');
    expect($product->supplier_id)->toBe($supplier->id);
});

test('admin can update a product with image replacement', function (): void {
    $admin = User::factory()->create(['role' => 'admin']);
    $this->actingAs($admin);

    $category = Category::factory()->create();
    $product = Product::factory()->create(['category_id' => $category->id]);

    $product->addMedia(UploadedFile::fake()->image('old.jpg', 100, 100))
        ->toMediaCollection('image');

    expect($product->getFirstMedia('image'))->not->toBeNull();

    $file = UploadedFile::fake()->image('new.jpg', 200, 200);

    $this->put(route('products.update', $product), [
        'name' => $product->name,
        'sku' => $product->sku,
        'price' => $product->price,
        'unit' => $product->unit,
        'reorder_level' => $product->reorder_level,
        'category_id' => $product->category_id,
        'image' => $file,
    ])->assertRedirect();
});

test('admin can delete a product', function (): void {
    $admin = User::factory()->create(['role' => 'admin']);
    $this->actingAs($admin);

    $product = Product::factory()->create();

    $this->delete(route('products.destroy', $product))
        ->assertRedirect();

    $this->assertSoftDeleted($product);
});

test('staff can view products', function (): void {
    $staff = User::factory()->create(['role' => 'staff']);
    $this->actingAs($staff);

    $this->get(route('products.index'))->assertOk();
});

test('staff can create a product', function (): void {
    $staff = User::factory()->create(['role' => 'staff']);
    $this->actingAs($staff);

    $category = Category::factory()->create();

    $this->post(route('products.store'), [
        'name' => 'Staff Product',
        'sku' => 'SKU-STAFF-001',
        'price' => 15.00,
        'unit' => 'pcs',
        'reorder_level' => 5,
        'category_id' => $category->id,
    ])->assertRedirect();

    $this->assertDatabaseHas('products', [
        'name' => 'Staff Product',
        'sku' => 'SKU-STAFF-001',
    ]);
});

test('staff can update a product', function (): void {
    $staff = User::factory()->create(['role' => 'staff']);
    $this->actingAs($staff);

    $product = Product::factory()->create();

    $this->put(route('products.update', $product), [
        'name' => 'Updated By Staff',
        'sku' => $product->sku,
        'price' => $product->price,
        'unit' => $product->unit,
        'reorder_level' => $product->reorder_level,
        'category_id' => $product->category_id,
    ])->assertRedirect();

    $product->refresh();
    expect($product->name)->toBe('Updated By Staff');
});

test('staff cannot delete a product', function (): void {
    $staff = User::factory()->create(['role' => 'staff']);
    $this->actingAs($staff);

    $product = Product::factory()->create();

    $this->delete(route('products.destroy', $product))
        ->assertForbidden();
});

test('can search products by name', function (): void {
    $admin = User::factory()->create(['role' => 'admin']);
    $this->actingAs($admin);

    Product::factory()->create(['name' => 'Wireless Mouse']);
    Product::factory()->create(['name' => 'Mechanical Keyboard']);

    $this->get(route('products.index', ['search' => 'Mouse']))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('products/Index')
            ->has('products.data', 1)
            ->where('products.data.0.name', 'Wireless Mouse')
        );
});

test('can search products by sku', function (): void {
    $admin = User::factory()->create(['role' => 'admin']);
    $this->actingAs($admin);

    Product::factory()->create(['sku' => 'WM-001', 'name' => 'Wireless Mouse']);
    Product::factory()->create(['sku' => 'MK-002', 'name' => 'Keyboard']);

    $this->get(route('products.index', ['search' => 'WM-']))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('products/Index')
            ->has('products.data', 1)
            ->where('products.data.0.sku', 'WM-001')
        );
});

test('can filter products by category', function (): void {
    $admin = User::factory()->create(['role' => 'admin']);
    $this->actingAs($admin);

    $cat1 = Category::factory()->create();
    $cat2 = Category::factory()->create();

    Product::factory()->create(['name' => 'Product A', 'category_id' => $cat1->id]);
    Product::factory()->create(['name' => 'Product B', 'category_id' => $cat2->id]);

    $this->get(route('products.index', ['category_id' => $cat1->id]))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('products/Index')
            ->has('products.data', 1)
            ->where('products.data.0.name', 'Product A')
        );
});

test('can filter products by stock status', function (): void {
    $admin = User::factory()->create(['role' => 'admin']);
    $this->actingAs($admin);

    Product::factory()->create(['name' => 'In Stock Product', 'stock_qty' => 50, 'reorder_level' => 10]);
    Product::factory()->create(['name' => 'Low Stock Product', 'stock_qty' => 5, 'reorder_level' => 10]);
    Product::factory()->create(['name' => 'Out Of Stock Product', 'stock_qty' => 0, 'reorder_level' => 10]);

    $this->get(route('products.index', ['stock_status' => 'low']))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('products/Index')
            ->has('products.data', 1)
            ->where('products.data.0.name', 'Low Stock Product')
        );

    $this->get(route('products.index', ['stock_status' => 'out']))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('products/Index')
            ->has('products.data', 1)
            ->where('products.data.0.name', 'Out Of Stock Product')
        );
});

test('cannot delete product with stock movements', function (): void {
    $admin = User::factory()->create(['role' => 'admin']);
    $this->actingAs($admin);

    $product = Product::factory()->create();
    $product->stockMovements()->create([
        'product_id' => $product->id,
        'type' => 'in',
        'qty' => 10,
        'before_qty' => 0,
        'after_qty' => 10,
        'user_id' => $admin->id,
    ]);

    $this->delete(route('products.destroy', $product))
        ->assertRedirect();

    $this->assertNotSoftDeleted($product);
});

test('index loads categories and suppliers for filters', function (): void {
    $admin = User::factory()->create(['role' => 'admin']);
    $this->actingAs($admin);

    Category::factory()->count(3)->create();
    Supplier::factory()->count(2)->create();

    $this->get(route('products.index'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('products/Index')
            ->has('categories', 3)
            ->has('suppliers', 2)
        );
});

test('supplier list excludes deactivated suppliers', function (): void {
    $admin = User::factory()->create(['role' => 'admin']);
    $this->actingAs($admin);

    Supplier::factory()->create(['name' => 'Active Supplier', 'is_active' => true]);
    Supplier::factory()->create(['name' => 'Inactive Supplier', 'is_active' => false]);

    $this->get(route('products.index'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('products/Index')
            ->has('suppliers', 1)
            ->where('suppliers.0.name', 'Active Supplier')
        );
});
