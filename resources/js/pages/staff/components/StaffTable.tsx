import { usePage } from '@inertiajs/react';
import type { ColumnDef, Row } from '@tanstack/react-table';
import { Pencil, UserCheck, UserX } from 'lucide-react';

import { DataGrid } from '@/common/DataGrid';
import { EmptyState } from '@/common/EmptyState';
import { Paginator } from '@/common/Paginator';
import { TableActions } from '@/common/TableActions';
import type { TableAction } from '@/common/TableActions';
import type { Paginated } from '@/types';
import type { Role } from '@/types/auth';

export type StaffUser = {
    id: number;
    name: string;
    email: string;
    role: Role;
    is_active: boolean;
    email_verified_at: string | null;
    created_at: string;
};

type StaffTableProps = {
    users: Paginated<StaffUser>;
    onEdit: (user: StaffUser) => void;
    onToggleActive: (id: number, isActive: boolean) => void;
};

const roleBadgeVariants: Record<Role, string> = {
    superadmin:
        'bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400',
    admin: 'bg-purple-50 text-purple-700 dark:bg-purple-950/30 dark:text-purple-400',
    staff: 'bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400',
};

const roleLabels: Record<Role, string> = {
    superadmin: 'Superadmin',
    admin: 'Admin',
    staff: 'Staff',
};

function RoleBadge({ role }: { role: Role }): React.ReactElement {
    const variant = roleBadgeVariants[role] ?? roleBadgeVariants['staff'];
    const label = roleLabels[role] ?? role;

    return (
        <span
            className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${variant}`}
        >
            {label}
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

function canEdit(
    currentRole: Role,
    targetId: number,
    currentUserId: number,
): boolean {
    return currentRole === 'superadmin' && targetId !== currentUserId;
}

function canToggleActive(
    currentRole: Role,
    targetRole: Role,
    targetId: number,
    currentUserId: number,
): boolean {
    if (targetId === currentUserId) {
        return false;
    }

    if (currentRole === 'superadmin') {
        return true;
    }

    return targetRole === 'staff';
}

function createActionsColumn(
    onEdit: (user: StaffUser) => void,
    onToggleActive: (id: number, isActive: boolean) => void,
    currentRole: Role,
    currentUserId: number,
): ColumnDef<StaffUser> {
    return {
        id: 'actions',
        cell: ({ row }) => {
            const user = row.original;
            const actions: TableAction[] = [];

            if (canEdit(currentRole, user.id, currentUserId)) {
                actions.push({
                    icon: Pencil,
                    label: 'Edit',
                    onClick: () => onEdit(user),
                });
            }

            if (
                canToggleActive(currentRole, user.role, user.id, currentUserId)
            ) {
                if (user.is_active) {
                    actions.push({
                        icon: UserX,
                        label: 'Deactivate',
                        variant: 'destructive',
                        onClick: () => onToggleActive(user.id, true),
                    });
                } else {
                    actions.push({
                        icon: UserCheck,
                        label: 'Activate',
                        onClick: () => onToggleActive(user.id, false),
                    });
                }
            }

            return <TableActions actions={actions} />;
        },
    };
}

export function StaffTable({ users, onEdit, onToggleActive }: StaffTableProps) {
    const currentUser = usePage().props.auth.user;
    const currentRole = currentUser.role;
    const currentUserId = currentUser.id;
    const canManage = currentRole === 'superadmin' || currentRole === 'admin';

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
        ...(canManage
            ? [
                  createActionsColumn(
                      onEdit,
                      onToggleActive,
                      currentRole,
                      currentUserId,
                  ),
              ]
            : []),
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
