<?php

declare(strict_types=1);

namespace App\Actions\Catalog;

use App\Models\Category;
use Illuminate\Support\Str;

class CreateCategoryAction
{
    public function execute(string $name, ?string $description = null): Category
    {
        return Category::query()->create([
            'name' => $name,
            'slug' => Str::slug($name),
            'description' => $description,
        ]);
    }
}
