import { Head } from '@inertiajs/react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { useState } from 'react';

import { ConfirmDialog } from '@/common/ConfirmDialog';
import { EmptyState } from '@/common/EmptyState';
import { Button } from '@/components/ui/button';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';

type Supplier = {
    id: number;
    name: string;
    email: string | null;
    phone: string | null;
    is_active: boolean;
};

const sampleData: Supplier[] = [
    {
        id: 1,
        name: 'TechSupply Co.',
        email: 'orders@techsupply.com',
        phone: '+1-555-0100',
        is_active: true,
    },
    {
        id: 2,
        name: 'OfficeWorld',
        email: 'sales@officeworld.com',
        phone: '+1-555-0101',
        is_active: true,
    },
    {
        id: 3,
        name: 'Global Distributors',
        email: null,
        phone: '+1-555-0102',
        is_active: false,
    },
];

export default function SuppliersIndex() {
    const [editing, setEditing] = useState<Supplier | null>(null);
    const [sheetOpen, setSheetOpen] = useState(false);
    const [deleteId, setDeleteId] = useState<number | null>(null);

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
                <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
                    <SheetTrigger asChild>
                        <Button size="sm" onClick={() => setEditing(null)}>
                            <Plus className="h-4 w-4" />
                            Add Supplier
                        </Button>
                    </SheetTrigger>
                    <SheetContent>
                        <SheetHeader>
                            <SheetTitle>
                                {editing ? 'Edit Supplier' : 'Create Supplier'}
                            </SheetTitle>
                            <SheetDescription>
                                {editing
                                    ? 'Update supplier details.'
                                    : 'Add a new supplier.'}
                            </SheetDescription>
                        </SheetHeader>
                        <div className="mt-6 space-y-4">
                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-foreground">
                                    Name
                                </label>
                                <input
                                    type="text"
                                    defaultValue={editing?.name ?? ''}
                                    className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground focus:ring-2 focus:ring-ring focus:outline-none"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-foreground">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    defaultValue={editing?.email ?? ''}
                                    className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground focus:ring-2 focus:ring-ring focus:outline-none"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-foreground">
                                    Phone
                                </label>
                                <input
                                    type="text"
                                    defaultValue={editing?.phone ?? ''}
                                    className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground focus:ring-2 focus:ring-ring focus:outline-none"
                                />
                            </div>
                            <div className="pt-4">
                                <Button className="w-full">
                                    {editing ? 'Update' : 'Create'}
                                </Button>
                            </div>
                        </div>
                    </SheetContent>
                </Sheet>
            </div>

            {sampleData.length > 0 ? (
                <div className="overflow-hidden rounded-xl border border-border">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-border">
                                <th className="h-10 px-4 text-left text-xs font-medium text-muted-foreground">
                                    Name
                                </th>
                                <th className="h-10 px-4 text-left text-xs font-medium text-muted-foreground">
                                    Email
                                </th>
                                <th className="h-10 px-4 text-left text-xs font-medium text-muted-foreground">
                                    Phone
                                </th>
                                <th className="h-10 px-4 text-left text-xs font-medium text-muted-foreground">
                                    Status
                                </th>
                                <th className="h-10 px-4 text-right text-xs font-medium text-muted-foreground">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {sampleData.map((s) => (
                                <tr
                                    key={s.id}
                                    className="border-b border-border last:border-0 hover:bg-muted/50"
                                >
                                    <td className="h-12 px-4 font-medium text-foreground">
                                        {s.name}
                                    </td>
                                    <td className="h-12 px-4 text-muted-foreground">
                                        {s.email ?? '-'}
                                    </td>
                                    <td className="h-12 px-4 text-muted-foreground">
                                        {s.phone ?? '-'}
                                    </td>
                                    <td className="h-12 px-4">
                                        <span
                                            className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                                                s.is_active
                                                    ? 'bg-green-50 text-green-700 dark:bg-green-950/30 dark:text-green-400'
                                                    : 'bg-muted text-muted-foreground'
                                            }`}
                                        >
                                            {s.is_active
                                                ? 'Active'
                                                : 'Inactive'}
                                        </span>
                                    </td>
                                    <td className="h-12 px-4 text-right">
                                        <div className="inline-flex items-center gap-1">
                                            <Button
                                                variant="ghost"
                                                size="xs"
                                                onClick={() => {
                                                    setEditing(s);
                                                    setSheetOpen(true);
                                                }}
                                            >
                                                <Pencil className="h-3.5 w-3.5" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="xs"
                                                onClick={() =>
                                                    setDeleteId(s.id)
                                                }
                                            >
                                                <Trash2 className="h-3.5 w-3.5 text-destructive" />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <EmptyState
                    title="No suppliers yet"
                    description="Add suppliers to track who you purchase products from."
                    action={
                        <Button size="sm" onClick={() => setSheetOpen(true)}>
                            <Plus className="h-4 w-4" />
                            Add Supplier
                        </Button>
                    }
                />
            )}

            <ConfirmDialog
                open={deleteId !== null}
                onOpenChange={(open) => {
                    if (!open) setDeleteId(null);
                }}
                onConfirm={() => setDeleteId(null)}
                title="Delete Supplier"
                description="Are you sure? This action cannot be undone."
                confirmLabel="Delete"
                destructive
            />
        </>
    );
}
