import { Inbox } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

type EmptyStateProps = {
    icon?: LucideIcon;
    title: string;
    description: string;
    action?: React.ReactNode;
};

export function EmptyState({
    icon: Icon = Inbox,
    title,
    description,
    action,
}: EmptyStateProps) {
    return (
        <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                <Icon className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="mb-1 text-sm font-semibold text-foreground">
                {title}
            </h3>
            <p className="mb-4 max-w-sm text-sm text-muted-foreground">
                {description}
            </p>
            {action}
        </div>
    );
}
