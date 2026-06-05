import { Form, Head, router, usePage } from '@inertiajs/react';
import type { ColumnDef, Row } from '@tanstack/react-table';
import { Download, Pencil, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

import { products as exportProducts } from '@/actions/App/Http/Controllers/ExportController';
import {
    destroy,
    store,
    update,
} from '@/actions/App/Http/Controllers/ProductController';
import { DataGrid } from '@/common/DataGrid';
import { EmptyState } from '@/common/EmptyState';
import { Paginator } from '@/common/Paginator';
import { SearchBar } from '@/common/SearchBar';
import { SkuPreview } from '@/common/SkuPreview';
import { StatusBadge } from '@/common/StatusBadge';
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
    Category,
    Paginated,
    Product,
    ProductFilters,
    Supplier,
} from '@/types';

type ProductsIndexProps = {
    products: Paginated<Product>;
    categories: Category[];
    suppliers: Supplier[];
    filters: ProductFilters;
};

function formatCurrency(value: number): string {
    return `$${value.toFixed(2)}`;
}

function NameCell({ row }: { row: Row<Product> }) {
    return (
        <div>
            <div className="font-medium">{row.original.name}</div>
            <div className="text-xs text-muted-foreground">
                {row.original.sku}
            </div>
        </div>
    );
}

function StockCell({ row }: { row: Row<Product> }) {
    return (
        <StatusBadge
            stockQty={row.original.stock_qty}
            reorderLevel={row.original.reorder_level}
        />
    );
}

function CategoryCell({ row }: { row: Row<Product> }) {
    return row.original.category?.name ?? '-';
}

function PriceCell({ row }: { row: Row<Product> }) {
    return formatCurrency(row.original.price);
}

function DateCell({ row }: { row: Row<Product> }) {
    return new Date(row.original.updated_at).toLocaleDateString();
}

function createActionsColumn(
    onEdit: (p: Product) => void,
    onDelete: (id: number) => void,
    canManage: boolean,
): ColumnDef<Product> {
    return {
        id: 'actions',
        cell: ({ row }) => {
            const actions: TableAction[] = [
                {
                    icon: Pencil,
                    label: 'Edit',
                    onClick: () => onEdit(row.original),
                },
                {
                    icon: Trash2,
                    label: 'Delete',
                    variant: 'destructive',
                    hidden: !canManage,
                    onClick: () => onDelete(row.original.id),
                },
            ];

            return <TableActions actions={actions} />;
        },
    };
}

function visit(url: string) {
    router.visit(url, { preserveState: true, preserveScroll: true });
}

