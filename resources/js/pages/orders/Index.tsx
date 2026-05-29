import { Head, Link, router } from '@inertiajs/react';
import type { ColumnDef } from '@tanstack/react-table';
import { Plus, ShoppingCart } from 'lucide-react';

import { DataGrid } from '@/common/DataGrid';
import { EmptyState } from '@/common/EmptyState';
import { Paginator } from '@/common/Paginator';
import { SearchBar } from '@/common/SearchBar';
import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import type { Order, OrderFilters, Paginated } from '@/types';

type OrdersIndexProps = {
    orders: Paginated<Order>;
    filters: OrderFilters;
};

function visit(url: string) {
    router.visit(url, { preserveState: true, preserveScroll: true });
}

function formatCurrency(value: number): string {
    return `$${value.toFixed(2)}`;
}

const statusColors: Record<string, string> = {
    completed:
        'bg-green-50 text-green-700 ring-1 ring-inset ring-green-600/20 dark:bg-green-950/30 dark:text-green-400 dark:ring-green-400/20',
    cancelled:
        'bg-red-50 text-red-700 ring-1 ring-inset ring-red-600/20 dark:bg-red-950/30 dark:text-red-400 dark:ring-red-400/20',
};

function StatusCell({ row }: { row: { original: Order } }) {
    return (
        <span
            className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${statusColors[row.original.status]}`}
        >
            <ShoppingCart className="mr-1 h-3 w-3" />
            {row.original.status.charAt(0).toUpperCase() +
                row.original.status.slice(1)}
        </span>
    );
}

function TotalCell({ row }: { row: { original: Order } }) {
    return formatCurrency(row.original.total);
}

function ItemsCell({ row }: { row: { original: Order } }) {
    return `${row.original.items_count} items`;
}

function DateCell({ row }: { row: { original: Order } }) {
    return new Date(row.original.created_at).toLocaleDateString();
}

function ActionsCell({ row }: { row: { original: Order } }) {
    return (
        <Link
            href={`/orders/${row.original.id}`}
            className="text-sm text-muted-foreground hover:text-foreground"
        >
            View
        </Link>
    );
}

export default function OrdersIndex({ orders, filters }: OrdersIndexProps) {
    function applyFilters(overrides: Partial<OrderFilters>) {
        const params = new URLSearchParams();

        const merged = { ...filters, ...overrides };

        Object.entries(merged).forEach(([key, value]) => {
            if (value) {
                params.set(key, value);
            }
        });

        visit(`/orders?${params.toString()}`);
    }

    const columns: ColumnDef<Order>[] = [
        {
            accessorKey: 'order_number',
            header: 'Order',
            enableSorting: true,
        },
        {
            accessorKey: 'customer_name',
            header: 'Customer',
            enableSorting: true,
        },
        {
            accessorKey: 'status',
            header: 'Status',
            cell: StatusCell,
        },
        {
            id: 'items_count',
            header: 'Items',
            cell: ItemsCell,
        },
        {
            accessorKey: 'total',
            header: 'Total',
            enableSorting: true,
            cell: TotalCell,
        },
        {
            accessorKey: 'created_at',
            header: 'Date',
            enableSorting: true,
            cell: DateCell,
        },
        {
            id: 'actions',
            header: '',
            cell: ActionsCell,
        },
    ];

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
                <Button size="sm" type="button" asChild>
                    <Link href="/orders/create">
                        <Plus className="h-4 w-4" />
                        New Order
                    </Link>
                </Button>
            </div>

            <div className="mb-4 flex flex-wrap items-center gap-3">
                <div className="w-full max-w-sm sm:w-64">
                    <SearchBar
                        value={filters.search ?? ''}
                        onChange={(v) => applyFilters({ search: v })}
                        placeholder="Search by order number or customer..."
                    />
                </div>
                <Select
                    value={filters.status || 'all'}
                    onValueChange={(v) =>
                        applyFilters({ status: v === 'all' ? '' : v })
                    }
                >
                    <SelectTrigger className="w-40">
                        <SelectValue placeholder="All Status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {orders.data.length > 0 ? (
                <>
                    <DataGrid columns={columns} data={orders.data} />
                    <Paginator
                        currentPage={orders.current_page}
                        lastPage={orders.last_page}
                        total={orders.total}
                        from={orders.from}
                        to={orders.to}
                    />
                </>
            ) : (
                <EmptyState
                    title="No orders found"
                    description={
                        filters.search || filters.status
                            ? 'No orders match your filters. Try different search terms.'
                            : 'Create your first order to get started.'
                    }
                    action={
                        !filters.search && !filters.status ? (
                            <Button size="sm" type="button" asChild>
                                <Link href="/orders/create">
                                    <Plus className="h-4 w-4" />
                                    New Order
                                </Link>
                            </Button>
                        ) : undefined
                    }
                />
            )}
        </>
    );
}
