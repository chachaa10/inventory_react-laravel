import { cva, type VariantProps } from 'class-variance-authority';

const badge = cva(
    'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium',
    {
        variants: {
            variant: {
                in_stock:
                    'bg-green-50 text-green-700 ring-1 ring-green-600/20 ring-inset dark:bg-green-950/30 dark:text-green-400 dark:ring-green-400/20',
                low_stock:
                    'bg-amber-50 text-amber-700 ring-1 ring-amber-600/20 ring-inset dark:bg-amber-950/30 dark:text-amber-400 dark:ring-amber-400/20',
                out_of_stock:
                    'bg-red-50 text-red-700 ring-1 ring-red-600/20 ring-inset dark:bg-red-950/30 dark:text-red-400 dark:ring-red-400/20',
            },
        },
    },
);

const dot = cva('h-1.5 w-1.5 rounded-full', {
    variants: {
        variant: {
            in_stock: 'bg-green-500',
            low_stock: 'bg-amber-500',
            out_of_stock: 'bg-red-500',
        },
    },
});

type StatusBadgeProps = VariantProps<typeof badge> & {
    stockQty?: number;
    reorderLevel?: number;
};

export function StatusBadge({ stockQty, reorderLevel }: StatusBadgeProps) {
    const variant =
        !stockQty || stockQty === 0
            ? 'out_of_stock'
            : reorderLevel !== undefined && stockQty <= reorderLevel
              ? 'low_stock'
              : 'in_stock';

    const labels = {
        in_stock: 'In Stock',
        low_stock: 'Low Stock',
        out_of_stock: 'Out of Stock',
    };

    return (
        <span className={badge({ variant })}>
            <span className={dot({ variant })} />
            {labels[variant]}
        </span>
    );
}
