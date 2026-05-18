<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class StockMovementController extends Controller
{
    public function index()
    {
        return Inertia::render('stock-movements/Index');
    }

    public function create()
    {
        return Inertia::render('stock-movements/Create');
    }

    public function store(Request $request): void
    {
        //
    }
}
