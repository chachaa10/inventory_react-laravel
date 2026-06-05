<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Actions\Parties\ActivateSupplierAction;
use App\Actions\Parties\ArchiveSupplierAction;
use App\Actions\Parties\CreateSupplierAction;
use App\Actions\Parties\DeactivateSupplierAction;
use App\Actions\Parties\RestoreSupplierAction;
use App\Actions\Parties\UpdateSupplierAction;
use App\Http\Requests\Supplier\StoreSupplierRequest;
use App\Http\Requests\Supplier\UpdateSupplierRequest;
use App\Models\Supplier;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SupplierController extends Controller
{
    public function index(Request $request): Response
    {
        $status = $request->string('status')->toString();
        $status = in_array($status, ['active', 'inactive', 'archived', 'all'], true) ? $status : 'all';

        $builder = Supplier::query()->withCount('products');

        if ($status === 'active') {
            $builder->where('is_active', true);
            $builder->getQuery()->whereNull('archived_at');
        } elseif ($status === 'inactive') {
            $builder->where('is_active', false);
            $builder->getQuery()->whereNull('archived_at');
        } elseif ($status === 'archived') {
            $builder->getQuery()->whereNotNull('archived_at');
        }

        $builder->getQuery()->orderBy('name');
        $lengthAwarePaginator = $builder->paginate(100);

        return Inertia::render('suppliers/Index', [
            'suppliers' => $lengthAwarePaginator,
            'filters' => ['status' => $status],
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
        abort_if($supplier->archived_at !== null, 403);

        $updateSupplierAction->execute($supplier, $updateSupplierRequest->validated());

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Supplier updated successfully.']);

        return to_route('suppliers.index');
    }

    public function deactivate(DeactivateSupplierAction $deactivateSupplierAction, Supplier $supplier): RedirectResponse
    {
        $this->authorize('deactivate', $supplier);

        $deactivateSupplierAction->execute($supplier);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Supplier deactivated successfully.']);

        return to_route('suppliers.index', ['status' => 'all']);
    }

    public function activate(ActivateSupplierAction $activateSupplierAction, Supplier $supplier): RedirectResponse
    {
        $this->authorize('update', $supplier);
        abort_if($supplier->archived_at !== null, 403);
        abort_if($supplier->is_active, 403);

        $activateSupplierAction->execute($supplier);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Supplier reactivated successfully.']);

        return to_route('suppliers.index', ['status' => 'all']);
    }

    public function archive(ArchiveSupplierAction $archiveSupplierAction, Supplier $supplier): RedirectResponse
    {
        $this->authorize('delete', $supplier);
        abort_if($supplier->is_active || $supplier->archived_at !== null, 403);

        $archiveSupplierAction->execute($supplier);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Supplier archived successfully.']);

        return to_route('suppliers.index', ['status' => 'all']);
    }

    public function restore(RestoreSupplierAction $restoreSupplierAction, Supplier $supplier): RedirectResponse
    {
        $this->authorize('update', $supplier);
        abort_if($supplier->archived_at === null, 403);

        $restoreSupplierAction->execute($supplier);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Supplier restored successfully.']);

        return to_route('suppliers.index', ['status' => 'all']);
    }
}
