<?php

declare(strict_types=1);

namespace App\Http\Requests\Product;

use App\Models\Product;
use Illuminate\Database\Query\Builder;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateProductRequest extends FormRequest
{
    /** @return array<string, mixed> */
    public function rules(): array
    {
        $currentSupplierId = $this->currentProductSupplierId();

        return [
            'name' => ['required', 'string', 'max:255'],
            'sku' => ['required', 'string', 'max:50', Rule::unique('products')->ignore($this->route('product'))],
            'description' => ['nullable', 'string', 'max:5000'],
            'price' => ['required', 'numeric', 'min:0'],
            'cost' => ['nullable', 'numeric', 'min:0'],
            'unit' => ['required', 'string', 'max:20'],
            'reorder_level' => ['required', 'integer', 'min:0'],
            'is_active' => ['boolean'],
            'category_id' => ['required', 'integer', 'exists:categories,id'],
            'supplier_id' => [
                'nullable',
                'integer',
                Rule::exists('suppliers', 'id')->where(function (Builder $builder) use ($currentSupplierId): void {
                    $builder->where(function (Builder $builder) use ($currentSupplierId): void {
                        $builder->where('is_active', true)->whereNull('archived_at');

                        if ($currentSupplierId !== null) {
                            $builder->orWhere('id', $currentSupplierId);
                        }
                    });
                }),
            ],
            'image' => ['nullable', 'image', 'mimes:jpeg,png,jpg,webp', 'max:2048'],
        ];
    }

    private function currentProductSupplierId(): ?int
    {
        $product = $this->route('product');

        if (! $product instanceof Product) {
            return null;
        }

        return $product->supplier_id;
    }
}
