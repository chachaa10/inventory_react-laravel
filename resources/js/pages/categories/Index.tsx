import { Form, Head, usePage } from '@inertiajs/react';
import type { ColumnDef } from '@tanstack/react-table';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { useState } from 'react';

import {
    store as createCategory,
    update as updateCategory,
    destroy as deleteCategory,
} from '@/actions/App/Http/Controllers/CategoryController';
import { DataGrid } from '@/common/DataGrid';
import { EmptyState } from '@/common/EmptyState';
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
import type { Category } from '@/types';

type CategoryPage = {
    data: Category[];
};

type CategoriesIndexProps = {
    categories: CategoryPage;
};

function createActionsColumn(
    onEdit: (cat: Category) => void,
    onDelete: (id: number) => void,
): ColumnDef<Category> {
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
                <Button
                    variant="ghost"
                    size="xs"
                    onClick={() => onDelete(row.original.id)}
                >
                    <Trash2 className="h-3.5 w-3.5 text-destructive" />
                </Button>
            </div>
        ),
    };
}

export default function CategoriesIndex({ categories }: CategoriesIndexProps) {
    const [sheetOpen, setSheetOpen] = useState(false);
    const [editing, setEditing] = useState<Category | null>(null);
    const [deleteId, setDeleteId] = useState<number | null>(null);

    function openCreate() {
        setEditing(null);
        setSheetOpen(true);
    }

    function openEdit(cat: Category) {
        setEditing(cat);
        setSheetOpen(true);
    }

    const canManage = usePage().props.auth.user['role'] === 'admin';

    const columns: ColumnDef<Category>[] = [
        { accessorKey: 'name', header: 'Name' },
        { accessorKey: 'description', header: 'Description' },
        { accessorKey: 'products_count', header: 'Products' },
        ...(canManage ? [createActionsColumn(openEdit, setDeleteId)] : []),
    ];

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
                {canManage && (
                    <Button size="sm" onClick={openCreate}>
                        <Plus className="h-4 w-4" />
                        Add Category
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
                            ? updateCategory.form(editing.id)
                            : createCategory.form())}
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
                                            ? 'Edit Category'
                                            : 'Create Category'}
                                    </SheetTitle>
                                    <SheetDescription>
                                        {editing
                                            ? 'Update the category details.'
                                            : 'Add a new category to organize products.'}
                                    </SheetDescription>
                                </SheetHeader>
                                <div className="mt-6 space-y-4">
                                    <div className="space-y-1.5">
                                        <Label htmlFor="name">Name</Label>
                                        <Input
                                            id="name"
                                            name="name"
                                            defaultValue={editing?.name ?? ''}
                                            placeholder="e.g. Electronics"
                                        />
                                        {errors['name'] && (
                                            <p className="text-sm text-destructive">
                                                {errors['name']}
                                            </p>
                                        )}
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label htmlFor="description">
                                            Description
                                        </Label>
                                        <Textarea
                                            id="description"
                                            name="description"
                                            defaultValue={
                                                editing?.description ?? ''
                                            }
                                            rows={3}
                                            placeholder="Optional description"
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

            {categories.data.length > 0 ? (
                <DataGrid columns={columns} data={categories.data} />
            ) : (
                <EmptyState
                    title="No categories yet"
                    description={
                        canManage
                            ? 'Create your first category to start organizing products.'
                            : 'No categories have been created yet.'
                    }
                    action={
                        canManage ? (
                            <Button size="sm" onClick={openCreate}>
                                <Plus className="h-4 w-4" />
                                Add Category
                            </Button>
                        ) : undefined
                    }
                />
            )}

            {deleteId !== null && (
                <Dialog
                    open
                    onOpenChange={(open) => {
                        if (!open) {
                            setDeleteId(null);
                        }
                    }}
                >
                    <Form
                        {...deleteCategory.form(deleteId)}
                        key={deleteId}
                        onSuccess={() => setDeleteId(null)}
                    >
                        {({ processing }) => (
                            <DialogContent
                                showCloseButton={false}
                                className="sm:max-w-sm"
                            >
                                <DialogHeader>
                                    <DialogTitle>Delete Category</DialogTitle>
                                    <DialogDescription>
                                        Are you sure? Products in this category
                                        will not be deleted, but they will become
                                        uncategorized.
                                    </DialogDescription>
                                </DialogHeader>
                                <DialogFooter>
                                    <Button
                                        variant="outline"
                                        onClick={() => setDeleteId(null)}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        variant="destructive"
                                        type="submit"
                                        disabled={processing}
                                    >
                                        Delete
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        )}
                </Form>
            </Dialog>
            )}
        </>
    );
}
