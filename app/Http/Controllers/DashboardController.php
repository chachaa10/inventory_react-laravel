<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Actions\Dashboard\GetDashboardDataAction;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __construct(
        private readonly GetDashboardDataAction $getDashboardDataAction,
    ) {}

    public function __invoke(): Response
    {
        $data = $this->getDashboardDataAction->execute();

        return Inertia::render('dashboard/Index', $data);
    }
}
