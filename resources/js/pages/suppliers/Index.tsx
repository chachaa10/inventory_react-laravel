import { Form, Head, usePage } from '@inertiajs/react';
import type { ColumnDef, Row } from '@tanstack/react-table';
import { Plus, Pencil, RotateCcw, Trash2 } from 'lucide-react';
import { useState } from 'react';

import {
    activate as reactivateSupplier,
    store as createSupplier,
    update as updateSupplier,
    destroy as deactivateSupplier,
} from '@/actions/App/Http/Controllers/SupplierController';
import { DataGrid } from '@/common/DataGrid';
import { EmptyState } from '@/common/EmptyState';
import { Paginator } from '@/common/Paginator';
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
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from '@/components/ui/sheet';
import { Textarea } from '@/components/ui/textarea';
import type { Paginated, Supplier } from '@/types';

type SuppliersIndexProps = {
    suppliers: Paginated<Supplier>;
};

function StatusCell({ row }: { row: Row<Supplier> }): React.ReactElement {
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

function createActionsColumn(
    onEdit: (s: Supplier) => void,
    onDeactivate: (id: number) => void,
    onReactivate: (id: number) => void,
): ColumnDef<Supplier> {
    return {
        id: 'actions',
        cell: ({ row }) => (
            <div className="inline-flex items-center gap-1">
                <Button
                    variant="ghost"
                    size="xs"
                    onClick={() => onEdit(row.original)}
                >
                    <Pencil className="h-3.5 w-3.5" />
                </Button>
                {row.original.is_active ? (
                    <Button
                        variant="ghost"
                        size="xs"
                        onClick={() => onDeactivate(row.original.id)}
                    >
                        <Trash2 className="h-3.5 w-3.5 text-destructive" />
                    </Button>
                ) : (
                    <Button
                        variant="ghost"
                        size="xs"
                        onClick={() => onReactivate(row.original.id)}
                    >
                        <RotateCcw className="h-3.5 w-3.5 text-primary" />
                    </Button>
                )}
            </div>
        ),
    };
}

export default function SuppliersIndex({ suppliers }: SuppliersIndexProps) {
    const [sheetOpen, setSheetOpen] = useState(false);
    const [editing, setEditing] = useState<Supplier | null>(null);
    const [deactivateId, setDeactivateId] = useState<number | null>(null);
    const [reactivateId, setReactivateId] = useState<number | null>(null);

    function openCreate() {
        setEditing(null);
        setSheetOpen(true);
    }

    function openEdit(supplier: Supplier) {
        setEditing(supplier);
        setSheetOpen(true);
    }

    const canManage = usePage().props.auth.user['role'] === 'admin';

    const columns: ColumnDef<Supplier>[] = [
        { accessorKey: 'name', header: 'Name' },
        { accessorKey: 'email', header: 'Email' },
        { accessorKey: 'phone', header: 'Phone' },
        {
            accessorKey: 'is_active',
            header: 'Status',
            cell: StatusCell,
        },
        { accessorKey: 'products_count', header: 'Products' },
        ...(canManage
            ? [createActionsColumn(openEdit, setDeactivateId, setReactivateId)]
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
                    <Button size="sm" onClick={openCreate}>
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
                                <div className="mt-6 space-y-4">
                                    <div className="space-y-1.5">
                                        <Label htmlFor="name">Name</Label>
                                        <Input
                                            id="name"
                                            name="name"
                                            defaultValue={editing?.name ?? ''}
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
                                            defaultValue={editing?.email ?? ''}
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
                                            defaultValue={editing?.phone ?? ''}
                                            placeholder="+1-555-0100"
                                        />
                                        {errors['phone'] && (
                                            <p className="text-sm text-destructive">
                                                {errors['phone']}
                                            </p>
                                        )}
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
                            <Button size="sm" onClick={openCreate}>
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
        </>
    );
}
