<?php

declare(strict_types=1);

namespace App\Actions\Parties;

use App\Models\Supplier;

class ArchiveSupplierAction
{
    public function execute(Supplier $supplier): void
    {
        $supplier->update([
            'is_active' => false,
            'deactivated_at' => $supplier->deactivated_at ?? now(),
            'archived_at' => now(),
        ]);
    }
}
