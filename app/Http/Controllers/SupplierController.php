<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Actions\Parties\CreateSupplierAction;
use App\Actions\Parties\DeactivateSupplierAction;
use App\Actions\Parties\UpdateSupplierAction;
use App\Http\Requests\StoreSupplierRequest;
use App\Http\Requests\UpdateSupplierRequest;
use App\Models\Supplier;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class SupplierController extends Controller
{
    public function index(): Response
    {
        $builder = Supplier::query()->withCount('products');
        $builder->getQuery()->orderBy('name');
        $lengthAwarePaginator = $builder->paginate(100);

        return Inertia::render('suppliers/Index', [
            'suppliers' => $lengthAwarePaginator,
        ]);
    }

    public function store(StoreSupplierRequest $storeSupplierRequest, CreateSupplierAction $createSupplierAction): RedirectResponse
    {
        $this->authorize('create', Supplier::class);

        $createSupplierAction->execute($storeSupplierRequest->validated());

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Supplier created successfully.']);

        return to_route('suppliers.index');
    }

    public function update(UpdateSupplierRequest $updateSupplierRequest, UpdateSupplierAction $updateSupplierAction, Supplier $supplier): RedirectResponse
    {
        $this->authorize('update', $supplier);

        $updateSupplierAction->execute($supplier, $updateSupplierRequest->validated());

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Supplier updated successfully.']);

        return to_route('suppliers.index');
    }

    public function destroy(DeactivateSupplierAction $deactivateSupplierAction, Supplier $supplier): RedirectResponse
    {
        $this->authorize('delete', $supplier);

        $deactivateSupplierAction->execute($supplier);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Supplier deactivated successfully.']);

        return to_route('suppliers.index');
    }
}
