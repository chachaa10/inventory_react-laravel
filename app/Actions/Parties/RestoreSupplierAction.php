<?php

declare(strict_types=1);

namespace App\Actions\Parties;

use App\Models\Supplier;

class RestoreSupplierAction
{
    public function execute(Supplier $supplier): void
    {
        $supplier->update([
            'is_active' => false,
            'archived_at' => null,
        ]);
    }
}
