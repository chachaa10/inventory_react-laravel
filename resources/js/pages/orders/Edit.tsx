import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, ShoppingCart } from 'lucide-react';
import { useState } from 'react';

import { ConfirmDialog } from '@/common/ConfirmDialog';
import { Button } from '@/components/ui/button';

type OrderStatus = 'pending' | 'completed' | 'cancelled';

const order: {
    id: number;
    order_number: string;
    customer: string;
    status: OrderStatus;
    total: number;
    notes: string;
    date: string;
    items: Array<{
        product: string;
        qty: number;
        unit_price: number;
        subtotal: number;
    }>;
} = {
    id: 1,
    order_number: 'ORD-1001',
    customer: 'Acme Corp',
    status: 'pending',
    total: 149.95,
    notes: 'Handle with care.',
    date: '2026-05-18',
    items: [
        {
            product: 'Wireless Mouse',
            qty: 3,
            unit_price: 29.99,
            subtotal: 89.97,
        },
        { product: 'USB-C Cable', qty: 5, unit_price: 12.99, subtotal: 64.95 },
    ],
};

export default function OrdersEdit() {
    const [showCancel, setShowCancel] = useState(false);

    return (
        <>
            <Head title={`Order ${order.order_number}`} />

            <div className="mb-6 flex items-center gap-4">
                <Button variant="ghost" size="sm" asChild>
                    <Link href="/orders">
                        <ArrowLeft className="h-4 w-4" />
                        Back
                    </Link>
                </Button>
                <div className="flex-1">
                    <h1 className="text-xl font-semibold text-foreground">
                        Order {order.order_number}
                    </h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        {order.customer} · {order.date}
                    </p>
                </div>
                <span
                    className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium ${
                        order.status === 'pending'
                            ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400'
                            : order.status === 'completed'
                              ? 'bg-green-50 text-green-700 dark:bg-green-950/30 dark:text-green-400'
                              : 'bg-red-50 text-red-700 dark:bg-red-950/30 dark:text-red-400'
                    }`}
                >
                    <ShoppingCart className="h-3 w-3" />
                    {order.status.charAt(0).toUpperCase() +
                        order.status.slice(1)}
                </span>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2">
                    <div className="rounded-xl border border-border">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-border">
                                        <th className="h-10 px-4 text-left text-xs font-medium text-muted-foreground">
                                            Product
                                        </th>
                                        <th className="h-10 w-20 px-4 text-left text-xs font-medium text-muted-foreground">
                                            Qty
                                        </th>
                                        <th className="h-10 w-28 px-4 text-left text-xs font-medium text-muted-foreground">
                                            Unit Price
                                        </th>
                                        <th className="h-10 w-28 px-4 text-right text-xs font-medium text-muted-foreground">
                                            Subtotal
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {order.items.map((item, i) => (
                                        <tr
                                            key={i}
                                            className="border-b border-border last:border-0 hover:bg-muted/50"
                                        >
                                            <td className="h-12 px-4 text-foreground">
                                                {item.product}
                                            </td>
                                            <td className="h-12 px-4 text-foreground">
                                                {item.qty}
                                            </td>
                                            <td className="h-12 px-4 text-foreground">
                                                ${item.unit_price.toFixed(2)}
                                            </td>
                                            <td className="h-12 px-4 text-right text-foreground">
                                                ${item.subtotal.toFixed(2)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                                <tfoot>
                                    <tr className="border-t border-border">
                                        <td
                                            colSpan={3}
                                            className="px-4 py-3 text-right text-sm font-semibold text-foreground"
                                        >
                                            Total
                                        </td>
                                        <td className="px-4 py-3 text-right text-sm font-semibold text-foreground">
                                            ${order.total.toFixed(2)}
                                        </td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="rounded-xl border border-border p-4">
                        <h3 className="mb-3 text-sm font-semibold text-foreground">
                            Order Details
                        </h3>
                        <dl className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <dt className="text-muted-foreground">
                                    Status
                                </dt>
                                <dd className="text-foreground">
                                    {order.status}
                                </dd>
                            </div>
                            <div className="flex justify-between">
                                <dt className="text-muted-foreground">
                                    Customer
                                </dt>
                                <dd className="text-foreground">
                                    {order.customer}
                                </dd>
                            </div>
                            <div className="flex justify-between">
                                <dt className="text-muted-foreground">Date</dt>
                                <dd className="text-foreground">
                                    {order.date}
                                </dd>
                            </div>
                            <div className="flex justify-between">
                                <dt className="text-muted-foreground">Items</dt>
                                <dd className="text-foreground">
                                    {order.items.length}
                                </dd>
                            </div>
                        </dl>
                    </div>

                    {order.status !== 'cancelled' && (
                        <Button
                            variant={
                                order.status === 'pending'
                                    ? 'destructive'
                                    : 'outline'
                            }
                            className="w-full"
                            onClick={() => setShowCancel(true)}
                        >
                            {order.status === 'pending'
                                ? 'Cancel Order'
                                : 'Restore Order'}
                        </Button>
                    )}
                </div>
            </div>

            {order.notes && (
                <div className="mt-6 rounded-xl border border-border p-4">
                    <h3 className="mb-1 text-sm font-semibold text-foreground">
                        Notes
                    </h3>
                    <p className="text-sm text-muted-foreground">
                        {order.notes}
                    </p>
                </div>
            )}

            <ConfirmDialog
                open={showCancel}
                onOpenChange={setShowCancel}
                onConfirm={() => setShowCancel(false)}
                title="Cancel Order"
                description="Are you sure? Stock will be restored and the order will be marked as cancelled. This action cannot be undone."
                confirmLabel="Cancel Order"
                destructive
            />
        </>
    );
}
