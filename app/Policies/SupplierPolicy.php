<?php

declare(strict_types=1);

namespace App\Policies;

use App\Enums\Role;
use App\Models\Supplier;
use App\Models\User;

class SupplierPolicy
{
    public function viewAny(User $user): bool
    {
        return true;
    }

    public function view(User $user, Supplier $supplier): bool
    {
        return true;
    }

    public function create(User $user): bool
    {
        return $user->role === Role::Admin || $user->role === Role::Superadmin;
    }

    public function update(User $user, Supplier $supplier): bool
    {
        return $user->role === Role::Admin || $user->role === Role::Superadmin;
    }

    public function delete(User $user, Supplier $supplier): bool
    {
        return $user->role === Role::Admin || $user->role === Role::Superadmin;
    }

    public function deactivate(User $user, Supplier $supplier): bool
    {
        return $user->role === Role::Admin || $user->role === Role::Superadmin;
    }
}
