import { router } from '@inertiajs/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import { Button } from '@/components/ui/button';

type PaginatorProps = {
    currentPage: number;
    lastPage: number;
    total: number;
    from: number;
    to: number;
};

function goToPage(page: number) {
    const params = new URLSearchParams(window.location.search);

    params.set('page', String(page));

    router.visit(`?${params.toString()}`, {
        preserveState: true,
        preserveScroll: true,
    });
}

function getPageNumbers(current: number, last: number): number[] {
    if (last <= 5) {
        return Array.from({ length: last }, (_, i) => i + 1);
    }

    const start = Math.max(1, Math.min(current - 2, last - 4));

    return Array.from({ length: 5 }, (_, i) => start + i);
}

export function Paginator({
    currentPage,
    lastPage,
    total,
    from,
    to,
}: PaginatorProps) {
    if (lastPage <= 1) {
        return null;
    }

    return (
        <div className="mt-6 flex items-center justify-between">
            <span className="text-xs text-muted-foreground">
                {from}–{to} of {total}
            </span>
            <div className="flex items-center gap-1">
                <Button
                    variant="ghost"
                    size="xs"
                    type="button"
                    disabled={currentPage <= 1}
                    onClick={() => goToPage(currentPage - 1)}
                >
                    <ChevronLeft className="h-4 w-4" />
                </Button>
                {getPageNumbers(currentPage, lastPage).map((page) => (
                    <Button
                        key={page}
                        variant={currentPage === page ? 'default' : 'ghost'}
                        size="xs"
                        type="button"
                        onClick={() => goToPage(page)}
                    >
                        {page}
                    </Button>
                ))}
                <Button
                    variant="ghost"
                    size="xs"
                    type="button"
                    disabled={currentPage >= lastPage}
                    onClick={() => goToPage(currentPage + 1)}
                >
                    <ChevronRight className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
}
