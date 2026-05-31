import { Form, Head } from '@inertiajs/react';
import type { ColumnDef, Row } from '@tanstack/react-table';
import { ArrowLeftRight, Plus } from 'lucide-react';
import { useState } from 'react';

import { store as recordMovement } from '@/actions/App/Http/Controllers/StockMovementController';
import { DataGrid } from '@/common/DataGrid';
import { EmptyState } from '@/common/EmptyState';
import { Paginator } from '@/common/Paginator';
import { Button } from '@/components/ui/button';
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
import type { Paginated, ProductOption, StockMovement } from '@/types';

type StockMovementsIndexProps = {
    movements: Paginated<StockMovement>;
    products: ProductOption[];
};

function TypeCell({ row }: { row: Row<StockMovement> }): React.ReactElement {
    const t = row.original.type;
    const colors = {
        in: 'bg-green-50 text-green-700 dark:bg-green-950/30 dark:text-green-400',
        out: 'bg-red-50 text-red-700 dark:bg-red-950/30 dark:text-red-400',
        adjustment:
            'bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400',
    };

    return (
        <span
            className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${colors[t]}`}
        >
            <ArrowLeftRight className="h-3 w-3" />
            {t}
        </span>
    );
}

const columns: ColumnDef<StockMovement>[] = [
    {
        accessorFn: (row) => row.product_name ?? row.product?.name,
        id: 'product',
        header: 'Product',
    },
    {
        accessorKey: 'type',
        header: 'Type',
        cell: TypeCell,
    },
    {
        accessorKey: 'qty',
        header: 'Qty',
    },
    {
        accessorKey: 'before_qty',
        header: 'Before',
    },
    {
        accessorKey: 'after_qty',
        header: 'After',
    },
    {
        accessorKey: 'reference',
        header: 'Reference',
        cell: ({ row }) => row.original.reference ?? '-',
    },
    {
        accessorFn: (row) => row.user?.name,
        id: 'user',
        header: 'By',
    },
    {
        accessorKey: 'created_at',
        header: 'Date',
        cell: ({ row }) => {
            const date = new Date(row.original.created_at);

            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
            });
        },
    },
];

export default function StockMovementsIndex({
    movements,
    products,
}: StockMovementsIndexProps) {
    const [sheetOpen, setSheetOpen] = useState(false);
    const [productId, setProductId] = useState('');
    const [type, setType] = useState('in');

    function openCreate() {
        setProductId('');
        setType('in');
        setSheetOpen(true);
    }

    function resetSheet() {
        setSheetOpen(false);
        setProductId('');
        setType('in');
    }

    return (
        <>
            <Head title="Stock Movements" />

            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-semibold text-foreground">
                        Stock Movements
                    </h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Track all inventory changes.
                    </p>
                </div>
                <Button size="sm" type="button" onClick={openCreate}>
                    <Plus className="h-4 w-4" />
                    Record Movement
                </Button>
            </div>

            <Sheet
                open={sheetOpen}
                onOpenChange={(open) => {
                    setSheetOpen(open);

                    if (!open) {
                        setProductId('');
                        setType('in');
                    }
                }}
            >
                <SheetContent>
                    <Form
                        {...recordMovement.form()}
                        key="create"
                        onSuccess={resetSheet}
                        resetOnSuccess
                    >
                        {({ processing, errors }) => (
                            <>
                                <SheetHeader>
                                    <SheetTitle>
                                        Record Stock Movement
                                    </SheetTitle>
                                    <SheetDescription>
                                        Adjust inventory quantities.
                                    </SheetDescription>
                                </SheetHeader>
                                <div className="mt-8 space-y-3 px-8">
                                    <div className="space-y-3">
                                        <div className="space-y-1.5">
                                            <Label htmlFor="product_id">
                                                Product
                                            </Label>
                                            <input
                                                type="hidden"
                                                name="product_id"
                                                value={productId}
                                            />
                                            <Select
                                                value={productId}
                                                onValueChange={(value) =>
                                                    setProductId(value)
                                                }
                                            >
                                                <SelectTrigger id="product_id">
                                                    <SelectValue placeholder="Select product" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {products.map((product) => (
                                                        <SelectItem
                                                            key={product.id}
                                                            value={String(
                                                                product.id,
                                                            )}
                                                        >
                                                            {product.name}{' '}
                                                            (Stock:{' '}
                                                            {product.stock_qty})
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            {errors['product_id'] && (
                                                <p className="text-sm text-destructive">
                                                    {errors['product_id']}
                                                </p>
                                            )}
                                        </div>

                                        <div className="space-y-1.5">
                                            <Label>Movement Type</Label>
                                            <input
                                                type="hidden"
                                                name="type"
                                                value={type}
                                            />
                                            <div className="flex gap-2">
                                                {(
                                                    [
                                                        'in',
                                                        'out',
                                                        'adjustment',
                                                    ] as const
                                                ).map((mtype) => (
                                                    <button
                                                        key={mtype}
                                                        type="button"
                                                        onClick={() =>
                                                            setType(mtype)
                                                        }
                                                        className={`flex-1 cursor-pointer rounded-lg border px-4 py-2 text-sm font-medium transition-colors duration-150 ${
                                                            type === mtype
                                                                ? 'border-primary bg-primary/10 text-primary'
                                                                : 'border-input text-muted-foreground hover:bg-muted'
                                                        }`}
                                                    >
                                                        {mtype
                                                            .charAt(0)
                                                            .toUpperCase() +
                                                            mtype.slice(1)}
                                                    </button>
                                                ))}
                                            </div>
                                            {errors['type'] && (
                                                <p className="text-sm text-destructive">
                                                    {errors['type']}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <div className="space-y-1.5">
                                            <Label htmlFor="qty">
                                                Quantity
                                            </Label>
                                            <Input
                                                id="qty"
                                                name="qty"
                                                type="number"
                                                min="1"
                                                placeholder="e.g. 10"
                                                defaultValue=""
                                            />
                                            {errors['qty'] && (
                                                <p className="text-sm text-destructive">
                                                    {errors['qty']}
                                                </p>
                                            )}
                                        </div>

                                        <div className="space-y-1.5">
                                            <Label htmlFor="reference">
                                                Reference
                                            </Label>
                                            <Input
                                                id="reference"
                                                name="reference"
                                                placeholder="e.g. PO-001 or Order #1001"
                                                defaultValue=""
                                            />
                                            {errors['reference'] && (
                                                <p className="text-sm text-destructive">
                                                    {errors['reference']}
                                                </p>
                                            )}
                                        </div>

                                        <div className="space-y-1.5">
                                            <Label htmlFor="notes">Notes</Label>
                                            <Textarea
                                                id="notes"
                                                name="notes"
                                                rows={3}
                                                placeholder="Optional notes about this movement"
                                                defaultValue=""
                                            />
                                        </div>
                                    </div>

                                    <div className="pt-4">
                                        <Button
                                            className="w-full"
                                            type="submit"
                                            disabled={processing}
                                        >
                                            {processing
                                                ? 'Recording...'
                                                : 'Record Movement'}
                                        </Button>
                                    </div>
                                </div>
                            </>
                        )}
                    </Form>
                </SheetContent>
            </Sheet>

            {movements.data.length > 0 ? (
                <>
                    <DataGrid columns={columns} data={movements.data} />
                    <Paginator
                        currentPage={movements.current_page}
                        lastPage={movements.last_page}
                        total={movements.total}
                        from={movements.from}
                        to={movements.to}
                    />
                </>
            ) : (
                <EmptyState
                    title="No movements yet"
                    description="Record your first stock movement to start tracking inventory changes."
                    action={
                        <Button size="sm" type="button" onClick={openCreate}>
                            <Plus className="h-4 w-4" />
                            Record Movement
                        </Button>
                    }
                />
            )}
        </>
    );
}
