<?php

declare(strict_types=1);

namespace App\Actions\Sales;

use App\Actions\Inventory\RecordMovementAction;
use App\Enums\OrderStatus;
use App\Enums\StockMovementType;
use App\Exceptions\InsufficientStockException;
use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\DB;

class CreateOrderAction
{
    public function __construct(
        private readonly RecordMovementAction $recordMovementAction,
    ) {}

    /**
     * @param  list<array{product_id: int, qty: int}>  $items
     */
    public function execute(string $customerName, ?string $customerEmail, ?string $notes, array $items, User $user): Order
    {
        return DB::transaction(function () use ($customerName, $customerEmail, $notes, $items, $user): Order {
            $productIds = array_map(fn (array $item): int => $item['product_id'], $items);

            $builder = Product::query();
            $builder->getQuery()->whereIn('id', $productIds);
            $builder->getQuery()->lockForUpdate();

            /** @var Collection<int, Product> $productCollection */
            $productCollection = $builder->get();

            /** @var Collection<int, Product> $products */
            $products = $productCollection->keyBy('id');

            $grouped = [];
            foreach ($items as $item) {
                $productId = $item['product_id'];
                $grouped[$productId] = ($grouped[$productId] ?? 0) + $item['qty'];
            }

            foreach ($grouped as $productId => $totalQty) {
                $product = $this->getProductOrFail($products->get($productId), $productId);

                $this->requireSufficientStock($product, $totalQty);
            }

            $total = 0;
            $orderItems = [];

            foreach ($items as $item) {
                $product = $this->getProductOrFail($products->get($item['product_id']), $item['product_id']);

                $unitPrice = $product->price;
                $subtotal = $item['qty'] * $unitPrice;
                $total += $subtotal;

                $orderItems[] = [
                    'product_id' => $item['product_id'],
                    'qty' => $item['qty'],
                    'unit_price' => $unitPrice,
                    'subtotal' => $subtotal,
                ];
            }

            $today = now()->format('Ymd');

            $todayQuery = Order::query()->where('order_number', 'like', sprintf('ORD-%s-%%', $today));
            $todayCount = $todayQuery->getQuery()->count();

            $orderNumber = 'ORD-'.$today.'-'.str_pad((string) ($todayCount + 1), 4, '0', STR_PAD_LEFT);

            $order = Order::query()->create([
                'customer_name' => $customerName,
                'customer_email' => $customerEmail,
                'order_number' => $orderNumber,
                'status' => OrderStatus::Completed,
                'total' => $total,
                'notes' => $notes,
                'user_id' => $user->id,
            ]);

            foreach ($orderItems as $orderItem) {
                $order->items()->create($orderItem);
            }

            foreach ($items as $item) {
                $this->recordMovement(
                    productId: $item['product_id'],
                    qty: $item['qty'],
                    orderNumber: $orderNumber,
                    user: $user,
                    order: $order,
                );
            }

            return $order->load('items.product:id,name');
        });
    }

    private function getProductOrFail(?Product $product, int $productId): Product
    {
        throw_unless($product instanceof Product, InsufficientStockException::class, sprintf('Product %d not found.', $productId));

        return $product;
    }

    private function requireSufficientStock(Product $product, int $totalQty): void
    {
        throw_if($totalQty > $product->stock_qty, InsufficientStockException::class, sprintf('Insufficient stock for %s. Required: %d, Available: %s.', $product->name, $totalQty, $product->stock_qty));
    }

    private function recordMovement(int $productId, int $qty, string $orderNumber, User $user, Order $order): void
    {
        $this->recordMovementAction->execute(
            data: [
                'product_id' => $productId,
                'type' => StockMovementType::Out->value,
                'qty' => $qty,
                'reference' => $orderNumber,
                'notes' => 'Order '.$orderNumber,
            ],
            user: $user,
            model: $order,
        );
    }
}
