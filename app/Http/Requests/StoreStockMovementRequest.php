<?php

declare(strict_types=1);

namespace App\Http\Requests;

use App\Enums\StockMovementType;
use App\Models\Product;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Enum;
use Illuminate\Validation\Validator;

class StoreStockMovementRequest extends FormRequest
{
    /** @return array<string, mixed> */
    public function rules(): array
    {
        return [
            'product_id' => ['required', 'integer', Rule::exists('products', 'id')],
            'type' => ['required', new Enum(StockMovementType::class)],
            'qty' => ['required', 'integer', 'min:1'],
            'reference' => ['nullable', 'string', 'max:255'],
            'notes' => ['nullable', 'string', 'max:1000'],
        ];
    }

    public function withValidator(Validator $validator): void
    {
        $validator->after(function (Validator $validator): void {
            $data = $validator->validated();

            if (! isset($data['type']) || ! isset($data['product_id']) || ! isset($data['qty'])) {
                return;
            }

            if ($data['type'] !== StockMovementType::Out->value) {
                return;
            }

            $product = Product::query()->where('id', $data['product_id'])->first();

            if ($product !== null && $data['qty'] > $product->stock_qty) {
                $validator->errors()->add('qty', sprintf('Insufficient stock. Only %s available.', $product->stock_qty));
            }
        });
    }
}
