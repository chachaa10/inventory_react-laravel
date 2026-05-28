<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $blueprint): void {
            $blueprint->id();
            $blueprint->string('customer_name');
            $blueprint->string('customer_email')->nullable();
            $blueprint->string('order_number')->unique();
            $blueprint->string('status');
            $blueprint->decimal('total', 12, 2);
            $blueprint->text('notes')->nullable();
            $blueprint->foreignId('user_id')->constrained()->restrictOnDelete();
            $blueprint->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
