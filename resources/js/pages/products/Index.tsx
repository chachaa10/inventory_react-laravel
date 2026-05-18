import { Head, Link } from '@inertiajs/react';
import type { ColumnDef } from '@tanstack/react-table';
import { Download, Plus } from 'lucide-react';
import { useState } from 'react';

import { DataGrid } from '@/common/DataGrid';
import { EmptyState } from '@/common/EmptyState';
import { SearchBar } from '@/common/SearchBar';
import { StatusBadge } from '@/common/StatusBadge';
import { Button } from '@/components/ui/button';

type Product = {
    id: number;
    name: string;
    sku: string;
    category: string;
    stock_qty: number;
    reorder_level: number;
    price: number;
};

const sampleData: Product[] = [
    {
        id: 1,
        name: 'Wireless Mouse',
        sku: 'WM-001',
        category: 'Electronics',
        stock_qty: 3,
        reorder_level: 10,
        price: 29.99,
    },
    {
        id: 2,
        name: 'Mechanical Keyboard',
        sku: 'MK-002',
        category: 'Electronics',
        stock_qty: 45,
        reorder_level: 10,
        price: 89.99,
    },
    {
        id: 3,
        name: 'USB-C Cable 2m',
        sku: 'UC-003',
        category: 'Electronics',
        stock_qty: 120,
        reorder_level: 20,
        price: 12.99,
    },
    {
        id: 4,
        name: 'Notebook A5',
        sku: 'NB-004',
        category: 'Office Supplies',
        stock_qty: 200,
        reorder_level: 50,
        price: 4.99,
    },
    {
        id: 5,
        name: 'Desk Lamp',
        sku: 'DL-005',
        category: 'Office Supplies',
        stock_qty: 8,
        reorder_level: 15,
        price: 34.99,
    },
];

const columns: ColumnDef<Product>[] = [
    {
        accessorKey: 'name',
        header: 'Name',
        enableSorting: true,
    },
    {
        accessorKey: 'sku',
        header: 'SKU',
    },
    {
        accessorKey: 'category',
        header: 'Category',
    },
    {
        accessorKey: 'stock_qty',
        header: 'Stock',
        enableSorting: true,
        cell: ({ row }) => (
            <StatusBadge
                stockQty={row.original.stock_qty}
                reorderLevel={row.original.reorder_level}
            />
        ),
    },
    {
        accessorKey: 'price',
        header: 'Price',
        enableSorting: true,
        cell: ({ row }) => `$${row.original.price.toFixed(2)}`,
    },
    {
        id: 'actions',
        header: '',
        cell: ({ row }) => (
            <Link
                href={`/products/${row.original.id}`}
                className="text-sm text-muted-foreground hover:text-foreground"
            >
                Edit
            </Link>
        ),
    },
];

export default function ProductsIndex() {
    const [search, setSearch] = useState('');

    const filtered = sampleData.filter(
        (p) =>
            p.name.toLowerCase().includes(search.toLowerCase()) ||
            p.sku.toLowerCase().includes(search.toLowerCase()),
    );

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
                    <Button variant="ghost" size="sm">
                        <Download className="h-4 w-4" />
                        Export
                    </Button>
                    <Button size="sm" asChild>
                        <Link href="/products/create">
                            <Plus className="h-4 w-4" />
                            Add Product
                        </Link>
                    </Button>
                </div>
            </div>

            <div className="mb-4 max-w-sm">
                <SearchBar
                    value={search}
                    onChange={setSearch}
                    placeholder="Search by name or SKU..."
                />
            </div>

            {filtered.length > 0 ? (
                <DataGrid columns={columns} data={filtered} />
            ) : (
                <EmptyState
                    title="No products found"
                    description={
                        search
                            ? `No products matching "${search}". Try a different search term.`
                            : 'Get started by adding your first product to the catalog.'
                    }
                    action={
                        !search ? (
                            <Button size="sm" asChild>
                                <Link href="/products/create">
                                    <Plus className="h-4 w-4" />
                                    Add Product
                                </Link>
                            </Button>
                        ) : null
                    }
                />
            )}
        </>
    );
}
