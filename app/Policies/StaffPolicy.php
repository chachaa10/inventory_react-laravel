<?php

declare(strict_types=1);

namespace App\Policies;

use App\Models\User;

class StaffPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->role === 'admin';
    }

    public function update(User $user, User $target): bool
    {
        return $user->role === 'admin';
    }

    public function deactivate(User $user, User $target): bool
    {
        return $user->role === 'admin';
    }
}
