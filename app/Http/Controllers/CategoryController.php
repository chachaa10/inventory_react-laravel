<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Actions\Catalog\CreateCategoryAction;
use App\Actions\Catalog\DeleteCategoryAction;
use App\Actions\Catalog\UpdateCategoryAction;
use App\Exceptions\CannotDeleteCategoryWithProductsException;
use App\Http\Requests\Category\StoreCategoryRequest;
use App\Http\Requests\Category\UpdateCategoryRequest;
use App\Models\Category;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class CategoryController extends Controller
{
    public function index(): Response
    {
        $lengthAwarePaginator = Category::query()
            ->withCount('products')
            ->latest()
            ->paginate(100);

        return Inertia::render('categories/Index', [
            'categories' => $lengthAwarePaginator,
        ]);
    }

    public function store(StoreCategoryRequest $storeCategoryRequest, CreateCategoryAction $createCategoryAction): RedirectResponse
    {
        $this->authorize('create', Category::class);

        $createCategoryAction->execute(
            $storeCategoryRequest->string('name')->toString(),
            $storeCategoryRequest->string('description')->toString(),
        );

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Category created successfully.']);

        return to_route('categories.index');
    }

    public function update(UpdateCategoryRequest $updateCategoryRequest, UpdateCategoryAction $updateCategoryAction, Category $category): RedirectResponse
    {
        $this->authorize('update', $category);

        $updateCategoryAction->execute(
            $category,
            $updateCategoryRequest->string('name')->toString(),
            $updateCategoryRequest->string('description')->toString(),
        );

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Category updated successfully.']);

        return to_route('categories.index');
    }

    public function destroy(DeleteCategoryAction $deleteCategoryAction, Category $category): RedirectResponse
    {
        $this->authorize('delete', $category);

        throw_if(
            $category->loadCount('products')->products_count > 0,
            CannotDeleteCategoryWithProductsException::class,
        );

        $deleteCategoryAction->execute($category);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Category deleted successfully.']);

        return to_route('categories.index');
    }
}
