<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class OrderController extends Controller
{
    public function index()
    {
        return Inertia::render('orders/Index');
    }

    public function create()
    {
        return Inertia::render('orders/Create');
    }

    public function store(Request $request): void
    {
        //
    }

    public function edit(string $id)
    {
        return Inertia::render('orders/Edit');
    }

    public function update(Request $request, string $id): void
    {
        //
    }
}
