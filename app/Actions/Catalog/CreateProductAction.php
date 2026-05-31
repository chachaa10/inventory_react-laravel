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
    public function execute(
        array $data,
        ?UploadedFile $uploadedFile = null,
        ?GenerateSkuAction $generateSkuAction = null,
    ): Product {
        $generateSkuAction ??= new GenerateSkuAction;

        $rawId = $data['category_id'] ?? 0;
        $rawName = $data['name'] ?? '';
        $categoryId = is_scalar($rawId) ? (int) $rawId : 0;
        $name = is_scalar($rawName) ? (string) $rawName : '';

        $data['sku'] = $generateSkuAction->execute(
            categoryId: $categoryId,
            productName: $name,
        );

        $product = Product::query()->create($data);

        if ($uploadedFile instanceof UploadedFile) {
            $product->addMedia($uploadedFile)->toMediaCollection('image');
        }

        return $product;
    }
}
