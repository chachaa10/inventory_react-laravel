<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ProductController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('products/Index');
    }

    public function create(): Response
    {
        return Inertia::render('products/Create');
    }

    public function store(Request $request): void
    {
        //
    }

    public function show(string $id): void
    {
        //
    }

    public function edit(string $id): Response
    {
        return Inertia::render('products/Edit');
    }

    public function update(Request $request, string $id): void
    {
        //
    }

    public function destroy(string $id): void
    {
        //
    }
}
