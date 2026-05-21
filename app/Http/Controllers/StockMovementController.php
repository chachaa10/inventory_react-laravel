<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class StockMovementController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('stock-movements/Index');
    }

    public function create(): Response
    {
        return Inertia::render('stock-movements/Create');
    }

    public function store(Request $request): void
    {
        //
    }
}
