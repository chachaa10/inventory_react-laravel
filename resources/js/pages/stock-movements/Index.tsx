import { Head, router } from '@inertiajs/react';
import type { ColumnDef, Row } from '@tanstack/react-table';
import { ArrowLeftRight, Plus } from 'lucide-react';

import { create } from '@/actions/App/Http/Controllers/StockMovementController';
import { DataGrid } from '@/common/DataGrid';
import { EmptyState } from '@/common/EmptyState';
import { Paginator } from '@/common/Paginator';
import { Button } from '@/components/ui/button';
import type { Paginated, StockMovement } from '@/types';

type StockMovementsIndexProps = {
    movements: Paginated<StockMovement>;
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
        accessorFn: (row) => row.product?.name,
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
}: StockMovementsIndexProps) {
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
                <Button size="sm" onClick={() => router.visit(create().url)}>
                    <Plus className="h-4 w-4" />
                    Record Movement
                </Button>
            </div>

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
                        <Button
                            size="sm"
                            onClick={() => router.visit(create().url)}
                        >
                            <Plus className="h-4 w-4" />
                            Record Movement
                        </Button>
                    }
                />
            )}
        </>
    );
}
