<?php

declare(strict_types=1);

namespace App\Actions\Catalog;

use App\Models\Category;
use Illuminate\Support\Str;

class UpdateCategoryAction
{
    public function execute(Category $category, string $name, ?string $description = null): Category
    {
        $category->update([
            'name' => $name,
            'slug' => Str::slug($name),
            'description' => $description,
        ]);

        return $category;
    }
}
