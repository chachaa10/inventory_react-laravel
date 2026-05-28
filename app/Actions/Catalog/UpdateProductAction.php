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
    public function execute(Product $product, array $data, ?UploadedFile $uploadedFile = null): Product
    {
        $product->update($data);

        if ($uploadedFile instanceof UploadedFile) {
            $product->clearMediaCollection('image');
            $product->addMedia($uploadedFile)->toMediaCollection('image');
        }

        return $product;
    }
}
