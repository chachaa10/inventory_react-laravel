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

type Category = {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    products_count: number;
};

const sampleData: Category[] = [
    {
        id: 1,
        name: 'Electronics',
        slug: 'electronics',
        description: 'Devices and accessories',
        products_count: 45,
    },
    {
        id: 2,
        name: 'Office Supplies',
        slug: 'office-supplies',
        description: 'Stationery and desk items',
        products_count: 22,
    },
    {
        id: 3,
        name: 'Clothing',
        slug: 'clothing',
        description: null,
        products_count: 32,
    },
];

export default function CategoriesIndex() {
    const [editing, setEditing] = useState<Category | null>(null);
    const [sheetOpen, setSheetOpen] = useState(false);
    const [deleteId, setDeleteId] = useState<number | null>(null);

    return (
        <>
            <Head title="Categories" />

            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-semibold text-foreground">
                        Categories
                    </h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Organize products into categories.
                    </p>
                </div>
                <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
                    <SheetTrigger asChild>
                        <Button size="sm" onClick={() => setEditing(null)}>
                            <Plus className="h-4 w-4" />
                            Add Category
                        </Button>
                    </SheetTrigger>
                    <SheetContent>
                        <SheetHeader>
                            <SheetTitle>
                                {editing ? 'Edit Category' : 'Create Category'}
                            </SheetTitle>
                            <SheetDescription>
                                {editing
                                    ? 'Update the category details.'
                                    : 'Add a new category to organize products.'}
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
                                    placeholder="e.g. Electronics"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-foreground">
                                    Description
                                </label>
                                <textarea
                                    defaultValue={editing?.description ?? ''}
                                    rows={3}
                                    className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus:ring-2 focus:ring-ring focus:outline-none"
                                    placeholder="Optional description"
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
                                    Description
                                </th>
                                <th className="h-10 px-4 text-left text-xs font-medium text-muted-foreground">
                                    Products
                                </th>
                                <th className="h-10 px-4 text-right text-xs font-medium text-muted-foreground">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {sampleData.map((cat) => (
                                <tr
                                    key={cat.id}
                                    className="border-b border-border last:border-0 hover:bg-muted/50"
                                >
                                    <td className="h-12 px-4 font-medium text-foreground">
                                        {cat.name}
                                    </td>
                                    <td className="h-12 px-4 text-muted-foreground">
                                        {cat.description ?? '-'}
                                    </td>
                                    <td className="h-12 px-4 text-foreground">
                                        {cat.products_count}
                                    </td>
                                    <td className="h-12 px-4 text-right">
                                        <div className="inline-flex items-center gap-1">
                                            <Button
                                                variant="ghost"
                                                size="xs"
                                                onClick={() => {
                                                    setEditing(cat);
                                                    setSheetOpen(true);
                                                }}
                                            >
                                                <Pencil className="h-3.5 w-3.5" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="xs"
                                                onClick={() =>
                                                    setDeleteId(cat.id)
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
                    title="No categories yet"
                    description="Create your first category to start organizing products."
                    action={
                        <Button size="sm" onClick={() => setSheetOpen(true)}>
                            <Plus className="h-4 w-4" />
                            Add Category
                        </Button>
                    }
                />
            )}

            <ConfirmDialog
                open={deleteId !== null}
                onOpenChange={(open) => {
                    if (!open) setDeleteId(null);
                }}
                onConfirm={() => {
                    setDeleteId(null);
                }}
                title="Delete Category"
                description="Are you sure? Products in this category will not be deleted, but they will become uncategorized."
                confirmLabel="Delete"
                destructive
            />
        </>
    );
}
