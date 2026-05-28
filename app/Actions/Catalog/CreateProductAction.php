<?php

declare(strict_types=1);

namespace App\Actions\Catalog;

use App\Models\Product;
use Illuminate\Http\UploadedFile;

class CreateProductAction
{
    /**
     * @param  array<string, mixed>  $data
     */
    public function execute(array $data, ?UploadedFile $uploadedFile = null): Product
    {
        $product = Product::query()->create($data);

        if ($uploadedFile instanceof UploadedFile) {
            $product->addMedia($uploadedFile)->toMediaCollection('image');
        }

        return $product;
    }
}
