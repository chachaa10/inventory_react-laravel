<?php

declare(strict_types=1);

namespace App\Http\Requests\Staff;

use App\Enums\Role;
use App\Models\User;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Validator;

class UpdateStaffRequest extends FormRequest
{
    /** @return array<string, mixed> */
    public function rules(): array
    {
        $isSuperadmin = $this->user()?->role === Role::Superadmin;

        return $isSuperadmin
            ? $this->superadminRules()
            : $this->adminRules();
    }

    protected function prepareForValidation(): void
    {
        if ($this->has('is_active')) {
            $this->merge([
                'is_active' => filter_var($this->input('is_active'), FILTER_VALIDATE_BOOLEAN, FILTER_NULL_ON_FAILURE),
            ]);
        }
    }

    public function withValidator(Validator $validator): void
    {
        $validator->after(function (Validator $validator): void {
            $user = $this->user();
            $target = $this->route('user');

            if ($user !== null && $target instanceof User && $user->id === $target->id && $this->has('role')) {
                $validator->errors()->add('role', 'You cannot change your own role.');
            }
        });
    }

    /** @return array<string, mixed> */
    private function superadminRules(): array
    {
        return [
            'name' => ['sometimes', 'required', 'string', 'max:255'],
            'email' => ['sometimes', 'required', 'email', 'max:255', Rule::unique('users')->ignore($this->route('user'))],
            'role' => ['sometimes', 'required', 'string', Rule::in(['admin', 'staff'])],
            'is_active' => ['nullable', 'boolean'],
        ];
    }

    /** @return array<string, mixed> */
    private function adminRules(): array
    {
        return [
            'name' => ['prohibited'],
            'email' => ['prohibited'],
            'role' => ['prohibited'],
            'is_active' => ['nullable', 'boolean'],
        ];
    }
}
