<?php

declare(strict_types=1);

namespace App\Actions\Catalog;

use App\Models\Product;

class DeleteProductAction
{
    public function execute(Product $product): void
    {
        $product->delete();
    }
}
