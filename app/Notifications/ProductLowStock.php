<?php

declare(strict_types=1);

namespace App\Notifications;

use App\Models\Product;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class ProductLowStock extends Notification
{
    use Queueable;

    public function __construct(
        public Product $product,
    ) {}

    /** @return array<int, string> */
    public function via(object $notifiable): array
    {
        return ['database'];
    }

    /** @return array<string, mixed> */
    public function toArray(object $notifiable): array
    {
        return [
            'product_id' => $this->product->id,
            'product_name' => $this->product->name,
            'stock_qty' => $this->product->stock_qty,
            'reorder_level' => $this->product->reorder_level,
            'message' => sprintf('%s is low on stock (%s remaining).', $this->product->name, $this->product->stock_qty),
        ];
    }
}
