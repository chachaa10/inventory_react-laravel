<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('order_items', function (Blueprint $blueprint): void {
            $blueprint->id();
            $blueprint->foreignId('order_id')->constrained()->cascadeOnDelete();
            $blueprint->foreignId('product_id')->constrained()->restrictOnDelete();
            $blueprint->integer('qty');
            $blueprint->decimal('unit_price', 10, 2);
            $blueprint->decimal('subtotal', 12, 2);
            $blueprint->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('order_items');
    }
};
