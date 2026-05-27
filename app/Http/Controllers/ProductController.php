<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Actions\Catalog\CreateProductAction;
use App\Actions\Catalog\DeleteProductAction;
use App\Actions\Catalog\UpdateProductAction;
use App\Http\Requests\StoreProductRequest;
use App\Http\Requests\UpdateProductRequest;
use App\Models\Category;
use App\Models\Product;
use App\Models\Supplier;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ProductController extends Controller
{
    public function index(Request $request): Response
    {
        $query = Product::query()
            ->with('category:id,name', 'supplier:id,name');

        $search = $request->string('search')->toString();

        if ($search !== '') {
            $query->where(function ($q) use ($search): void {
                $q->where('name', 'like', sprintf('%%%s%%', $search))
                    ->orWhere('sku', 'like', sprintf('%%%s%%', $search));
            });
        }

        $categoryId = $request->integer('category_id');

        if ($categoryId !== 0) {
            $query->where('category_id', $categoryId);
        }

        $stockStatus = $request->string('stock_status')->toString();

        if ($stockStatus !== '') {
            if ($stockStatus === 'low') {
                $query->getQuery()->whereRaw('stock_qty <= reorder_level');
                $query->where('stock_qty', '>', 0);
            } elseif ($stockStatus === 'out') {
                $query->where('stock_qty', '=', 0);
            } elseif ($stockStatus === 'in') {
                $query->getQuery()->whereRaw('stock_qty > reorder_level');
            }
        }

        $products = $query->latest()->paginate(10);

        $categories = Category::all(['id', 'name'])->sortBy('name')->values();
        $suppliers = Supplier::all(['id', 'name'])->sortBy('name')->values();

        return Inertia::render('products/Index', [
            'products' => $products,
            'categories' => $categories,
            'suppliers' => $suppliers,
            'filters' => $request->only(['search', 'category_id', 'stock_status']),
        ]);
    }

    public function store(StoreProductRequest $request, CreateProductAction $action): RedirectResponse
    {
        $this->authorize('create', Product::class);

        /** @var array<string, mixed> $data */
        $data = $request->safe()->except('image');

        $action->execute(
            $data,
            $request->file('image'),
        );

        return to_route('products.index');
    }

    public function update(UpdateProductRequest $request, UpdateProductAction $action, Product $product): RedirectResponse
    {
        $this->authorize('update', $product);

        /** @var array<string, mixed> $data */
        $data = $request->safe()->except('image');

        $action->execute(
            $product,
            $data,
            $request->file('image'),
        );

        return to_route('products.index');
    }

    public function destroy(DeleteProductAction $action, Product $product): RedirectResponse
    {
        $this->authorize('delete', $product);

        if ($product->loadCount('stockMovements')->stock_movements_count > 0) {
            return to_route('products.index');
        }

        $action->execute($product);

        return to_route('products.index');
    }
}
