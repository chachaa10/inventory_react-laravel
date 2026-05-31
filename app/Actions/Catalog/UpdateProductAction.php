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
    public function execute(
        Product $product,
        array $data,
        ?UploadedFile $uploadedFile = null,
        ?GenerateSkuAction $generateSkuAction = null,
    ): Product {
        $generateSkuAction ??= new GenerateSkuAction;

        $categoryChanged = isset($data['category_id']) && $data['category_id'] !== $product->category_id;
        $nameChanged = isset($data['name']) && $data['name'] !== $product->name;

        if ($categoryChanged || $nameChanged) {
            $rawCategoryId = $data['category_id'] ?? $product->category_id;
            $rawName = $data['name'] ?? $product->name;
            $newCategoryId = is_scalar($rawCategoryId) ? (int) $rawCategoryId : $product->category_id;
            $newName = is_scalar($rawName) ? (string) $rawName : $product->name;

            $data['sku'] = $generateSkuAction->execute(
                categoryId: $newCategoryId,
                productName: $newName,
                ignoreProductId: $product->id,
            );
        }

        $product->update($data);

        if ($uploadedFile instanceof UploadedFile) {
            $product->clearMediaCollection('image');
            $product->addMedia($uploadedFile)->toMediaCollection('image');
        }

        return $product;
    }
}
