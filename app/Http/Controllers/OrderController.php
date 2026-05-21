<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class OrderController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('orders/Index');
    }

    public function create(): Response
    {
        return Inertia::render('orders/Create');
    }

    public function store(Request $request): void
    {
        //
    }

    public function edit(string $id): Response
    {
        return Inertia::render('orders/Edit');
    }

    public function update(Request $request, string $id): void
    {
        //
    }
}
