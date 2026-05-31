import { Head, Link, router } from '@inertiajs/react';
import { Check, CheckCheck } from 'lucide-react';

import { Paginator } from '@/common/Paginator';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { markAllRead, show } from '@/routes/notifications';
import type { AppNotification, Paginated } from '@/types';

function timeAgo(dateString: string): string {
    const seconds = Math.floor(
        (Date.now() - new Date(dateString).getTime()) / 1000,
    );

    if (seconds < 60) {
        return 'just now';
    }

    if (seconds < 3600) {
        return `${Math.floor(seconds / 60)}m ago`;
    }

    if (seconds < 86400) {
        return `${Math.floor(seconds / 3600)}h ago`;
    }

    return `${Math.floor(seconds / 86400)}d ago`;
}

export default function NotificationsIndex({
    notifications,
}: {
    notifications: Paginated<AppNotification>;
}) {
    const unreadCount = notifications.data.filter(
        (n) => n.read_at === null,
    ).length;

    return (
        <>
            <Head title="Notifications" />

            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-semibold text-foreground">
                        Notifications
                    </h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        {unreadCount > 0
                            ? `${unreadCount} unread notification${unreadCount !== 1 ? 's' : ''}`
                            : 'All caught up'}
                    </p>
                </div>
                {unreadCount > 0 && (
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() =>
                            router.patch(markAllRead().url, undefined, {
                                preserveScroll: true,
                                preserveState: true,
                            })
                        }
                    >
                        <CheckCheck className="mr-1.5 h-4 w-4" />
                        Mark all as read
                    </Button>
                )}
            </div>

            <div className="overflow-hidden rounded-xl border border-border">
                {notifications.data.length === 0 ? (
                    <div className="px-6 py-12 text-center text-sm text-muted-foreground">
                        No notifications yet.
                    </div>
                ) : (
                    <div className="divide-y divide-border">
                        {notifications.data.map((notification) => (
                            <Link
                                key={notification.id}
                                href={show(notification.id)}
                                className={cn(
                                    'flex items-start gap-3 px-6 py-4 transition-colors hover:bg-muted/50',
                                    notification.read_at === null &&
                                        'bg-muted/30',
                                )}
                            >
                                <div
                                    className={cn(
                                        'mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full',
                                        notification.read_at === null
                                            ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                                            : 'bg-muted text-muted-foreground',
                                    )}
                                >
                                    {notification.read_at === null ? (
                                        <span className="h-2 w-2 rounded-full bg-current" />
                                    ) : (
                                        <Check className="h-4 w-4" />
                                    )}
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p
                                        className={cn(
                                            'text-sm',
                                            notification.read_at === null
                                                ? 'font-medium text-foreground'
                                                : 'text-muted-foreground',
                                        )}
                                    >
                                        {notification.data.message}
                                    </p>
                                    <p className="mt-0.5 text-xs text-muted-foreground">
                                        {timeAgo(notification.created_at)}
                                    </p>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>

            <Paginator
                currentPage={notifications.current_page}
                lastPage={notifications.last_page}
                total={notifications.total}
                from={notifications.from}
                to={notifications.to}
            />
        </>
    );
}
