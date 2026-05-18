import { Head, Link } from '@inertiajs/react';
import type { ColumnDef } from '@tanstack/react-table';
import { ArrowLeftRight, Plus } from 'lucide-react';
import { useState } from 'react';

import { DataGrid } from '@/common/DataGrid';
import { SearchBar } from '@/common/SearchBar';
import { Button } from '@/components/ui/button';

type StockMovement = {
    id: number;
    product: string;
    type: 'in' | 'out' | 'adjustment';
    qty: number;
    reference: string | null;
    user: string;
    date: string;
};

const sampleData: StockMovement[] = [
    {
        id: 1,
        product: 'Wireless Mouse',
        type: 'out',
        qty: 5,
        reference: 'Order #1001',
        user: 'John Doe',
        date: '2 hours ago',
    },
    {
        id: 2,
        product: 'USB-C Cable',
        type: 'in',
        qty: 50,
        reference: 'PO-001',
        user: 'John Doe',
        date: '4 hours ago',
    },
    {
        id: 3,
        product: 'Desk Lamp',
        type: 'adjustment',
        qty: -2,
        reference: null,
        user: 'Jane Smith',
        date: '1 day ago',
    },
    {
        id: 4,
        product: 'Notebook A5',
        type: 'out',
        qty: 20,
        reference: 'Order #1002',
        user: 'John Doe',
        date: '1 day ago',
    },
    {
        id: 5,
        product: 'Mechanical Keyboard',
        type: 'in',
        qty: 15,
        reference: 'PO-002',
        user: 'Jane Smith',
        date: '2 days ago',
    },
];

const columns: ColumnDef<StockMovement>[] = [
    { accessorKey: 'product', header: 'Product', enableSorting: true },
    {
        accessorKey: 'type',
        header: 'Type',
        cell: ({ row }) => {
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
        },
    },
    { accessorKey: 'qty', header: 'Qty', enableSorting: true },
    {
        accessorKey: 'reference',
        header: 'Reference',
        cell: ({ row }) => row.original.reference ?? '-',
    },
    { accessorKey: 'user', header: 'Recorded By' },
    { accessorKey: 'date', header: 'Date', enableSorting: true },
];

export default function StockMovementsIndex() {
    const [search, setSearch] = useState('');

    const filtered = sampleData.filter(
        (m) =>
            m.product.toLowerCase().includes(search.toLowerCase()) ||
            (m.reference &&
                m.reference.toLowerCase().includes(search.toLowerCase())),
    );

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
                <Button size="sm" asChild>
                    <Link href="/stock-movements/create">
                        <Plus className="h-4 w-4" />
                        Record Movement
                    </Link>
                </Button>
            </div>

            <div className="mb-4 max-w-sm">
                <SearchBar
                    value={search}
                    onChange={setSearch}
                    placeholder="Search by product or reference..."
                />
            </div>

            <DataGrid columns={columns} data={filtered} />
        </>
    );
}
