<?php

declare(strict_types=1);

namespace App\Actions\Catalog;

use App\Models\Product;
use Illuminate\Http\UploadedFile;

class UpdateProductAction
{
    /**
     * @param  array<string, mixed>  $data
     */
    public function execute(Product $product, array $data, ?UploadedFile $image = null): Product
    {
        $product->update($data);

        if ($image instanceof UploadedFile) {
            $product->clearMediaCollection('image');
            $product->addMedia($image)->toMediaCollection('image');
        }

        return $product;
    }
}
