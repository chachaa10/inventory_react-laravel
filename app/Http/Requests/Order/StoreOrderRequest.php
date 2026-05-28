<?php

declare(strict_types=1);

namespace App\Http\Requests\Order;

use App\Models\Product;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Validator;

class StoreOrderRequest extends FormRequest
{
    /** @return array<string, mixed> */
    public function rules(): array
    {
        return [
            'customer_name' => ['required', 'string', 'max:255'],
            'customer_email' => ['nullable', 'email', 'max:255'],
            'notes' => ['nullable', 'string', 'max:2000'],
            'items' => ['required', 'json'],
        ];
    }

    /** @return list<callable> */
    public function after(): array
    {
        return [
            function (Validator $validator): void {
                /** @var list<array{product_id: int, qty: int}> $decoded */
                $decoded = json_decode($this->string('items')->toString(), true);

                if (! is_array($decoded) || $decoded === []) {
                    $validator->errors()->add('items', 'At least one item is required.');

                    return;
                }

                foreach ($decoded as $index => $item) {
                    if (! isset($item['product_id']) || ! is_int($item['product_id'])) {
                        $validator->errors()->add(sprintf('items.%d.product_id', $index), 'Invalid product.');

                        continue;
                    }

                    $existsQuery = Product::query()->where('id', $item['product_id']);
                    $exists = $existsQuery->getQuery()->exists();

                    if (! $exists) {
                        $validator->errors()->add(sprintf('items.%d.product_id', $index), 'Product does not exist.');
                    }

                    if (! isset($item['qty']) || ! is_int($item['qty']) || $item['qty'] < 1) {
                        $validator->errors()->add(sprintf('items.%d.qty', $index), 'Quantity must be at least 1.');
                    }
                }
            },
        ];
    }
}
