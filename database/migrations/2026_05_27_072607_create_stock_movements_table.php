<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('stock_movements', function (Blueprint $blueprint): void {
            $blueprint->id();
            $blueprint->foreignId('product_id')->constrained()->restrictOnDelete();
            $blueprint->string('type'); // in, out, adjustment
            $blueprint->integer('qty');
            $blueprint->integer('before_qty');
            $blueprint->integer('after_qty');
            $blueprint->string('reference')->nullable();
            $blueprint->text('notes')->nullable();
            $blueprint->foreignId('user_id')->constrained()->restrictOnDelete();
            $blueprint->nullableMorphs('movementable');
            $blueprint->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('stock_movements');
    }
};
