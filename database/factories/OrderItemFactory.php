<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Models\OrderItem;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<OrderItem>
 */
class OrderItemFactory extends Factory
{
    public function definition(): array
    {
        $qty = fake()->numberBetween(1, 10);
        $unitPrice = fake()->randomFloat(2, 10, 500);

        return [
            'qty' => $qty,
            'unit_price' => $unitPrice,
            'subtotal' => $qty * $unitPrice,
        ];
    }
}
