<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Actions\Catalog\CreateProductAction;
use App\Actions\Catalog\DeleteProductAction;
use App\Actions\Catalog\UpdateProductAction;
use App\Exceptions\CannotDeleteProductWithStockMovementsException;
use App\Http\Requests\Product\StoreProductRequest;
use App\Http\Requests\Product\UpdateProductRequest;
use App\Models\Category;
use App\Models\Product;
use App\Models\Supplier;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ProductController extends Controller
{
    public function index(Request $request): Response
    {
        $builder = Product::query()
            ->with('category:id,name', 'supplier:id,name');

        $search = $request->string('search')->toString();

        if ($search !== '') {
            $builder->where(function (Builder $builder) use ($search): void {
                $builder->where('name', 'like', sprintf('%%%s%%', $search))
                    ->orWhere('sku', 'like', sprintf('%%%s%%', $search));
            });
        }

        $categoryId = $request->integer('category_id');

        if ($categoryId !== 0) {
            $builder->where('category_id', $categoryId);
        }

        $stockStatus = $request->string('stock_status')->toString();

        if ($stockStatus !== '') {
            if ($stockStatus === 'low') {
                $builder->getQuery()->whereRaw('stock_qty <= reorder_level');
                $builder->where('stock_qty', '>', 0);
            } elseif ($stockStatus === 'out') {
                $builder->where('stock_qty', '=', 0);
            } elseif ($stockStatus === 'in') {
                $builder->getQuery()->whereRaw('stock_qty > reorder_level');
            }
        }

        $lengthAwarePaginator = $builder->latest()->paginate(10);

        $categories = Category::all(['id', 'name'])->sortBy('name')->values();
        $supplierBuilder = Supplier::query()->where('is_active', true);
        $supplierBuilder->getQuery()->whereNull('archived_at');
        $suppliers = $supplierBuilder->get(['id', 'name'])->sortBy('name')->values();

        return Inertia::render('products/Index', [
            'products' => $lengthAwarePaginator,
            'categories' => $categories,
            'suppliers' => $suppliers,
            'filters' => $request->only(['search', 'category_id', 'stock_status']),
        ]);
    }

    public function store(StoreProductRequest $storeProductRequest, CreateProductAction $createProductAction): RedirectResponse
    {
        $this->authorize('create', Product::class);

        /** @var array<string, mixed> $data */
        $data = $storeProductRequest->safe()->except('image');

        $createProductAction->execute(
            $data,
            $storeProductRequest->file('image'),
        );

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Product created successfully.']);

        return to_route('products.index');
    }

    public function update(UpdateProductRequest $updateProductRequest, UpdateProductAction $updateProductAction, Product $product): RedirectResponse
    {
        $this->authorize('update', $product);

        /** @var array<string, mixed> $data */
        $data = $updateProductRequest->safe()->except('image');

        $updateProductAction->execute(
            $product,
            $data,
            $updateProductRequest->file('image'),
        );

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Product updated successfully.']);

        return to_route('products.index');
    }

    public function destroy(DeleteProductAction $deleteProductAction, Product $product): RedirectResponse
    {
        $this->authorize('delete', $product);

        throw_if(
            $product->loadCount('stockMovements')->stock_movements_count > 0,
            CannotDeleteProductWithStockMovementsException::class,
        );

        $deleteProductAction->execute($product);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Product deleted successfully.']);

        return to_route('products.index');
    }
}
