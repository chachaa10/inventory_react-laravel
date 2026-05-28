<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Actions\Inventory\RecordMovementAction;
use App\Http\Requests\StoreStockMovementRequest;
use App\Models\Product;
use App\Models\StockMovement;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class StockMovementController extends Controller
{
    public function index(): Response
    {
        $builder = StockMovement::query();

        $builder->getQuery()->select('stock_movements.*');
        $builder->getQuery()->addSelect('products.name as product_name');
        $builder->getQuery()->leftJoin('products', 'stock_movements.product_id', '=', 'products.id');

        $lengthAwarePaginator = $builder
            ->with('user:id,name')
            ->latest('stock_movements.created_at')
            ->paginate(50);

        $productBuilder = Product::query()->where('is_active', true);

        $productBuilder->getQuery()->orderBy('name');

        $products = $productBuilder->get(['id', 'name', 'stock_qty', 'reorder_level']);

        return Inertia::render('stock-movements/Index', [
            'movements' => $lengthAwarePaginator,
            'products' => $products,
        ]);
    }

    public function store(StoreStockMovementRequest $storeStockMovementRequest, RecordMovementAction $recordMovementAction): RedirectResponse
    {
        $this->authorize('create', StockMovement::class);

        $user = $storeStockMovementRequest->user();

        abort_if($user === null, 401);

        /** @var array{product_id: int, type: string, qty: int, reference?: string|null, notes?: string|null} $validated */
        $validated = $storeStockMovementRequest->safe()->all();

        $recordMovementAction->execute(
            $validated,
            $user,
        );

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Stock movement recorded successfully.']);

        return to_route('stock-movements.index');
    }
}
