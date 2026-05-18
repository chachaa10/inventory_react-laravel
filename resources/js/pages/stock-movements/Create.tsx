import { Head, Link } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';

export default function StockMovementsCreate() {
    const [form, setForm] = useState({
        product_id: '',
        type: 'in' as 'in' | 'out' | 'adjustment',
        qty: '',
        reference: '',
        notes: '',
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
            <Head title="Record Movement" />

            <div className="mb-6 flex items-center gap-4">
                <Button variant="ghost" size="sm" asChild>
                    <Link href="/stock-movements">
                        <ArrowLeft className="h-4 w-4" />
                        Back
                    </Link>
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
                <div className="space-y-5">
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-foreground">
                            Product
                        </label>
                        <select
                            name="product_id"
                            value={form.product_id}
                            onChange={handleChange}
                            className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground focus:ring-2 focus:ring-ring focus:outline-none"
                        >
                            <option value="">Select product</option>
                            <option value="1">Wireless Mouse</option>
                            <option value="2">Mechanical Keyboard</option>
                            <option value="3">USB-C Cable</option>
                        </select>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-foreground">
                            Movement Type
                        </label>
                        <div className="flex gap-2">
                            {(['in', 'out', 'adjustment'] as const).map(
                                (type) => (
                                    <button
                                        key={type}
                                        type="button"
                                        onClick={() =>
                                            setForm((prev) => ({
                                                ...prev,
                                                type,
                                            }))
                                        }
                                        className={`flex-1 rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
                                            form.type === type
                                                ? 'border-primary bg-primary/10 text-primary'
                                                : 'border-input text-muted-foreground hover:bg-muted'
                                        }`}
                                    >
                                        {type.charAt(0).toUpperCase() +
                                            type.slice(1)}
                                    </button>
                                ),
                            )}
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-foreground">
                            Quantity
                        </label>
                        <input
                            type="number"
                            name="qty"
                            value={form.qty}
                            onChange={handleChange}
                            min="1"
                            className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground focus:ring-2 focus:ring-ring focus:outline-none"
                            placeholder="0"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-foreground">
                            Reference (optional)
                        </label>
                        <input
                            type="text"
                            name="reference"
                            value={form.reference}
                            onChange={handleChange}
                            className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground focus:ring-2 focus:ring-ring focus:outline-none"
                            placeholder="e.g. PO-001 or Order #123"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-foreground">
                            Notes (optional)
                        </label>
                        <textarea
                            name="notes"
                            value={form.notes}
                            onChange={handleChange}
                            rows={3}
                            className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus:ring-2 focus:ring-ring focus:outline-none"
                            placeholder="Any additional notes..."
                        />
                    </div>
                </div>

                <div className="mt-6 flex items-center justify-end gap-2 border-t border-border pt-4">
                    <Button variant="outline" asChild>
                        <Link href="/stock-movements">Cancel</Link>
                    </Button>
                    <Button>Record Movement</Button>
                </div>
            </div>
        </>
    );
}
