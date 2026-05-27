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
        <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">
                {from}–{to} of {total}
            </span>
            <div className="flex items-center gap-1">
                <Button
                    variant="ghost"
                    size="xs"
                    disabled={currentPage <= 1}
                    onClick={() => goToPage(currentPage - 1)}
                >
                    <ChevronLeft className="h-4 w-4" />
                </Button>
                {Array.from({ length: lastPage }, (_, i) => i + 1).map(
                    (page) => (
                        <Button
                            key={page}
                            variant={currentPage === page ? 'default' : 'ghost'}
                            size="xs"
                            onClick={() => goToPage(page)}
                        >
                            {page}
                        </Button>
                    ),
                )}
                <Button
                    variant="ghost"
                    size="xs"
                    disabled={currentPage >= lastPage}
                    onClick={() => goToPage(currentPage + 1)}
                >
                    <ChevronRight className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
}
