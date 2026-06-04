<?php

declare(strict_types=1);

use App\Enums\Role;
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

test('admin cannot change a staff users role', function (): void {
    $admin = User::factory()->create(['role' => 'admin']);
    $this->actingAs($admin);

    $staff = User::factory()->create(['role' => 'staff']);

    $this->put(route('staff.update', $staff), [
        'role' => 'admin',
    ])->assertSessionHasErrors('role');
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
        'is_active' => true,
    ])->assertRedirect();

    $staff->refresh();
    expect($staff->is_active)->toBeTrue();
});

test('staff cannot update a user', function (): void {
    $staff = User::factory()->create(['role' => 'staff']);
    $this->actingAs($staff);

    $target = User::factory()->create(['role' => 'staff']);

    $this->put(route('staff.update', $target), [
        'is_active' => false,
    ])->assertForbidden();
});

test('staff cannot deactivate a user', function (): void {
    $staff = User::factory()->create(['role' => 'staff']);
    $this->actingAs($staff);

    $target = User::factory()->create(['role' => 'staff']);

    $this->delete(route('staff.destroy', $target))
        ->assertForbidden();
});

test('admin cannot set name when updating', function (): void {
    $admin = User::factory()->create(['role' => 'admin']);
    $this->actingAs($admin);

    $staff = User::factory()->create(['role' => 'staff']);

    $this->put(route('staff.update', $staff), [
        'name' => 'new name',
    ])->assertSessionHasErrors('name');
});

test('admin cannot set email when updating', function (): void {
    $admin = User::factory()->create(['role' => 'admin']);
    $this->actingAs($admin);

    $staff = User::factory()->create(['role' => 'staff']);

    $this->put(route('staff.update', $staff), [
        'email' => 'new@example.com',
    ])->assertSessionHasErrors('email');
});

test('admin cannot update another admin', function (): void {
    $admin1 = User::factory()->create(['role' => 'admin']);
    $admin2 = User::factory()->create(['role' => 'admin']);

    $this->actingAs($admin1);

    $this->put(route('staff.update', $admin2), [
        'is_active' => false,
    ])->assertForbidden();
});

test('admin cannot update a superadmin', function (): void {
    $admin = User::factory()->create(['role' => 'admin']);
    $superadmin = User::factory()->create(['role' => Role::Superadmin->value]);

    $this->actingAs($admin);

    $this->put(route('staff.update', $superadmin), [
        'is_active' => false,
    ])->assertForbidden();
});

test('admin cannot deactivate another admin', function (): void {
    $admin1 = User::factory()->create(['role' => 'admin']);
    $admin2 = User::factory()->create(['role' => 'admin']);

    $this->actingAs($admin1);

    $this->delete(route('staff.destroy', $admin2))->assertForbidden();
});

test('admin cannot deactivate a superadmin', function (): void {
    $admin = User::factory()->create(['role' => 'admin']);
    $superadmin = User::factory()->create(['role' => Role::Superadmin->value]);

    $this->actingAs($admin);

    $this->delete(route('staff.destroy', $superadmin))->assertForbidden();
});

test('superadmin can view staff list', function (): void {
    $superadmin = User::factory()->create(['role' => Role::Superadmin->value]);

    $this->actingAs($superadmin);

    $this->get(route('staff.index'))->assertOk();
});

test('superadmin can promote staff to admin', function (): void {
    $superadmin = User::factory()->create(['role' => Role::Superadmin->value]);
    $this->actingAs($superadmin);

    $staff = User::factory()->create(['role' => 'staff']);

    $this->put(route('staff.update', $staff), [
        'name' => $staff->name,
        'email' => $staff->email,
        'role' => 'admin',
    ])->assertRedirect();

    $staff->refresh();
    expect($staff->role)->toBe(Role::Admin);
});

test('superadmin can update an admin', function (): void {
    $superadmin = User::factory()->create(['role' => Role::Superadmin->value]);
    $this->actingAs($superadmin);

    $admin = User::factory()->create(['role' => 'admin']);

    $this->put(route('staff.update', $admin), [
        'name' => 'Updated',
        'email' => $admin->email,
        'role' => 'admin',
    ])->assertRedirect();

    $admin->refresh();
    expect($admin->name)->toBe('Updated');
});

test('superadmin can deactivate an admin', function (): void {
    $superadmin = User::factory()->create(['role' => Role::Superadmin->value]);
    $this->actingAs($superadmin);

    $admin = User::factory()->create(['role' => 'admin', 'is_active' => true]);

    $this->delete(route('staff.destroy', $admin))->assertRedirect();

    $this->assertDatabaseHas('users', [
        'id' => $admin->id,
        'is_active' => 0,
    ]);
});

test('superadmin cannot assign superadmin role', function (): void {
    $superadmin = User::factory()->create(['role' => Role::Superadmin->value]);
    $this->actingAs($superadmin);

    $admin = User::factory()->create(['role' => 'admin']);

    $this->put(route('staff.update', $admin), [
        'name' => $admin->name,
        'email' => $admin->email,
        'role' => 'superadmin',
    ])->assertSessionHasErrors('role');
});

test('admin can activate a user with string boolean value', function (): void {
    $admin = User::factory()->create(['role' => 'admin']);
    $this->actingAs($admin);

    $staff = User::factory()->create(['role' => 'staff', 'is_active' => false]);

    $this->putJson(route('staff.update', $staff), [
        'is_active' => 'true',
    ])->assertRedirect(route('staff.index'));

    $this->assertDatabaseHas('users', [
        'id' => $staff->id,
        'is_active' => 1,
    ]);
});

test('admin can deactivate a user with string boolean value', function (): void {
    $admin = User::factory()->create(['role' => 'admin']);
    $this->actingAs($admin);

    $staff = User::factory()->create(['role' => 'staff', 'is_active' => true]);

    $this->putJson(route('staff.update', $staff), [
        'is_active' => 'false',
    ])->assertRedirect(route('staff.index'));

    $this->assertDatabaseHas('users', [
        'id' => $staff->id,
        'is_active' => 0,
    ]);
});
