import { Head, Link } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';

export default function ProductsCreate() {
    const [form, setForm] = useState({
        name: '',
        sku: '',
        description: '',
        price: '',
        cost: '',
        reorder_level: '5',
        category_id: '',
        supplier_id: '',
    });

    const handleChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >,
    ) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    return (
        <>
            <Head title="Create Product" />

            <div className="mb-6 flex items-center gap-4">
                <Button variant="ghost" size="sm" asChild>
                    <Link href="/products">
                        <ArrowLeft className="h-4 w-4" />
                        Back
                    </Link>
                </Button>
                <div>
                    <h1 className="text-xl font-semibold text-foreground">
                        Create Product
                    </h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Add a new product to your catalog.
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
                            value={form.name}
                            onChange={handleChange}
                            className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-ring focus:outline-none"
                            placeholder="e.g. Wireless Mouse"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-foreground">
                            SKU
                        </label>
                        <input
                            type="text"
                            name="sku"
                            value={form.sku}
                            onChange={handleChange}
                            className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-ring focus:outline-none"
                            placeholder="e.g. WM-001"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-foreground">
                            Price
                        </label>
                        <input
                            type="number"
                            name="price"
                            value={form.price}
                            onChange={handleChange}
                            step="0.01"
                            className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-ring focus:outline-none"
                            placeholder="0.00"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-foreground">
                            Cost
                        </label>
                        <input
                            type="number"
                            name="cost"
                            value={form.cost}
                            onChange={handleChange}
                            step="0.01"
                            className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-ring focus:outline-none"
                            placeholder="0.00"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-foreground">
                            Reorder Level
                        </label>
                        <input
                            type="number"
                            name="reorder_level"
                            value={form.reorder_level}
                            onChange={handleChange}
                            className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-ring focus:outline-none"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-foreground">
                            Category
                        </label>
                        <select
                            name="category_id"
                            value={form.category_id}
                            onChange={handleChange}
                            className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground focus:ring-2 focus:ring-ring focus:outline-none"
                        >
                            <option value="">Select category</option>
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
                            value={form.supplier_id}
                            onChange={handleChange}
                            className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground focus:ring-2 focus:ring-ring focus:outline-none"
                        >
                            <option value="">Select supplier</option>
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
                            value={form.description}
                            onChange={handleChange}
                            rows={3}
                            className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-ring focus:outline-none"
                            placeholder="Optional description..."
                        />
                    </div>
                </div>

                <div className="mt-6 flex items-center justify-end gap-2 border-t border-border pt-4">
                    <Button variant="outline" asChild>
                        <Link href="/products">Cancel</Link>
                    </Button>
                    <Button>Save Product</Button>
                </div>
            </div>
        </>
    );
}
