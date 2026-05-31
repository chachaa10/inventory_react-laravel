import { Tag } from '@phosphor-icons/react';

import type { Category } from '@/types';

type SkuPreviewProps = {
    categoryId: number | string;
    categories: Category[];
    productName: string;
};

function derivePrefix(categoryName: string): string {
    const words = categoryName.split(' ');

    if (words.length === 1) {
        return categoryName.slice(0, 3).toUpperCase();
    }

    return words
        .map((w) => w[0])
        .join('')
        .toUpperCase();
}

function abbreviate(productName: string): string {
    const words = productName.split(/[\s-]+/);
    const skip = new Set([
        'the',
        'a',
        'an',
        'and',
        'or',
        'of',
        'for',
        'with',
        'by',
    ]);
    const significant = words.filter((w) => !skip.has(w.toLowerCase()));

    const source = significant.length > 0 ? significant : words;

    const letters = source
        .filter((w) => w.length > 0)
        .map((w) => w.charAt(0).toUpperCase())
        .join('')
        .slice(0, 5);

    return letters || 'XX';
}

export function SkuPreview({
    categoryId,
    categories,
    productName,
}: SkuPreviewProps) {
    const catId = Number(categoryId);
    const category = Number.isNaN(catId)
        ? undefined
        : categories.find((c) => c.id === catId);
    const prefix =
        category?.prefix ?? (category ? derivePrefix(category.name) : null);

    if (!prefix || !productName.trim()) {
        return null;
    }

    const abbr = abbreviate(productName);

    return (
        <div className="rounded-lg border border-dashed border-border bg-muted/30 px-3 py-2.5">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Tag className="h-3 w-3" />
                Auto-generated SKU
            </div>
            <div className="mt-0.5 font-mono text-sm font-medium text-foreground">
                <span className="rounded bg-primary/10 px-1.5 py-0.5 text-primary">
                    {prefix}
                </span>
                <span className="mx-1 text-muted-foreground">-</span>
                <span className="rounded bg-accent px-1.5 py-0.5">{abbr}</span>
                <span className="mx-1 text-muted-foreground">-</span>
                <span className="text-muted-foreground/60">nnn</span>
            </div>
        </div>
    );
}
