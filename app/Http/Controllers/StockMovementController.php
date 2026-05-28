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
        $lengthAwarePaginator = StockMovement::query()
            ->with('product:id,name', 'user:id,name')
            ->latest()
            ->paginate(50);

        return Inertia::render('stock-movements/Index', [
            'movements' => $lengthAwarePaginator,
        ]);
    }

    public function create(): Response
    {
        $builder = Product::query()->where('is_active', true);

        $builder->getQuery()->orderBy('name');

        $products = $builder->get(['id', 'name', 'stock_qty', 'reorder_level']);

        return Inertia::render('stock-movements/Create', [
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
