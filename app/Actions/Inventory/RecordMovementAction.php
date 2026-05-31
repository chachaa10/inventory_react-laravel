<?php

declare(strict_types=1);

namespace App\Actions\Inventory;

use App\Enums\StockMovementType;
use App\Events\LowStockDetected;
use App\Events\StockMoved;
use App\Models\Product;
use App\Models\StockMovement;
use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;
use RuntimeException;

class RecordMovementAction
{
    /**
     * @param  array{product_id: int, type: string, qty: int, reference?: string|null, notes?: string|null}  $data
     */
    public function execute(array $data, User $user, ?Model $model = null): StockMovement
    {
        $product = Product::query()->where('id', $data['product_id'])->firstOrFail();

        $stockMovementType = StockMovementType::from($data['type']);

        $qty = $data['qty'];

        return DB::transaction(function () use ($product, $stockMovementType, $qty, $data, $user, $model): StockMovement {
            $beforeQty = Product::query()
                ->where('id', $product->id)
                ->getQuery()
                ->lockForUpdate()
                ->value('stock_qty');

            throw_unless(is_int($beforeQty), RuntimeException::class, 'Invalid stock quantity.');

            throw_if($stockMovementType === StockMovementType::Out && $qty > $beforeQty, RuntimeException::class, 'Insufficient stock.');

            $afterQty = match ($stockMovementType) {
                StockMovementType::In => $beforeQty + $qty,
                StockMovementType::Out => $beforeQty - $qty,
                StockMovementType::Adjustment => $beforeQty + $qty,
            };

            $stockMovement = StockMovement::query()->create([
                'product_id' => $product->id,
                'type' => $stockMovementType->value,
                'qty' => $qty,
                'before_qty' => $beforeQty,
                'after_qty' => $afterQty,
                'reference' => $data['reference'] ?? null,
                'notes' => $data['notes'] ?? null,
                'user_id' => $user->id,
                'movementable_id' => $model?->getKey(),
                'movementable_type' => $model?->getMorphClass(),
            ]);

            $product->update(['stock_qty' => $afterQty]);

            event(new StockMoved($stockMovement));

            if ($beforeQty > $product->reorder_level && $afterQty <= $product->reorder_level) {
                event(new LowStockDetected($product));
            }

            return $stockMovement;
        });
    }
}
