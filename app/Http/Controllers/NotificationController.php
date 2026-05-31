<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Notifications\DatabaseNotification;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\Response as SymfonyResponse;

class NotificationController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();

        abort_if($user === null, 401);

        return Inertia::render('notifications/Index', [
            'notifications' => $user->notifications()->getQuery()->paginate(20),
        ]);
    }

    public function show(Request $request, DatabaseNotification $databaseNotification): SymfonyResponse|RedirectResponse
    {
        $user = $request->user();

        abort_if($user === null || $databaseNotification->notifiable_id !== $user->getKey() || $databaseNotification->notifiable_type !== $user->getMorphClass(), 403);

        $databaseNotification->markAsRead();

        $data = $databaseNotification->data;

        if (isset($data['product_id'])) {
            return to_route('products.index');
        }

        if (isset($data['status']) && $data['status'] === 'processing') {
            Inertia::flash('toast', ['type' => 'info', 'message' => 'Export is still being processed. Check again shortly.']);

            return to_route('notifications.index');
        }

        if (isset($data['file']) && is_string($data['file'])) {
            return Inertia::location(to_route('exports.download', ['file' => basename($data['file'])]));
        }

        return to_route('notifications.index');
    }

    public function markAllRead(Request $request): RedirectResponse
    {
        $user = $request->user();

        abort_if($user === null, 401);

        $user->unreadNotifications()->getQuery()->update(['read_at' => now()]);

        return to_route('notifications.index');
    }
}
