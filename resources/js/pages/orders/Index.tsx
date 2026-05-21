import { Head, Link } from '@inertiajs/react';
import type { ColumnDef } from '@tanstack/react-table';
import { Plus, ShoppingCart } from 'lucide-react';
import { useState } from 'react';

import { DataGrid } from '@/common/DataGrid';
import { SearchBar } from '@/common/SearchBar';
import { Button } from '@/components/ui/button';
import type { Order } from '@/types';

const sampleData: Order[] = [
    {
        id: 1,
        order_number: 'ORD-1001',
        customer: 'Acme Corp',
        status: 'completed',
        total: 149.95,
        items: 3,
        date: 'Today',
    },
    {
        id: 2,
        order_number: 'ORD-1002',
        customer: 'Beta Industries',
        status: 'pending',
        total: 89.99,
        items: 1,
        date: 'Today',
    },
    {
        id: 3,
        order_number: 'ORD-1003',
        customer: 'Gamma Ltd',
        status: 'pending',
        total: 234.5,
        items: 5,
        date: 'Yesterday',
    },
    {
        id: 4,
        order_number: 'ORD-1004',
        customer: 'Acme Corp',
        status: 'cancelled',
        total: 45.0,
        items: 2,
        date: '2 days ago',
    },
    {
        id: 5,
        order_number: 'ORD-1005',
        customer: 'Beta Industries',
        status: 'completed',
        total: 678.0,
        items: 8,
        date: '3 days ago',
    },
];

const statusColors = {
    pending:
        'bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-600/20 dark:bg-amber-950/30 dark:text-amber-400 dark:ring-amber-400/20',
    completed:
        'bg-green-50 text-green-700 ring-1 ring-inset ring-green-600/20 dark:bg-green-950/30 dark:text-green-400 dark:ring-green-400/20',
    cancelled:
        'bg-red-50 text-red-700 ring-1 ring-inset ring-red-600/20 dark:bg-red-950/30 dark:text-red-400 dark:ring-red-400/20',
};

const columns: ColumnDef<Order>[] = [
    { accessorKey: 'order_number', header: 'Order', enableSorting: true },
    { accessorKey: 'customer', header: 'Customer', enableSorting: true },
    {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => (
            <span
                className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${statusColors[row.original.status]}`}
            >
                <ShoppingCart className="mr-1 h-3 w-3" />
                {row.original.status.charAt(0).toUpperCase() +
                    row.original.status.slice(1)}
            </span>
        ),
    },
    {
        accessorKey: 'items',
        header: 'Items',
        cell: ({ row }) => `${row.original.items} items`,
    },
    {
        accessorKey: 'total',
        header: 'Total',
        enableSorting: true,
        cell: ({ row }) => `$${row.original.total.toFixed(2)}`,
    },
    { accessorKey: 'date', header: 'Date', enableSorting: true },
    {
        id: 'actions',
        header: '',
        cell: ({ row }) => (
            <Link
                href={`/orders/${row.original.id}`}
                className="text-sm text-muted-foreground hover:text-foreground"
            >
                View
            </Link>
        ),
    },
];

export default function OrdersIndex() {
    const [search, setSearch] = useState('');

    const filtered = sampleData.filter(
        (o) =>
            o.order_number.toLowerCase().includes(search.toLowerCase()) ||
            o.customer.toLowerCase().includes(search.toLowerCase()),
    );

    return (
        <>
            <Head title="Orders" />

            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-semibold text-foreground">
                        Orders
                    </h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Manage sales orders.
                    </p>
                </div>
                <Button size="sm" asChild>
                    <Link href="/orders/create">
                        <Plus className="h-4 w-4" />
                        New Order
                    </Link>
                </Button>
            </div>

            <div className="mb-4 max-w-sm">
                <SearchBar
                    value={search}
                    onChange={setSearch}
                    placeholder="Search by order number or customer..."
                />
            </div>

            <DataGrid columns={columns} data={filtered} />
        </>
    );
}
