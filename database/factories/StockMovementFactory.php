<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Enums\StockMovementType;
use App\Models\Product;
use App\Models\StockMovement;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<StockMovement>
 */
class StockMovementFactory extends Factory
{
    public function definition(): array
    {
        $beforeQty = fake()->numberBetween(0, 100);

        return [
            'product_id' => Product::factory(),
            'type' => fake()->randomElement(array_map(static fn (StockMovementType $stockMovementType): string => $stockMovementType->value, StockMovementType::cases())),
            'qty' => fake()->numberBetween(1, 50),
            'before_qty' => $beforeQty,
            'after_qty' => $beforeQty + fake()->numberBetween(-10, 10),
            'reference' => fake()->optional()->bothify('REF-####'),
            'notes' => fake()->optional()->sentence(),
            'user_id' => User::factory(),
        ];
    }
}
