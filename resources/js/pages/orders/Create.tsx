import { Form, Head, Link } from '@inertiajs/react';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';

import { store } from '@/actions/App/Http/Controllers/OrderController';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useOrderForm } from '@/hooks/use-order-form';
import type { ProductOption } from '@/types';

type OrdersCreateProps = {
    products: ProductOption[];
};

export default function OrdersCreate({ products }: OrdersCreateProps) {
    const {
        lineItems,
        addLine,
        removeLine,
        selectProduct,
        updateQty,
        total,
        serializeItems,
        hasValidItems,
    } = useOrderForm(products);

    return (
        <>
            <Head title="Create Order" />

            <div className="mb-6 flex items-center gap-4">
                <Button variant="ghost" size="sm" type="button" asChild>
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

            <div className="max-w-3xl">
                <Form
                    {...store.form()}
                    onSuccess={() => {
                        /* redirected by server */
                    }}
                >
                    {({ processing, errors }) => (
                        <div className="space-y-6 rounded-xl border border-border p-6">
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-1.5">
                                    <Label htmlFor="customer_name">
                                        Customer Name
                                    </Label>
                                    <Input
                                        id="customer_name"
                                        name="customer_name"
                                        placeholder="e.g. John Doe"
                                    />
                                    {errors['customer_name'] && (
                                        <p className="text-sm text-destructive">
                                            {errors['customer_name']}
                                        </p>
                                    )}
                                </div>
                                <div className="space-y-1.5">
                                    <Label htmlFor="customer_email">
                                        Customer Email
                                    </Label>
                                    <Input
                                        id="customer_email"
                                        name="customer_email"
                                        type="email"
                                        placeholder="john@example.com"
                                    />
                                    {errors['customer_email'] && (
                                        <p className="text-sm text-destructive">
                                            {errors['customer_email']}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <Label>Line Items</Label>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        type="button"
                                        onClick={addLine}
                                    >
                                        <Plus className="h-4 w-4" />
                                        Add Item
                                    </Button>
                                </div>

                                <input
                                    type="hidden"
                                    name="items"
                                    value={serializeItems()}
                                />

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
                                                            value={
                                                                item.product_id ||
                                                                ''
                                                            }
                                                            onChange={(e) => {
                                                                const val =
                                                                    e.target
                                                                        .value;

                                                                if (val) {
                                                                    selectProduct(
                                                                        item.id,
                                                                        Number(
                                                                            val,
                                                                        ),
                                                                    );
                                                                }
                                                            }}
                                                            className="h-9 w-full rounded-md border border-input bg-background px-2 text-sm text-foreground focus:ring-2 focus:ring-ring focus:outline-none"
                                                        >
                                                            <option value="">
                                                                Select product
                                                            </option>
                                                            {products.map(
                                                                (p) => (
                                                                    <option
                                                                        key={
                                                                            p.id
                                                                        }
                                                                        value={
                                                                            p.id
                                                                        }
                                                                    >
                                                                        {p.name}{' '}
                                                                        (Stock:{' '}
                                                                        {
                                                                            p.stock_qty
                                                                        }
                                                                        )
                                                                    </option>
                                                                ),
                                                            )}
                                                        </select>
                                                    </td>
                                                    <td className="px-3 py-2">
                                                        <input
                                                            type="number"
                                                            min="1"
                                                            value={item.qty}
                                                            onChange={(e) =>
                                                                updateQty(
                                                                    item.id,
                                                                    parseInt(
                                                                        e.target
                                                                            .value,
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
                                                            value={
                                                                item.unit_price
                                                            }
                                                            readOnly
                                                            className="h-9 w-full rounded-md border border-input bg-background px-2 text-sm text-muted-foreground"
                                                        />
                                                    </td>
                                                    <td className="px-3 py-2 text-right text-foreground">
                                                        $
                                                        {(
                                                            item.qty *
                                                            item.unit_price
                                                        ).toFixed(2)}
                                                    </td>
                                                    <td className="px-3 py-2">
                                                        <Button
                                                            variant="ghost"
                                                            size="xs"
                                                            type="button"
                                                            onClick={() =>
                                                                removeLine(
                                                                    item.id,
                                                                )
                                                            }
                                                            disabled={
                                                                lineItems.length ===
                                                                1
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

                                {errors['items'] && (
                                    <p className="text-sm text-destructive">
                                        {errors['items']}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="notes">Notes</Label>
                                <Textarea
                                    id="notes"
                                    name="notes"
                                    rows={2}
                                    placeholder="Optional order notes..."
                                />
                                {errors['notes'] && (
                                    <p className="text-sm text-destructive">
                                        {errors['notes']}
                                    </p>
                                )}
                            </div>

                            <div className="flex items-center justify-end gap-2 border-t border-border pt-4">
                                <Button variant="outline" type="button" asChild>
                                    <Link href="/orders">Cancel</Link>
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={processing || !hasValidItems}
                                >
                                    {processing
                                        ? 'Creating...'
                                        : 'Create Order'}
                                </Button>
                            </div>
                        </div>
                    )}
                </Form>
            </div>
        </>
    );
}
