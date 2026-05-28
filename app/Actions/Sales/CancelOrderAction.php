<?php

declare(strict_types=1);

namespace App\Actions\Sales;

use App\Actions\Inventory\RecordMovementAction;
use App\Enums\OrderStatus;
use App\Enums\StockMovementType;
use App\Exceptions\CannotCancelOrderException;
use App\Models\Order;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class CancelOrderAction
{
    public function __construct(
        private readonly RecordMovementAction $recordMovementAction,
    ) {}

    public function execute(Order $order, User $user): void
    {
        $this->assertCanBeCancelled($order);

        $this->cancelWithinTransaction($order, $user);
    }

    private function assertCanBeCancelled(Order $order): void
    {
        throw_if($order->status !== OrderStatus::Completed, CannotCancelOrderException::class, 'Only completed orders can be cancelled.');
    }

    private function cancelWithinTransaction(Order $order, User $user): void
    {
        DB::transaction(function () use ($order, $user): void {
            $order->load('items');

            foreach ($order->items as $item) {
                $this->recordMovement(
                    productId: $item->product_id,
                    qty: $item->qty,
                    reference: $order->order_number,
                    user: $user,
                    order: $order,
                );
            }

            $order->update(['status' => OrderStatus::Cancelled]);
        });
    }

    private function recordMovement(int $productId, int $qty, string $reference, User $user, Order $order): void
    {
        $this->recordMovementAction->execute(
            data: [
                'product_id' => $productId,
                'type' => StockMovementType::In->value,
                'qty' => $qty,
                'reference' => $reference,
                'notes' => 'Cancelled order '.$reference,
            ],
            user: $user,
            model: $order,
        );
    }
}
