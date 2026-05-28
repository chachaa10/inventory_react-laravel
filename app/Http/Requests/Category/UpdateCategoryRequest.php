<?php

declare(strict_types=1);

namespace App\Http\Requests\Category;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateCategoryRequest extends FormRequest
{
    /** @return array<string, mixed> */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255', Rule::unique('categories')->ignore($this->route('category'))],
            'description' => ['nullable', 'string', 'max:1000'],
        ];
    }
}
