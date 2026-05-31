import { usePage } from '@inertiajs/react';
import type { ColumnDef, Row } from '@tanstack/react-table';
import { Pencil, Trash2 } from 'lucide-react';

import { DataGrid } from '@/common/DataGrid';
import { EmptyState } from '@/common/EmptyState';
import { Paginator } from '@/common/Paginator';
import { Button } from '@/components/ui/button';
import type { Paginated } from '@/types';

export type StaffUser = {
    id: number;
    name: string;
    email: string;
    role: string;
    is_active: boolean;
    email_verified_at: string | null;
    created_at: string;
};

type StaffTableProps = {
    users: Paginated<StaffUser>;
    onEdit: (user: StaffUser) => void;
    onDeactivate: (id: number) => void;
};

function RoleBadge({ role }: { role: string }): React.ReactElement {
    const isAdmin = role === 'admin';

    return (
        <span
            className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                isAdmin
                    ? 'bg-purple-50 text-purple-700 dark:bg-purple-950/30 dark:text-purple-400'
                    : 'bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400'
            }`}
        >
            {isAdmin ? 'Admin' : 'Staff'}
        </span>
    );
}

function StatusBadge({ isActive }: { isActive: boolean }): React.ReactElement {
    if (isActive) {
        return (
            <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-0.5 text-xs font-medium text-green-700 dark:bg-green-950/30 dark:text-green-400">
                Active
            </span>
        );
    }

    return (
        <span className="inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
            Inactive
        </span>
    );
}

function RoleCell({ row }: { row: Row<StaffUser> }): React.ReactElement {
    return <RoleBadge role={row.original.role} />;
}

function StatusCell({ row }: { row: Row<StaffUser> }): React.ReactElement {
    return <StatusBadge isActive={row.original.is_active} />;
}

function createActionsColumn(
    onEdit: (user: StaffUser) => void,
    onDeactivate: (id: number) => void,
): ColumnDef<StaffUser> {
    return {
        id: 'actions',
        cell: ({ row }) => (
            <div className="inline-flex items-center gap-1">
                <Button
                    variant="ghost"
                    size="xs"
                    type="button"
                    onClick={() => onEdit(row.original)}
                >
                    <Pencil className="h-3.5 w-3.5" />
                </Button>
                {row.original.is_active && (
                    <Button
                        variant="ghost"
                        size="xs"
                        type="button"
                        onClick={() => onDeactivate(row.original.id)}
                    >
                        <Trash2 className="h-3.5 w-3.5 text-destructive" />
                    </Button>
                )}
            </div>
        ),
    };
}

export function StaffTable({ users, onEdit, onDeactivate }: StaffTableProps) {
    const canManage = usePage().props.auth.user['role'] === 'admin';

    const columns: ColumnDef<StaffUser>[] = [
        { accessorKey: 'name', header: 'Name' },
        { accessorKey: 'email', header: 'Email' },
        {
            accessorKey: 'role',
            header: 'Role',
            cell: RoleCell,
        },
        {
            accessorKey: 'is_active',
            header: 'Status',
            cell: StatusCell,
        },
        ...(canManage ? [createActionsColumn(onEdit, onDeactivate)] : []),
    ];

    if (users.data.length === 0) {
        return (
            <EmptyState
                title="No users yet"
                description="Users will appear here once they register."
                action={undefined}
            />
        );
    }

    return (
        <>
            <DataGrid columns={columns} data={users.data} />
            <Paginator
                currentPage={users.current_page}
                lastPage={users.last_page}
                total={users.total}
                from={users.from}
                to={users.to}
            />
        </>
    );
}
