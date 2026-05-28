<?php

declare(strict_types=1);

namespace App\Http\Requests\Order;

use Illuminate\Foundation\Http\FormRequest;

class UpdateOrderRequest extends FormRequest
{
    /** @return array<string, mixed> */
    public function rules(): array
    {
        return [];
    }
}
