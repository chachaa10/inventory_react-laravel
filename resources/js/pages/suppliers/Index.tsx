import { Form, Head, router, usePage } from '@inertiajs/react';
import type { Column, ColumnDef, Row } from '@tanstack/react-table';
import {
    Archive,
    ArchiveRestore,
    ArrowUpDown,
    Plus,
    Pencil,
    RotateCcw,
    UserMinus,
} from 'lucide-react';
import { useState } from 'react';

import {
    activate as reactivateSupplier,
    archive as archiveSupplier,
    deactivate as deactivateSupplier,
    index as suppliersIndex,
    restore as restoreSupplier,
    store as createSupplier,
    update as updateSupplier,
} from '@/actions/App/Http/Controllers/SupplierController';
import { DataGrid } from '@/common/DataGrid';
import { EmptyState } from '@/common/EmptyState';
import { Paginator } from '@/common/Paginator';
import { TableActions } from '@/common/TableActions';
import type { TableAction } from '@/common/TableActions';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from '@/components/ui/sheet';
import { Textarea } from '@/components/ui/textarea';
import type {
    Paginated,
    Supplier,
    SupplierFilters,
    SupplierStatusFilter,
} from '@/types';

type SuppliersIndexProps = {
    suppliers: Paginated<Supplier>;
    filters: SupplierFilters;
};

