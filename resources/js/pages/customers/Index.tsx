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
import type { Customer } from '@/types';

const sampleData: Customer[] = [
    {
        id: 1,
        name: 'Acme Corp',
        email: 'info@acme.com',
        phone: '+1-555-0200',
        is_active: true,
    },
    {
        id: 2,
        name: 'Beta Industries',
        email: 'contact@beta.com',
        phone: '+1-555-0201',
        is_active: true,
    },
    {
        id: 3,
        name: 'Gamma Ltd',
        email: null,
        phone: '+1-555-0202',
        is_active: true,
    },
];

export default function CustomersIndex() {
    const [editing, setEditing] = useState<Customer | null>(null);
    const [sheetOpen, setSheetOpen] = useState(false);
    const [deleteId, setDeleteId] = useState<number | null>(null);

    return (
        <>
            <Head title="Customers" />

            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-semibold text-foreground">
                        Customers
                    </h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Manage your customer list.
                    </p>
                </div>
                <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
                    <SheetTrigger asChild>
                        <Button
                            size="sm"
                            type="button"
                            onClick={() => setEditing(null)}
                        >
                            <Plus className="h-4 w-4" />
                            Add Customer
                        </Button>
                    </SheetTrigger>
                    <SheetContent>
                        <SheetHeader>
                            <SheetTitle>
                                {editing ? 'Edit Customer' : 'Create Customer'}
                            </SheetTitle>
                            <SheetDescription>
                                {editing
                                    ? 'Update customer details.'
                                    : 'Add a new customer.'}
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
                                <Button type="button" className="w-full">
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
                                <th className="h-10 px-4 text-right text-xs font-medium text-muted-foreground">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {sampleData.map((c) => (
                                <tr
                                    key={c.id}
                                    className="border-b border-border last:border-0 hover:bg-muted/50"
                                >
                                    <td className="h-12 px-4 font-medium text-foreground">
                                        {c.name}
                                    </td>
                                    <td className="h-12 px-4 text-muted-foreground">
                                        {c.email ?? '-'}
                                    </td>
                                    <td className="h-12 px-4 text-muted-foreground">
                                        {c.phone ?? '-'}
                                    </td>
                                    <td className="h-12 px-4 text-right">
                                        <div className="inline-flex items-center gap-1">
                                            <Button
                                                variant="ghost"
                                                size="xs"
                                                type="button"
                                                onClick={() => {
                                                    setEditing(c);
                                                    setSheetOpen(true);
                                                }}
                                            >
                                                <Pencil className="h-3.5 w-3.5" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="xs"
                                                type="button"
                                                onClick={() =>
                                                    setDeleteId(c.id)
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
                    title="No customers yet"
                    description="Add customers to track sales and orders."
                    action={
                        <Button
                            size="sm"
                            type="button"
                            onClick={() => setSheetOpen(true)}
                        >
                            <Plus className="h-4 w-4" /> Add Customer
                        </Button>
                    }
                />
            )}

            <ConfirmDialog
                open={deleteId !== null}
                onOpenChange={(open) => {
                    if (!open) {
                        setDeleteId(null);
                    }
                }}
                onConfirm={() => setDeleteId(null)}
                title="Delete Customer"
                description="Are you sure? This action cannot be undone."
                confirmLabel="Delete"
                destructive
            />
        </>
    );
}
