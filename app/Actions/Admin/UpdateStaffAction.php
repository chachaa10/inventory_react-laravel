<?php

declare(strict_types=1);

namespace App\Actions\Admin;

use App\Models\User;

class UpdateStaffAction
{
    /** @param array<string, mixed> $data */
    public function execute(User $user, array $data): User
    {
        $user->update($data);

        return $user;
    }
}