function StatusCell({ row }: { row: Row<Supplier> }): React.ReactElement {
    if (row.original.archived_at !== null) {
        return (
            <span className="inline-flex items-center rounded-full bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700 dark:bg-amber-950/30 dark:text-amber-400">
                Archived
            </span>
        );
    }

    return (
        <span
            className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                row.original.is_active
                    ? 'bg-green-50 text-green-700 dark:bg-green-950/30 dark:text-green-400'
                    : 'bg-muted text-muted-foreground'
            }`}
        >
            {row.original.is_active ? 'Active' : 'Inactive'}
        </span>
    );
}

function StatusHeader({
    currentStatus,
    onFilterChange,
    column,
}: {
    currentStatus: SupplierStatusFilter;
    onFilterChange: (status: SupplierStatusFilter) => void;
    column?: Column<Supplier>;
}): React.ReactElement {
    const isSorted = column?.getIsSorted();

    return (
        <div
            onClick={(e) => e.stopPropagation()}
            className="inline-flex items-center gap-0.5"
        >
            {currentStatus === 'all' && column?.getCanSort() && (
                <button
                    type="button"
                    onClick={(e) => {
                        e.stopPropagation();
                        column.toggleSorting();
                    }}
                    className="inline-flex items-center justify-center rounded p-0.5 hover:bg-muted"
                    aria-label={isSorted ? 'Remove sort' : 'Sort by status'}
                >
                    <ArrowUpDown
                        className={`h-3 w-3 ${
                            isSorted
                                ? 'text-foreground'
                                : 'text-muted-foreground'
                        }`}
                    />
                </button>
            )}
            <Select
                value={currentStatus}
                onValueChange={(value) =>
                    onFilterChange(value as SupplierStatusFilter)
                }
            >
                <SelectTrigger className="h-6 w-28 border-0 bg-transparent p-0 text-xs font-medium text-muted-foreground shadow-none hover:bg-transparent focus:ring-0 [&>svg]:h-3 [&>svg]:w-3">
                    <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                    <SelectItem value="all">All</SelectItem>
                </SelectContent>
            </Select>
        </div>
    );
}

function lifecycleSortKey(row: Row<Supplier>): number {
    if (row.original.archived_at !== null) {
        return 2;
    }

    return row.original.is_active ? 0 : 1;
}

function createStatusColumn(
    currentStatus: SupplierStatusFilter,
    onFilterChange: (status: SupplierStatusFilter) => void,
): ColumnDef<Supplier> {
    return {
        accessorKey: 'is_active',
        enableSorting: true,
        meta: { sortIconHidden: true } as Record<string, unknown>,
        sortingFn: (rowA, rowB) =>
            lifecycleSortKey(rowA) - lifecycleSortKey(rowB),
        header: function StatusColumnHeader({ column }) {
            return (
                <StatusHeader
                    currentStatus={currentStatus}
                    onFilterChange={onFilterChange}
                    column={column}
                />
            );
        },
        cell: StatusCell,
    };
}

function createActionsColumn(
    onEdit: (s: Supplier) => void,
    onDeactivate: (id: number) => void,
    onReactivate: (id: number) => void,
    onArchive: (id: number) => void,
    onRestore: (id: number) => void,
): ColumnDef<Supplier> {
    return {
        id: 'actions',
        cell: ({ row }) => {
            const actions: TableAction[] = [];

            if (row.original.archived_at !== null) {
                actions.push({
                    icon: ArchiveRestore,
                    label: 'Restore',
                    onClick: () => onRestore(row.original.id),
                });
            } else {
                actions.push({
                    icon: Pencil,
                    label: 'Edit',
                    onClick: () => onEdit(row.original),
                });

                if (row.original.is_active) {
                    actions.push({
                        icon: UserMinus,
                        label: 'Deactivate',
                        variant: 'destructive',
                        onClick: () => onDeactivate(row.original.id),
                    });
                } else {
                    actions.push({
                        icon: RotateCcw,
                        label: 'Reactivate',
                        onClick: () => onReactivate(row.original.id),
                    });
                    actions.push({
                        icon: Archive,
                        label: 'Archive',
                        variant: 'destructive',
                        onClick: () => onArchive(row.original.id),
                    });
                }
            }

            return <TableActions actions={actions} />;
        },
    };
}

function visit(url: string) {
    router.visit(url, { preserveState: true, preserveScroll: true });
}

export default function SuppliersIndex({
    suppliers,
    filters,
}: SuppliersIndexProps) {
    const [sheetOpen, setSheetOpen] = useState(false);
    const [editing, setEditing] = useState<Supplier | null>(null);
    const [deactivateId, setDeactivateId] = useState<number | null>(null);
    const [reactivateId, setReactivateId] = useState<number | null>(null);
    const [archiveId, setArchiveId] = useState<number | null>(null);
    const [restoreId, setRestoreId] = useState<number | null>(null);

    function openCreate() {
        setEditing(null);
        setSheetOpen(true);
    }

    function openEdit(supplier: Supplier) {
        setEditing(supplier);
        setSheetOpen(true);
    }

    const currentRole = usePage().props.auth.user['role'];
    const canManage = currentRole === 'admin' || currentRole === 'superadmin';

    function applyStatusFilter(status: SupplierStatusFilter) {
        visit(
            suppliersIndex.url({
                query: status === 'all' ? {} : { status },
            }),
        );
    }

    const columns: ColumnDef<Supplier>[] = [
        { accessorKey: 'name', header: 'Name' },
        { accessorKey: 'email', header: 'Email' },
        { accessorKey: 'phone', header: 'Phone' },
        createStatusColumn(filters.status, applyStatusFilter),
        { accessorKey: 'products_count', header: 'Products' },
        ...(canManage
            ? [
                  createActionsColumn(
                      openEdit,
                      setDeactivateId,
                      setReactivateId,
                      setArchiveId,
                      setRestoreId,
                  ),
              ]
            : []),
    ];

    return (
        <>
            <Head title="Suppliers" />

            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-semibold text-foreground">
                        Suppliers
                    </h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Manage your product suppliers.
                    </p>
                </div>
                {canManage && (
                    <Button size="sm" type="button" onClick={openCreate}>
                        <Plus className="h-4 w-4" />
                        Add Supplier
                    </Button>
                )}
            </div>

            <Sheet
                open={sheetOpen}
                onOpenChange={(open) => {
                    setSheetOpen(open);

                    if (!open) {
                        setEditing(null);
                    }
                }}
            >
                <SheetContent>
                    <Form
                        {...(editing
                            ? updateSupplier.form(editing.id)
                            : createSupplier.form())}
                        key={editing?.id ?? 'create'}
                        onSuccess={() => {
                            setSheetOpen(false);
                            setEditing(null);
                        }}
                        resetOnSuccess
                    >
                        {({ processing, errors }) => (
                            <>
                                <SheetHeader>
                                    <SheetTitle>
                                        {editing
                                            ? 'Edit Supplier'
                                            : 'Create Supplier'}
                                    </SheetTitle>
                                    <SheetDescription>
                                        {editing
                                            ? 'Update the supplier details.'
                                            : 'Add a new supplier to your catalog.'}
                                    </SheetDescription>
                                </SheetHeader>
                                <div className="mt-8 space-y-3 px-8">
                                    <div className="space-y-3">
                                        <div className="space-y-1.5">
                                            <Label htmlFor="name">Name</Label>
                                            <Input
                                                id="name"
                                                name="name"
                                                defaultValue={
                                                    editing?.name ?? ''
                                                }
                                                placeholder="e.g. TechSupply Co."
                                            />
                                            {errors['name'] && (
                                                <p className="text-sm text-destructive">
                                                    {errors['name']}
                                                </p>
                                            )}
                                        </div>
                                        <div className="space-y-1.5">
                                            <Label htmlFor="email">Email</Label>
                                            <Input
                                                id="email"
                                                name="email"
                                                type="email"
                                                defaultValue={
                                                    editing?.email ?? ''
                                                }
                                                placeholder="orders@supplier.com"
                                            />
                                            {errors['email'] && (
                                                <p className="text-sm text-destructive">
                                                    {errors['email']}
                                                </p>
                                            )}
                                        </div>
                                        <div className="space-y-1.5">
                                            <Label htmlFor="phone">Phone</Label>
                                            <Input
                                                id="phone"
                                                name="phone"
                                                defaultValue={
                                                    editing?.phone ?? ''
                                                }
                                                placeholder="+1-555-0100"
                                            />
                                            {errors['phone'] && (
                                                <p className="text-sm text-destructive">
                                                    {errors['phone']}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label htmlFor="address">Address</Label>
                                        <Textarea
                                            id="address"
                                            name="address"
                                            defaultValue={
                                                editing?.address ?? ''
                                            }
                                            rows={3}
                                            placeholder="Optional address"
                                        />
                                    </div>
                                    <div className="pt-4">
                                        <Button
                                            className="w-full"
                                            type="submit"
                                            disabled={processing}
                                        >
                                            {processing
                                                ? 'Saving...'
                                                : editing
                                                  ? 'Update'
                                                  : 'Create'}
                                        </Button>
                                    </div>
                                </div>
                            </>
                        )}
                    </Form>
                </SheetContent>
            </Sheet>

            {suppliers.data.length > 0 ? (
                <>
                    <DataGrid columns={columns} data={suppliers.data} />
                    <Paginator
                        currentPage={suppliers.current_page}
                        lastPage={suppliers.last_page}
                        total={suppliers.total}
                        from={suppliers.from}
                        to={suppliers.to}
                    />
                </>
            ) : filters.status !== 'active' ? (
                <>
                    <DataGrid columns={columns} data={suppliers.data} />
                    <div className="flex flex-col items-center gap-4 py-12">
                        <p className="text-sm text-muted-foreground">
                            No suppliers match the selected filter.
                        </p>
                        <Button
                            size="sm"
                            variant="outline"
                            type="button"
                            onClick={() => applyStatusFilter('active')}
                        >
                            <RotateCcw className="h-3.5 w-3.5" />
                            Reset to Active
                        </Button>
                    </div>
                    <Paginator
                        currentPage={suppliers.current_page}
                        lastPage={suppliers.last_page}
                        total={suppliers.total}
                        from={suppliers.from}
                        to={suppliers.to}
                    />
                </>
            ) : (
                <EmptyState
                    title="No suppliers yet"
                    description={
                        canManage
                            ? 'Add your first supplier to track who you purchase products from.'
                            : 'No suppliers have been added yet.'
                    }
                    action={
                        canManage ? (
                            <Button
                                size="sm"
                                type="button"
                                onClick={openCreate}
                            >
                                <Plus className="h-4 w-4" />
                                Add Supplier
                            </Button>
                        ) : undefined
                    }
                />
            )}

            {deactivateId !== null && (
                <Dialog
                    open
                    onOpenChange={(open) => {
                        if (!open) {
                            setDeactivateId(null);
                        }
                    }}
                >
                    <DialogContent
                        showCloseButton={false}
                        className="sm:max-w-sm"
                    >
                        <Form
                            {...deactivateSupplier.form(deactivateId)}
                            key={deactivateId}
                            onSuccess={() => setDeactivateId(null)}
                        >
                            {({ processing }) => (
                                <>
                                    <DialogHeader>
                                        <DialogTitle>
                                            Deactivate Supplier
                                        </DialogTitle>
                                        <DialogDescription>
                                            Are you sure? The supplier will be
                                            deactivated and hidden from active
                                            lists, but historical records will
                                            be preserved.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <DialogFooter>
                                        <Button
                                            variant="outline"
                                            type="button"
                                            onClick={() =>
                                                setDeactivateId(null)
                                            }
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            variant="destructive"
                                            type="submit"
                                            disabled={processing}
                                        >
                                            Deactivate
                                        </Button>
                                    </DialogFooter>
                                </>
                            )}
                        </Form>
                    </DialogContent>
                </Dialog>
            )}

            {reactivateId !== null && (
                <Dialog
                    open
                    onOpenChange={(open) => {
                        if (!open) {
                            setReactivateId(null);
                        }
                    }}
                >
                    <DialogContent
                        showCloseButton={false}
                        className="sm:max-w-sm"
                    >
                        <Form
                            {...reactivateSupplier.form(reactivateId)}
                            key={reactivateId}
                            onSuccess={() => setReactivateId(null)}
                        >
                            {({ processing }) => (
                                <>
                                    <DialogHeader>
                                        <DialogTitle>
                                            Reactivate Supplier
                                        </DialogTitle>
                                        <DialogDescription>
                                            Are you sure? The supplier will be
                                            reactivated and available for
                                            selection in product forms.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <DialogFooter>
                                        <Button
                                            variant="outline"
                                            type="button"
                                            onClick={() =>
                                                setReactivateId(null)
                                            }
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            type="submit"
                                            disabled={processing}
                                        >
                                            Reactivate
                                        </Button>
                                    </DialogFooter>
                                </>
                            )}
                        </Form>
                    </DialogContent>
                </Dialog>
            )}

            {archiveId !== null && (
                <Dialog
                    open
                    onOpenChange={(open) => {
                        if (!open) {
                            setArchiveId(null);
                        }
                    }}
                >
                    <DialogContent
                        showCloseButton={false}
                        className="sm:max-w-sm"
                    >
                        <Form
                            {...archiveSupplier.form(archiveId)}
                            key={archiveId}
                            onSuccess={() => setArchiveId(null)}
                        >
                            {({ processing }) => (
                                <>
                                    <DialogHeader>
                                        <DialogTitle>
                                            Archive Supplier
                                        </DialogTitle>
                                        <DialogDescription>
                                            Are you sure? The supplier will move
                                            out of the current supplier list,
                                            but linked products and history will
                                            be preserved.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <DialogFooter>
                                        <Button
                                            variant="outline"
                                            type="button"
                                            onClick={() => setArchiveId(null)}
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            variant="destructive"
                                            type="submit"
                                            disabled={processing}
                                        >
                                            Archive
                                        </Button>
                                    </DialogFooter>
                                </>
                            )}
                        </Form>
                    </DialogContent>
                </Dialog>
            )}

            {restoreId !== null && (
                <Dialog
                    open
                    onOpenChange={(open) => {
                        if (!open) {
                            setRestoreId(null);
                        }
                    }}
                >
                    <DialogContent
                        showCloseButton={false}
                        className="sm:max-w-sm"
                    >
                        <Form
                            {...restoreSupplier.form(restoreId)}
                            key={restoreId}
                            onSuccess={() => setRestoreId(null)}
                        >
                            {({ processing }) => (
                                <>
                                    <DialogHeader>
                                        <DialogTitle>
                                            Restore Supplier
                                        </DialogTitle>
                                        <DialogDescription>
                                            Are you sure? The supplier will be
                                            restored as inactive. Reactivate it
                                            when it should be available in
                                            product forms.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <DialogFooter>
                                        <Button
                                            variant="outline"
                                            type="button"
                                            onClick={() => setRestoreId(null)}
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            type="submit"
                                            disabled={processing}
                                        >
                                            Restore
                                        </Button>
                                    </DialogFooter>
                                </>
                            )}
                        </Form>
                    </DialogContent>
                </Dialog>
            )}
        </>
    );
}
