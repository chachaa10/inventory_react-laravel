<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('products', function (Blueprint $blueprint): void {
            $blueprint->id();
            $blueprint->string('name');
            $blueprint->string('sku')->unique();
            $blueprint->text('description')->nullable();
            $blueprint->decimal('price', 10, 2);
            $blueprint->decimal('cost', 10, 2)->nullable();
            $blueprint->string('unit')->default('pcs');
            $blueprint->integer('stock_qty')->default(0);
            $blueprint->integer('reorder_level')->default(5);
            $blueprint->boolean('is_active')->default(true);
            $blueprint->foreignId('category_id')->constrained()->nullOnDelete();
            $blueprint->foreignId('supplier_id')->nullable()->constrained()->nullOnDelete();
            $blueprint->timestamps();
            $blueprint->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
