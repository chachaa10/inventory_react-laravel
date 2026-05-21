import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import type { LineItem } from '@/types';

export default function OrdersCreate() {
    const [customer_id, setCustomerId] = useState('');
    const [notes, setNotes] = useState('');
    const [lineItems, setLineItems] = useState<LineItem[]>([
        { id: '1', product_id: '', product_name: '', qty: 1, unit_price: 0 },
    ]);

    const addLine = () => {
        setLineItems((prev) => [
            ...prev,
            {
                id: String(Date.now()),
                product_id: '',
                product_name: '',
                qty: 1,
                unit_price: 0,
            },
        ]);
    };

    const removeLine = (id: string) => {
        setLineItems((prev) => prev.filter((item) => item.id !== id));
    };

    const updateLine = (
        id: string,
        field: keyof LineItem,
        value: string | number,
    ) => {
        setLineItems((prev) =>
            prev.map((item) =>
                item.id === id ? { ...item, [field]: value } : item,
            ),
        );
    };

    const selectProduct = (id: string, productId: string) => {
        const products: Record<string, { name: string; price: number }> = {
            '1': { name: 'Wireless Mouse', price: 29.99 },
            '2': { name: 'Mechanical Keyboard', price: 89.99 },
            '3': { name: 'USB-C Cable', price: 12.99 },
        };
        const product = products[productId];

        if (product) {
            setLineItems((prev) =>
                prev.map((item) =>
                    item.id === id
                        ? {
                              ...item,
                              product_id: productId,
                              product_name: product.name,
                              unit_price: product.price,
                          }
                        : item,
                ),
            );
        }
    };

    const total = lineItems.reduce(
        (sum, item) => sum + item.qty * item.unit_price,
        0,
    );

    return (
        <>
            <Head title="Create Order" />

            <div className="mb-6 flex items-center gap-4">
                <Button variant="ghost" size="sm" asChild>
                    <Link href="/orders">
                        <ArrowLeft className="h-4 w-4" />
                        Back
                    </Link>
                </Button>
                <div>
                    <h1 className="text-xl font-semibold text-foreground">
                        Create Order
                    </h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Create a new sales order for a customer.
                    </p>
                </div>
            </div>

            <div className="max-w-3xl rounded-xl border border-border p-6">
                <div className="space-y-5">
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-foreground">
                            Customer
                        </label>
                        <select
                            value={customer_id}
                            onChange={(e) => setCustomerId(e.target.value)}
                            className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground focus:ring-2 focus:ring-ring focus:outline-none"
                        >
                            <option value="">Select customer</option>
                            <option value="1">Acme Corp</option>
                            <option value="2">Beta Industries</option>
                            <option value="3">Gamma Ltd</option>
                        </select>
                    </div>

                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <label className="text-sm font-medium text-foreground">
                                Line Items
                            </label>
                            <Button variant="ghost" size="sm" onClick={addLine}>
                                <Plus className="h-4 w-4" />
                                Add Item
                            </Button>
                        </div>

                        <div className="overflow-hidden rounded-lg border border-border">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-border bg-muted/50">
                                        <th className="h-9 px-3 text-left text-xs font-medium text-muted-foreground">
                                            Product
                                        </th>
                                        <th className="h-9 w-24 px-3 text-left text-xs font-medium text-muted-foreground">
                                            Qty
                                        </th>
                                        <th className="h-9 w-28 px-3 text-left text-xs font-medium text-muted-foreground">
                                            Unit Price
                                        </th>
                                        <th className="h-9 w-28 px-3 text-right text-xs font-medium text-muted-foreground">
                                            Subtotal
                                        </th>
                                        <th className="h-9 w-10 px-3" />
                                    </tr>
                                </thead>
                                <tbody>
                                    {lineItems.map((item) => (
                                        <tr
                                            key={item.id}
                                            className="border-b border-border last:border-0"
                                        >
                                            <td className="px-3 py-2">
                                                <select
                                                    value={item.product_id}
                                                    onChange={(e) =>
                                                        selectProduct(
                                                            item.id,
                                                            e.target.value,
                                                        )
                                                    }
                                                    className="h-9 w-full rounded-md border border-input bg-background px-2 text-sm text-foreground focus:ring-2 focus:ring-ring focus:outline-none"
                                                >
                                                    <option value="">
                                                        Select product
                                                    </option>
                                                    <option value="1">
                                                        Wireless Mouse
                                                    </option>
                                                    <option value="2">
                                                        Mechanical Keyboard
                                                    </option>
                                                    <option value="3">
                                                        USB-C Cable
                                                    </option>
                                                </select>
                                            </td>
                                            <td className="px-3 py-2">
                                                <input
                                                    type="number"
                                                    min="1"
                                                    value={item.qty}
                                                    onChange={(e) =>
                                                        updateLine(
                                                            item.id,
                                                            'qty',
                                                            parseInt(
                                                                e.target.value,
                                                            ) || 0,
                                                        )
                                                    }
                                                    className="h-9 w-full rounded-md border border-input bg-background px-2 text-sm text-foreground focus:ring-2 focus:ring-ring focus:outline-none"
                                                />
                                            </td>
                                            <td className="px-3 py-2">
                                                <input
                                                    type="number"
                                                    min="0"
                                                    step="0.01"
                                                    value={item.unit_price}
                                                    readOnly
                                                    className="h-9 w-full rounded-md border border-input bg-background px-2 text-sm text-muted-foreground"
                                                />
                                            </td>
                                            <td className="px-3 py-2 text-right text-foreground">
                                                $
                                                {(
                                                    item.qty * item.unit_price
                                                ).toFixed(2)}
                                            </td>
                                            <td className="px-3 py-2">
                                                <Button
                                                    variant="ghost"
                                                    size="xs"
                                                    onClick={() =>
                                                        removeLine(item.id)
                                                    }
                                                    disabled={
                                                        lineItems.length === 1
                                                    }
                                                >
                                                    <Trash2 className="h-3.5 w-3.5 text-destructive" />
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                                <tfoot>
                                    <tr className="border-t border-border">
                                        <td
                                            colSpan={3}
                                            className="px-3 py-2 text-right text-sm font-semibold text-foreground"
                                        >
                                            Total
                                        </td>
                                        <td className="px-3 py-2 text-right text-sm font-semibold text-foreground">
                                            ${total.toFixed(2)}
                                        </td>
                                        <td />
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-foreground">
                            Notes (optional)
                        </label>
                        <textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            rows={2}
                            className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus:ring-2 focus:ring-ring focus:outline-none"
                            placeholder="Order notes..."
                        />
                    </div>
                </div>

                <div className="mt-6 flex items-center justify-end gap-2 border-t border-border pt-4">
                    <Button variant="outline" asChild>
                        <Link href="/orders">Cancel</Link>
                    </Button>
                    <Button>Create Order</Button>
                </div>
            </div>
        </>
    );
}
