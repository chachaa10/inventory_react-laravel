<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Actions\Catalog\CreateCategoryAction;
use App\Actions\Catalog\DeleteCategoryAction;
use App\Actions\Catalog\UpdateCategoryAction;
use App\Http\Requests\StoreCategoryRequest;
use App\Http\Requests\UpdateCategoryRequest;
use App\Models\Category;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class CategoryController extends Controller
{
    public function index(): Response
    {
        $categories = Category::query()
            ->withCount('products')
            ->latest()
            ->paginate(10);

        return Inertia::render('categories/Index', [
            'categories' => $categories,
        ]);
    }

    public function store(StoreCategoryRequest $request, CreateCategoryAction $action): RedirectResponse
    {
        $this->authorize('create', Category::class);

        $action->execute(
            $request->string('name')->toString(),
            $request->string('description')->toString(),
        );

        return to_route('categories.index');
    }

    public function update(UpdateCategoryRequest $request, UpdateCategoryAction $action, Category $category): RedirectResponse
    {
        $this->authorize('update', $category);

        $action->execute(
            $category,
            $request->string('name')->toString(),
            $request->string('description')->toString(),
        );

        return to_route('categories.index');
    }

    public function destroy(DeleteCategoryAction $action, Category $category): RedirectResponse
    {
        $this->authorize('delete', $category);

        // @phpstan-ignore-next-line staticMethod.dynamicCall
        if ($category->products()->count() > 0) {
            return to_route('categories.index');
        }

        $action->execute($category);

        return to_route('categories.index');
    }
}
