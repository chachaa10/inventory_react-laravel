<?php

declare(strict_types=1);

namespace App\Actions\Parties;

use App\Models\Supplier;

class ActivateSupplierAction
{
    public function execute(Supplier $supplier): void
    {
        $supplier->update([
            'is_active' => true,
            'deactivated_at' => null,
            'archived_at' => null,
        ]);
    }
}
