<?php

declare(strict_types=1);

namespace App\Policies;

use App\Enums\Role;
use App\Models\User;

class StaffPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->role === Role::Superadmin || $user->role === Role::Admin;
    }

    public function update(User $user, User $target): bool
    {
        if ($user->role === Role::Superadmin) {
            return true;
        }

        if ($user->role === Role::Admin) {
            return $target->role === Role::Staff;
        }

        return false;
    }

    public function deactivate(User $user, User $target): bool
    {
        if ($user->id === $target->id) {
            return false;
        }

        if ($user->role === Role::Superadmin) {
            return true;
        }

        if ($user->role === Role::Admin) {
            return $target->role === Role::Staff;
        }

        return false;
    }
}
