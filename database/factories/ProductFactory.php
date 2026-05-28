<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Product>
 */
class ProductFactory extends Factory
{
    public function definition(): array
    {
        return [
            'name' => fake()->unique()->words(2, true),
            'sku' => strtoupper(fake()->unique()->bothify('SKU-???-####')),
            'description' => fake()->sentence(),
            'price' => fake()->randomFloat(2, 10, 999),
            'cost' => fake()->randomFloat(2, 5, 500),
            'unit' => 'pcs',
            'stock_qty' => fake()->numberBetween(0, 100),
            'reorder_level' => fake()->numberBetween(3, 15),
            'is_active' => true,
            'category_id' => Category::factory(),
        ];
    }
}
