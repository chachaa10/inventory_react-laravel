<?php

declare(strict_types=1);

namespace App\Actions\Parties;

use App\Models\Supplier;

class CreateSupplierAction
{
    /** @param array<string, mixed> $data */
    public function execute(array $data): Supplier
    {
        return Supplier::query()->create($data);
    }
}
