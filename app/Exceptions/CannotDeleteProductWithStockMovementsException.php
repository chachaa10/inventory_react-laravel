<?php

declare(strict_types=1);

namespace App\Exceptions;

use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use RuntimeException;

class CannotDeleteProductWithStockMovementsException extends RuntimeException
{
    public function render(Request $request): RedirectResponse
    {
        Inertia::flash('toast', ['type' => 'error', 'message' => 'Cannot delete product with stock movement history.']);

        return to_route('products.index');
    }
}
