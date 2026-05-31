<?php

declare(strict_types=1);

namespace App\Providers;

use App\Events\LowStockDetected;
use App\Listeners\HandleLowStock;
use Illuminate\Foundation\Support\Providers\EventServiceProvider as ServiceProvider;

class EventServiceProvider extends ServiceProvider
{
    /** @var array<string, array<int, string>> */
    protected $listen = [
        LowStockDetected::class => [
            HandleLowStock::class,
        ],
    ];

    public function shouldDiscoverEvents(): bool
    {
        return false;
    }
}
