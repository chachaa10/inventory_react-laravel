<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Actions\Export\ExportProductsAction;
use App\Models\Product;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\StreamedResponse;

class ExportController extends Controller
{
    public function products(Request $request, ExportProductsAction $exportProductsAction): RedirectResponse
    {
        $this->authorize('export', Product::class);

        $user = $request->user();
        abort_if($user === null, 401);

        $exportProductsAction->execute($user);

        return back();
    }

    public function download(string $file): StreamedResponse
    {
        $this->authorize('export', Product::class);

        $file = basename($file);

        abort_unless(Storage::disk('local')->exists('exports/'.$file), 404);

        return Storage::disk('local')->download('exports/'.$file);
    }
}
