import { EllipsisVertical } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export type TableAction = {
    icon: LucideIcon;
    label: string;
    onClick: () => void;
    variant?: 'default' | 'destructive';
    hidden?: boolean;
};

export function TableActions({ actions }: { actions: TableAction[] }) {
    const visible = actions.filter((a) => !a.hidden);

    if (visible.length === 0) {
        return null;
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="xs" type="button">
                    <EllipsisVertical className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                {visible.map((action) => (
                    <DropdownMenuItem
                        key={action.label}
                        variant={action.variant ?? 'default'}
                        onClick={action.onClick}
                    >
                        <action.icon className="h-3.5 w-3.5" />
                        {action.label}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
