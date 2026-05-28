<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Actions\Sales\CancelOrderAction;
use App\Actions\Sales\CreateOrderAction;
use App\Http\Requests\StoreOrderRequest;
use App\Http\Requests\UpdateOrderRequest;
use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class OrderController extends Controller
{
    public function index(Request $request): Response
    {
        $builder = Order::query()
            ->with('user:id,name')
            ->withCount('items');

        $stringable = $request->string('search');

        if ($stringable->isNotEmpty()) {
            $builder->where(function (Builder $builder) use ($stringable): void {
                $searchValue = sprintf('%%%s%%', $stringable->toString());

                $builder->where('order_number', 'like', $searchValue)
                    ->orWhere('customer_name', 'like', $searchValue);
            });
        }

        $status = $request->string('status');

        if ($status->isNotEmpty()) {
            $builder->where('status', $status->toString());
        }

        $lengthAwarePaginator = $builder->latest()->paginate(10);

        return Inertia::render('orders/Index', [
            'orders' => $lengthAwarePaginator,
            'filters' => $request->only(['search', 'status']),
        ]);
    }

    public function create(): Response
    {
        $builder = Product::query()->where('is_active', true);
        $builder->getQuery()->orderBy('name');

        $products = $builder->get(['id', 'name', 'price', 'stock_qty', 'reorder_level']);

        return Inertia::render('orders/Create', [
            'products' => $products,
        ]);
    }

    public function store(StoreOrderRequest $storeOrderRequest, CreateOrderAction $createOrderAction): RedirectResponse
    {
        $this->authorize('create', Order::class);

        /** @var User $user */
        $user = $storeOrderRequest->user();

        /** @var list<array{product_id: int, qty: int}> $items */
        $items = json_decode($storeOrderRequest->string('items')->toString(), true);

        $customerEmail = $storeOrderRequest->string('customer_email')->toString();
        $notes = $storeOrderRequest->string('notes')->toString();

        $createOrderAction->execute(
            customerName: $storeOrderRequest->string('customer_name')->toString(),
            customerEmail: $customerEmail !== '' ? $customerEmail : null,
            notes: $notes !== '' ? $notes : null,
            items: $items,
            user: $user,
        );

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Order created successfully.']);

        return to_route('orders.index');
    }

    public function edit(Order $order): Response
    {
        $order->load('items.product:id,name', 'user:id,name');

        return Inertia::render('orders/Edit', [
            'order' => $order,
        ]);
    }

    public function update(UpdateOrderRequest $updateOrderRequest, CancelOrderAction $cancelOrderAction, Order $order): RedirectResponse
    {
        $this->authorize('cancel', $order);

        /** @var User $user */
        $user = $updateOrderRequest->user();

        $cancelOrderAction->execute($order, $user);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Order cancelled successfully.']);

        return to_route('orders.edit', $order);
    }
}