export default function ProductsIndex({
    products,
    categories,
    suppliers,
    filters,
}: ProductsIndexProps) {
    const { auth } = usePage().props;
    const [sheetOpen, setSheetOpen] = useState(false);
    const [editing, setEditing] = useState<Product | null>(null);
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const [previewName, setPreviewName] = useState('');
    const [previewCategoryId, setPreviewCategoryId] = useState<number | string>(
        '',
    );

    const currentRole = auth.user['role'];
    const canManage = currentRole === 'admin' || currentRole === 'superadmin';
    const activeSupplierOptions = suppliers.map((supplier) => ({
        id: supplier.id,
        name: supplier.name,
        isCurrent: false,
    }));
    const currentSupplier = editing?.supplier ?? null;
    const currentSupplierMissing =
        currentSupplier !== null &&
        !suppliers.some((supplier) => supplier.id === currentSupplier.id);
    const supplierOptions = currentSupplierMissing
        ? [
              {
                  id: currentSupplier.id,
                  name: currentSupplier.name,
                  isCurrent: true,
              },
              ...activeSupplierOptions,
          ]
        : activeSupplierOptions;

    function applyFilters(overrides: Partial<ProductFilters>) {
        const params = new URLSearchParams();

        const merged = { ...filters, ...overrides };

        Object.entries(merged).forEach(([key, value]) => {
            if (value) {
                params.set(key, value);
            }
        });

        visit(`/products?${params.toString()}`);
    }

    const columns: ColumnDef<Product>[] = [
        {
            accessorKey: 'name',
            header: 'Name',
            enableSorting: true,
            cell: NameCell,
        },
        {
            id: 'category',
            header: 'Category',
            cell: CategoryCell,
        },
        {
            accessorKey: 'stock_qty',
            header: 'Stock',
            enableSorting: true,
            cell: StockCell,
        },
        {
            accessorKey: 'price',
            header: 'Price',
            enableSorting: true,
            cell: PriceCell,
        },
        {
            accessorKey: 'updated_at',
            header: 'Updated',
            enableSorting: true,
            cell: DateCell,
        },
        createActionsColumn(
            (p) => {
                setEditing(p);
                setPreviewName(p.name);
                setPreviewCategoryId(p.category_id);
                setSheetOpen(true);
            },
            setDeleteId,
            canManage,
        ),
    ];

    function openCreate() {
        setEditing(null);
        setSheetOpen(true);
        setPreviewName('');
        setPreviewCategoryId('');
    }

    return (
        <>
            <Head title="Products" />

            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-semibold text-foreground">
                        Products
                    </h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Manage your product catalog.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    {canManage && (
                        <Button
                            variant="ghost"
                            size="sm"
                            type="button"
                            onClick={() => {
                                router.post(
                                    exportProducts.url(),
                                    {},
                                    {
                                        onSuccess: () => {
                                            toast.success(
                                                'Product export has been queued.',
                                            );
                                        },
                                    },
                                );
                            }}
                        >
                            <Download className="h-4 w-4" />
                            Export
                        </Button>
                    )}
                    <Button size="sm" type="button" onClick={openCreate}>
                        <Plus className="h-4 w-4" />
                        Add Product
                    </Button>
                </div>
            </div>

            <div className="mb-4 flex flex-wrap items-center gap-3">
                <div className="w-full max-w-sm sm:w-64">
                    <SearchBar
                        value={filters.search ?? ''}
                        onChange={(v) => applyFilters({ search: v })}
                        placeholder="Search by name or SKU..."
                    />
                </div>
                <Select
                    value={filters.category_id || 'all'}
                    onValueChange={(v) =>
                        applyFilters({
                            category_id: v === 'all' ? '' : v,
                        })
                    }
                >
                    <SelectTrigger className="w-44">
                        <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        {categories.map((cat) => (
                            <SelectItem key={cat.id} value={String(cat.id)}>
                                {cat.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <Select
                    value={filters.stock_status || 'all'}
                    onValueChange={(v) =>
                        applyFilters({
                            stock_status: v === 'all' ? '' : v,
                        })
                    }
                >
                    <SelectTrigger className="w-40">
                        <SelectValue placeholder="All Stock" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Stock</SelectItem>
                        <SelectItem value="in">In Stock</SelectItem>
                        <SelectItem value="low">Low Stock</SelectItem>
                        <SelectItem value="out">Out of Stock</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <Sheet
                open={sheetOpen}
                onOpenChange={(open) => {
                    setSheetOpen(open);

                    if (!open) {
                        setEditing(null);
                        setPreviewName('');
                        setPreviewCategoryId('');
                    }
                }}
            >
                <SheetContent className="w-full overflow-y-auto sm:max-w-lg">
                    <Form
                        {...(editing ? update.form(editing.id) : store.form())}
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
                                            ? 'Edit Product'
                                            : 'Create Product'}
                                    </SheetTitle>
                                    <SheetDescription>
                                        {editing
                                            ? 'Update the product details.'
                                            : 'Add a new product to your catalog.'}
                                    </SheetDescription>
                                </SheetHeader>
                                <div className="mt-8 space-y-3 px-8">
                                    <div className="space-y-3">
                                        <div className="grid grid-cols-3 gap-4">
                                            <div className="col-span-2 space-y-1.5">
                                                <Label htmlFor="name">
                                                    Name
                                                </Label>
                                                <Input
                                                    id="name"
                                                    name="name"
                                                    defaultValue={
                                                        editing?.name ?? ''
                                                    }
                                                    placeholder="Product name"
                                                    onChange={(e) =>
                                                        setPreviewName(
                                                            e.target.value,
                                                        )
                                                    }
                                                />
                                                {errors['name'] && (
                                                    <p className="text-sm text-destructive">
                                                        {errors['name']}
                                                    </p>
                                                )}
                                            </div>
                                            <div className="space-y-1.5">
                                                <Label htmlFor="unit">
                                                    Unit
                                                </Label>
                                                <Input
                                                    id="unit"
                                                    name="unit"
                                                    defaultValue={
                                                        editing?.unit ?? 'pcs'
                                                    }
                                                    placeholder="pcs, kg, L"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-1.5">
                                                <Label htmlFor="category_id">
                                                    Category
                                                </Label>
                                                <select
                                                    id="category_id"
                                                    name="category_id"
                                                    defaultValue={
                                                        editing?.category_id ??
                                                        ''
                                                    }
                                                    onChange={(e) =>
                                                        setPreviewCategoryId(
                                                            e.target.value,
                                                        )
                                                    }
                                                    className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground ring-offset-background focus:ring-2 focus:ring-ring focus:outline-none"
                                                >
                                                    <option value="">
                                                        Select category
                                                    </option>
                                                    {categories.map((cat) => (
                                                        <option
                                                            key={cat.id}
                                                            value={cat.id}
                                                        >
                                                            {cat.name}
                                                        </option>
                                                    ))}
                                                </select>
                                                {errors['category_id'] && (
                                                    <p className="text-sm text-destructive">
                                                        {errors['category_id']}
                                                    </p>
                                                )}
                                            </div>
                                            <div className="space-y-1.5">
                                                <Label htmlFor="supplier_id">
                                                    Supplier
                                                </Label>
                                                <select
                                                    id="supplier_id"
                                                    name="supplier_id"
                                                    defaultValue={
                                                        editing?.supplier_id ??
                                                        ''
                                                    }
                                                    className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground ring-offset-background focus:ring-2 focus:ring-ring focus:outline-none"
                                                >
                                                    <option value="">
                                                        Select supplier
                                                    </option>
                                                    {supplierOptions.map(
                                                        (sup) => (
                                                            <option
                                                                key={sup.id}
                                                                value={sup.id}
                                                            >
                                                                {sup.name}
                                                                {sup.isCurrent
                                                                    ? ' (current)'
                                                                    : ''}
                                                            </option>
                                                        ),
                                                    )}
                                                </select>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-1.5">
                                        <SkuPreview
                                            categoryId={previewCategoryId}
                                            categories={categories}
                                            productName={previewName}
                                        />
                                    </div>

                                    <div className="space-y-3">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-1.5">
                                                <Label htmlFor="price">
                                                    Price
                                                </Label>
                                                <Input
                                                    id="price"
                                                    name="price"
                                                    type="number"
                                                    step="0.01"
                                                    min="0"
                                                    defaultValue={
                                                        editing?.price ?? ''
                                                    }
                                                    placeholder="0.00"
                                                />
                                                {errors['price'] && (
                                                    <p className="text-sm text-destructive">
                                                        {errors['price']}
                                                    </p>
                                                )}
                                            </div>
                                            <div className="space-y-1.5">
                                                <Label htmlFor="cost">
                                                    Cost
                                                </Label>
                                                <Input
                                                    id="cost"
                                                    name="cost"
                                                    type="number"
                                                    step="0.01"
                                                    min="0"
                                                    defaultValue={
                                                        editing?.cost ?? ''
                                                    }
                                                    placeholder="0.00"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <div className="space-y-1.5">
                                            <Label htmlFor="reorder_level">
                                                Reorder Level
                                            </Label>
                                            <Input
                                                id="reorder_level"
                                                name="reorder_level"
                                                type="number"
                                                min="0"
                                                defaultValue={
                                                    editing?.reorder_level ?? 5
                                                }
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-3">
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
                                    </div>

                                    <div className="space-y-1.5">
                                        <Label htmlFor="image">Image</Label>
                                        <Input
                                            id="image"
                                            name="image"
                                            type="file"
                                            accept="image/jpeg,image/png,image/webp"
                                        />
                                        <p className="text-xs text-muted-foreground">
                                            JPEG, PNG, or WebP. Max 2MB.
                                        </p>
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
                                                  ? 'Update Product'
                                                  : 'Create Product'}
                                        </Button>
                                    </div>
                                </div>
                            </>
                        )}
                    </Form>
                </SheetContent>
            </Sheet>

            {products.data.length > 0 ? (
                <>
                    <DataGrid columns={columns} data={products.data} />
                    <Paginator
                        currentPage={products.current_page}
                        lastPage={products.last_page}
                        total={products.total}
                        from={products.from}
                        to={products.to}
                    />
                </>
            ) : (
                <EmptyState
                    title="No products found"
                    description={
                        filters.search || filters.category_id
                            ? 'No products match your filters. Try different search terms.'
                            : 'Get started by adding your first product.'
                    }
                    action={
                        !filters.search && !filters.category_id ? (
                            <Button
                                size="sm"
                                type="button"
                                onClick={openCreate}
                            >
                                <Plus className="h-4 w-4" />
                                Add Product
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
                    <DialogContent
                        showCloseButton={false}
                        className="sm:max-w-sm"
                    >
                        <Form
                            {...destroy.form(deleteId)}
                            key={deleteId}
                            onSuccess={() => setDeleteId(null)}
                        >
                            {({ processing }) => (
                                <>
                                    <DialogHeader>
                                        <DialogTitle>
                                            Delete Product
                                        </DialogTitle>
                                        <DialogDescription>
                                            Are you sure? This product will be
                                            archived. Stock movement history
                                            will be preserved.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <DialogFooter>
                                        <Button
                                            variant="outline"
                                            type="button"
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
                                </>
                            )}
                        </Form>
                    </DialogContent>
                </Dialog>
            )}
        </>
    );
}
