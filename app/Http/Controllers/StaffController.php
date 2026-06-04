<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Actions\Admin\DeactivateStaffAction;
use App\Actions\Admin\UpdateStaffAction;
use App\Http\Requests\Staff\UpdateStaffRequest;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class StaffController extends Controller
{
    public function index(): Response
    {
        $this->authorize('viewAny', User::class);

        $lengthAwarePaginator = User::query()
            ->latest()
            ->paginate(20);

        return Inertia::render('staff/Index', [
            'users' => $lengthAwarePaginator,
        ]);
    }

    public function update(UpdateStaffRequest $updateStaffRequest, UpdateStaffAction $updateStaffAction, User $user): RedirectResponse
    {
        $this->authorize('update', $user);

        $updateStaffAction->execute($user, $updateStaffRequest->validated());

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Staff user updated successfully.']);

        return to_route('staff.index');
    }

    public function destroy(DeactivateStaffAction $deactivateStaffAction, User $user): RedirectResponse
    {
        $this->authorize('deactivate', $user);

        $deactivateStaffAction->execute($user);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Staff user deactivated successfully.']);

        return to_route('staff.index');
    }
}
