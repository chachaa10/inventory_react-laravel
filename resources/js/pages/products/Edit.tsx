import { Head, Link } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';

export default function ProductsEdit() {
    const [form] = useState({
        name: 'Wireless Mouse',
        sku: 'WM-001',
        description: 'Ergonomic wireless mouse with USB-C charging.',
        price: '29.99',
        cost: '18.50',
        reorder_level: '10',
        stock_qty: 3,
        category_id: '1',
        supplier_id: '1',
    });

    return (
        <>
            <Head title="Edit Product" />

            <div className="mb-6 flex items-center gap-4">
                <Button variant="ghost" size="sm" asChild>
                    <Link href="/products">
                        <ArrowLeft className="h-4 w-4" />
                        Back
                    </Link>
                </Button>
                <div>
                    <h1 className="text-xl font-semibold text-foreground">
                        Edit Product
                    </h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Update product information.
                    </p>
                </div>
            </div>

            <div className="max-w-2xl rounded-xl border border-border p-6">
                <div className="grid gap-5 sm:grid-cols-2">
                    <div className="space-y-1.5 sm:col-span-2">
                        <label className="text-sm font-medium text-foreground">
                            Product Name
                        </label>
                        <input
                            type="text"
                            name="name"
                            defaultValue={form.name}
                            className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground focus:ring-2 focus:ring-ring focus:outline-none"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-foreground">
                            SKU
                        </label>
                        <input
                            type="text"
                            name="sku"
                            defaultValue={form.sku}
                            className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground focus:ring-2 focus:ring-ring focus:outline-none"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-foreground">
                            Price
                        </label>
                        <input
                            type="number"
                            name="price"
                            defaultValue={form.price}
                            step="0.01"
                            className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground focus:ring-2 focus:ring-ring focus:outline-none"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-foreground">
                            Cost
                        </label>
                        <input
                            type="number"
                            name="cost"
                            defaultValue={form.cost}
                            step="0.01"
                            className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground focus:ring-2 focus:ring-ring focus:outline-none"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-foreground">
                            Stock Quantity
                        </label>
                        <input
                            type="number"
                            name="stock_qty"
                            defaultValue={form.stock_qty}
                            className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground focus:ring-2 focus:ring-ring focus:outline-none"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-foreground">
                            Reorder Level
                        </label>
                        <input
                            type="number"
                            name="reorder_level"
                            defaultValue={form.reorder_level}
                            className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground focus:ring-2 focus:ring-ring focus:outline-none"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-foreground">
                            Category
                        </label>
                        <select
                            name="category_id"
                            defaultValue={form.category_id}
                            className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground focus:ring-2 focus:ring-ring focus:outline-none"
                        >
                            <option value="1">Electronics</option>
                            <option value="2">Office Supplies</option>
                            <option value="3">Clothing</option>
                        </select>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-foreground">
                            Supplier
                        </label>
                        <select
                            name="supplier_id"
                            defaultValue={form.supplier_id}
                            className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground focus:ring-2 focus:ring-ring focus:outline-none"
                        >
                            <option value="1">TechSupply Co.</option>
                            <option value="2">OfficeWorld</option>
                        </select>
                    </div>

                    <div className="space-y-1.5 sm:col-span-2">
                        <label className="text-sm font-medium text-foreground">
                            Description
                        </label>
                        <textarea
                            name="description"
                            defaultValue={form.description}
                            rows={3}
                            className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus:ring-2 focus:ring-ring focus:outline-none"
                        />
                    </div>
                </div>

                <div className="mt-6 flex items-center justify-between border-t border-border pt-4">
                    <Button variant="destructive" size="sm">
                        Delete Product
                    </Button>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" asChild>
                            <Link href="/products">Cancel</Link>
                        </Button>
                        <Button>Update Product</Button>
                    </div>
                </div>
            </div>
        </>
    );
}
