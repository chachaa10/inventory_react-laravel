<?php

declare(strict_types=1);

namespace App\Listeners;

use App\Events\LowStockDetected;
use App\Models\User;
use App\Notifications\ProductLowStock;
use Illuminate\Support\Facades\Notification;

class HandleLowStock
{
    public function handle(LowStockDetected $lowStockDetected): void
    {
        $admins = User::query()
            ->where('role', 'admin')
            ->get();

        Notification::send($admins, new ProductLowStock($lowStockDetected->product));
    }
}
