<?php

declare(strict_types=1);

namespace App\Policies;

use App\Enums\Role;
use App\Models\Order;
use App\Models\User;

class OrderPolicy
{
    public function viewAny(User $user): bool
    {
        return true;
    }

    public function view(User $user, Order $order): bool
    {
        return true;
    }

    public function create(User $user): bool
    {
        return in_array($user->role, [Role::Superadmin, Role::Admin, Role::Staff], true);
    }

    public function cancel(User $user, Order $order): bool
    {
        return $user->role === Role::Superadmin || $user->role === Role::Admin;
    }
}
