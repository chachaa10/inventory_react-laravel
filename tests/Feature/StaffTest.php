<?php

declare(strict_types=1);

use App\Models\User;

test('guests are redirected to login', function (): void {
    $this->get(route('staff.index'))->assertRedirect(route('login'));
});

test('staff cannot view staff list', function (): void {
    $staff = User::factory()->create(['role' => 'staff']);
    $this->actingAs($staff);

    $this->get(route('staff.index'))->assertForbidden();
});

test('admin can view staff list', function (): void {
    $admin = User::factory()->create(['role' => 'admin']);
    $this->actingAs($admin);

    $this->get(route('staff.index'))->assertOk();
});

test('admin can update a staff users role', function (): void {
    $admin = User::factory()->create(['role' => 'admin']);
    $this->actingAs($admin);

    $staff = User::factory()->create(['role' => 'staff']);

    $this->put(route('staff.update', $staff), [
        'name' => $staff->name,
        'email' => $staff->email,
        'role' => 'admin',
    ])->assertRedirect();

    $staff->refresh();
    expect($staff->role)->toBe('admin');
});

test('admin can deactivate a user', function (): void {
    $admin = User::factory()->create(['role' => 'admin']);
    $this->actingAs($admin);

    $staff = User::factory()->create(['role' => 'staff', 'is_active' => true]);

    $this->delete(route('staff.destroy', $staff))->assertRedirect();

    $this->assertDatabaseHas('users', [
        'id' => $staff->id,
        'is_active' => 0,
    ]);
});

test('admin can re-activate a deactivated user', function (): void {
    $admin = User::factory()->create(['role' => 'admin']);
    $this->actingAs($admin);

    $staff = User::factory()->create(['role' => 'staff', 'is_active' => false]);

    $this->put(route('staff.update', $staff), [
        'name' => $staff->name,
        'email' => $staff->email,
        'role' => 'staff',
        'is_active' => true,
    ])->assertRedirect();

    $staff->refresh();
    expect($staff->is_active)->toBeTrue();
});

test('staff cannot update a users role', function (): void {
    $staff = User::factory()->create(['role' => 'staff']);
    $this->actingAs($staff);

    $target = User::factory()->create(['role' => 'staff']);

    $this->put(route('staff.update', $target), [
        'name' => $target->name,
        'email' => $target->email,
        'role' => 'admin',
    ])->assertForbidden();
});

test('staff cannot deactivate a user', function (): void {
    $staff = User::factory()->create(['role' => 'staff']);
    $this->actingAs($staff);

    $target = User::factory()->create(['role' => 'staff']);

    $this->delete(route('staff.destroy', $target))
        ->assertForbidden();
});

test('role must be valid when updating', function (): void {
    $admin = User::factory()->create(['role' => 'admin']);
    $this->actingAs($admin);

    $staff = User::factory()->create(['role' => 'staff']);

    $this->put(route('staff.update', $staff), [
        'name' => $staff->name,
        'email' => $staff->email,
        'role' => 'superadmin',
    ])->assertSessionHasErrors('role');
});

test('name is required when updating', function (): void {
    $admin = User::factory()->create(['role' => 'admin']);
    $this->actingAs($admin);

    $staff = User::factory()->create(['role' => 'staff']);

    $this->put(route('staff.update', $staff), [
        'name' => '',
        'email' => $staff->email,
        'role' => 'staff',
    ])->assertSessionHasErrors('name');
});

test('email is required when updating', function (): void {
    $admin = User::factory()->create(['role' => 'admin']);
    $this->actingAs($admin);

    $staff = User::factory()->create(['role' => 'staff']);

    $this->put(route('staff.update', $staff), [
        'name' => $staff->name,
        'email' => '',
        'role' => 'staff',
    ])->assertSessionHasErrors('email');
});
