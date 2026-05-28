import { Form, Head } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import { useState } from 'react';

import {
    index,
    store,
} from '@/actions/App/Http/Controllers/StockMovementController';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import type { ProductOption } from '@/types';

type StockMovementsCreateProps = {
    products: ProductOption[];
};

export default function StockMovementsCreate({
    products,
}: StockMovementsCreateProps) {
    const [productId, setProductId] = useState('');
    const [type, setType] = useState('in');

    return (
        <>
            <Head title="Record Movement" />

            <div className="mb-6 flex items-center gap-4">
                <Button variant="ghost" size="sm" asChild>
                    <a href={index().url}>
                        <ArrowLeft className="h-4 w-4" />
                        Back
                    </a>
                </Button>
                <div>
                    <h1 className="text-xl font-semibold text-foreground">
                        Record Stock Movement
                    </h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Adjust inventory quantities.
                    </p>
                </div>
            </div>

            <div className="max-w-xl rounded-xl border border-border p-6">
                <Form {...store.form()}>
                    {({ processing, errors }) => (
                        <div className="space-y-5">
                            <div className="space-y-1.5">
                                <Label htmlFor="product_id">Product</Label>
                                <input
                                    type="hidden"
                                    name="product_id"
                                    value={productId}
                                />
                                <Select
                                    value={productId}
                                    onValueChange={(value) =>
                                        setProductId(value)
                                    }
                                >
                                    <SelectTrigger id="product_id">
                                        <SelectValue placeholder="Select product" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {products.map((product) => (
                                            <SelectItem
                                                key={product.id}
                                                value={String(product.id)}
                                            >
                                                {product.name} (Stock:{' '}
                                                {product.stock_qty})
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors['product_id'] && (
                                    <p className="text-sm text-destructive">
                                        {errors['product_id']}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-1.5">
                                <Label>Movement Type</Label>
                                <input type="hidden" name="type" value={type} />
                                <div className="flex gap-2">
                                    {(['in', 'out', 'adjustment'] as const).map(
                                        (mtype) => (
                                            <button
                                                key={mtype}
                                                type="button"
                                                onClick={() => setType(mtype)}
                                                className={`flex-1 cursor-pointer rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
                                                    type === mtype
                                                        ? 'border-primary bg-primary/10 text-primary'
                                                        : 'border-input text-muted-foreground hover:bg-muted'
                                                }`}
                                            >
                                                {mtype.charAt(0).toUpperCase() +
                                                    mtype.slice(1)}
                                            </button>
                                        ),
                                    )}
                                </div>
                                {errors['type'] && (
                                    <p className="text-sm text-destructive">
                                        {errors['type']}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="qty">Quantity</Label>
                                <Input
                                    id="qty"
                                    name="qty"
                                    type="number"
                                    min="1"
                                    placeholder="e.g. 10"
                                    defaultValue=""
                                />
                                {errors['qty'] && (
                                    <p className="text-sm text-destructive">
                                        {errors['qty']}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="reference">Reference</Label>
                                <Input
                                    id="reference"
                                    name="reference"
                                    placeholder="e.g. PO-001 or Order #1001"
                                    defaultValue=""
                                />
                                {errors['reference'] && (
                                    <p className="text-sm text-destructive">
                                        {errors['reference']}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="notes">Notes</Label>
                                <Textarea
                                    id="notes"
                                    name="notes"
                                    rows={3}
                                    placeholder="Optional notes about this movement"
                                    defaultValue=""
                                />
                                {errors['notes'] && (
                                    <p className="text-sm text-destructive">
                                        {errors['notes']}
                                    </p>
                                )}
                            </div>

                            <div className="pt-2">
                                <Button
                                    className="w-full"
                                    type="submit"
                                    disabled={processing}
                                >
                                    {processing
                                        ? 'Recording...'
                                        : 'Record Movement'}
                                </Button>
                            </div>
                        </div>
                    )}
                </Form>
            </div>
        </>
    );
}
