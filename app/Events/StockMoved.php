<?php

declare(strict_types=1);

namespace App\Events;

use App\Models\StockMovement;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class StockMoved
{
    use Dispatchable;
    use SerializesModels;

    public function __construct(
        public StockMovement $movement,
    ) {}
}
