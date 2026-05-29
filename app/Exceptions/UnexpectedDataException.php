<?php

declare(strict_types=1);

namespace App\Exceptions;

use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use RuntimeException;

class UnexpectedDataException extends RuntimeException
{
    public function render(Request $request): RedirectResponse
    {
        Inertia::flash('toast', ['type' => 'error', 'message' => $this->getMessage()]);

        return to_route('dashboard');
    }
}
