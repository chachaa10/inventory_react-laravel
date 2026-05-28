import { Form, Head, Link } from '@inertiajs/react';
import { ArrowLeft, ShoppingCart } from 'lucide-react';
import { useState } from 'react';

import { update } from '@/actions/App/Http/Controllers/OrderController';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import type { Order } from '@/types';

type OrdersEditProps = {
    order: Order;
};

const statusColors: Record<string, string> = {
    completed:
        'bg-green-50 text-green-700 ring-1 ring-inset ring-green-600/20 dark:bg-green-950/30 dark:text-green-400 dark:ring-green-400/20',
    cancelled:
        'bg-red-50 text-red-700 ring-1 ring-inset ring-red-600/20 dark:bg-red-950/30 dark:text-red-400 dark:ring-red-400/20',
};

export default function OrdersEdit({ order }: OrdersEditProps) {
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
                        {order.customer_name} ·{' '}
                        {new Date(order.created_at).toLocaleDateString()}
                    </p>
                </div>
                <span
                    className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium ${statusColors[order.status]}`}
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
                                    {order.items?.map((item) => (
                                        <tr
                                            key={item.id}
                                            className="border-b border-border last:border-0 hover:bg-muted/50"
                                        >
                                            <td className="h-12 px-4 text-foreground">
                                                {item.product?.name ??
                                                    `Product #${item.product_id}`}
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
                                    {order.customer_name}
                                </dd>
                            </div>
                            {order.customer_email && (
                                <div className="flex justify-between">
                                    <dt className="text-muted-foreground">
                                        Email
                                    </dt>
                                    <dd className="text-foreground">
                                        {order.customer_email}
                                    </dd>
                                </div>
                            )}
                            <div className="flex justify-between">
                                <dt className="text-muted-foreground">Date</dt>
                                <dd className="text-foreground">
                                    {new Date(
                                        order.created_at,
                                    ).toLocaleDateString()}
                                </dd>
                            </div>
                            <div className="flex justify-between">
                                <dt className="text-muted-foreground">Items</dt>
                                <dd className="text-foreground">
                                    {order.items?.length ?? order.items_count}
                                </dd>
                            </div>
                            <div className="flex justify-between">
                                <dt className="text-muted-foreground">
                                    Created by
                                </dt>
                                <dd className="text-foreground">
                                    {order.user.name}
                                </dd>
                            </div>
                        </dl>
                    </div>

                    {order.status === 'completed' && (
                        <Button
                            variant="destructive"
                            className="w-full"
                            onClick={() => setShowCancel(true)}
                        >
                            Cancel Order
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

            <Dialog
                open={showCancel}
                onOpenChange={(open) => {
                    if (!open) {
                        setShowCancel(false);
                    }
                }}
            >
                <DialogContent showCloseButton={false} className="sm:max-w-sm">
                    <Form
                        {...update.form(order.id)}
                        key={order.id}
                        onSuccess={() => setShowCancel(false)}
                    >
                        {({ processing }) => (
                            <>
                                <DialogHeader>
                                    <DialogTitle>Cancel Order</DialogTitle>
                                    <DialogDescription>
                                        Are you sure? Stock will be restored and
                                        the order will be marked as cancelled.
                                        This action cannot be undone.
                                    </DialogDescription>
                                </DialogHeader>
                                <DialogFooter>
                                    <Button
                                        variant="outline"
                                        onClick={() => setShowCancel(false)}
                                    >
                                        Keep Order
                                    </Button>
                                    <Button
                                        variant="destructive"
                                        type="submit"
                                        disabled={processing}
                                    >
                                        {processing
                                            ? 'Cancelling...'
                                            : 'Cancel Order'}
                                    </Button>
                                </DialogFooter>
                            </>
                        )}
                    </Form>
                </DialogContent>
            </Dialog>
        </>
    );
}
