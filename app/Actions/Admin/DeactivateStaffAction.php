<?php

declare(strict_types=1);

namespace App\Actions\Admin;

use App\Models\User;

class DeactivateStaffAction
{
    public function execute(User $user): void
    {
        $user->update([
            'is_active' => false,
        ]);
    }
}
