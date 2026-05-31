import { Link, usePage } from '@inertiajs/react';
import { Bell } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { index, show } from '@/routes/notifications';
import type { AppNotification } from '@/types';

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

export function NotificationDropdown() {
    const { latestNotifications, unreadNotificationsCount } = usePage().props;

    const notifications = (latestNotifications ?? []) as AppNotification[];

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="relative"
                    aria-label="Notifications"
                >
                    <Bell className="h-5 w-5" />
                    {unreadNotificationsCount > 0 && (
                        <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
                            {unreadNotificationsCount > 99
                                ? '99+'
                                : unreadNotificationsCount}
                        </span>
                    )}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-80" align="end" sideOffset={8}>
                <DropdownMenuLabel className="flex items-center justify-between">
                    <span>Notifications</span>
                    <Link
                        href={index()}
                        className="text-xs text-muted-foreground hover:text-foreground"
                    >
                        View all
                    </Link>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {notifications.length === 0 ? (
                    <div className="px-2 py-4 text-center text-sm text-muted-foreground">
                        No notifications
                    </div>
                ) : (
                    <DropdownMenuGroup>
                        {notifications.map((notification) => (
                            <DropdownMenuItem
                                key={notification.id}
                                asChild
                                className={cn(
                                    'flex flex-col items-start gap-0.5 py-2.5',
                                    notification.read_at === null &&
                                        'bg-muted/50 font-medium',
                                )}
                            >
                                <Link
                                    href={show(notification.id)}
                                    className="w-full"
                                >
                                    <span className="text-xs text-foreground">
                                        {notification.data.message}
                                    </span>
                                    <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                                        {timeAgo(notification.created_at)}
                                        {notification.read_at === null && (
                                            <span className="ml-1 h-1.5 w-1.5 rounded-full bg-blue-500" />
                                        )}
                                    </span>
                                </Link>
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuGroup>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                    <Link
                        href={index()}
                        className="flex items-center justify-center gap-1 text-xs text-muted-foreground"
                    >
                        View all notifications
                    </Link>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
