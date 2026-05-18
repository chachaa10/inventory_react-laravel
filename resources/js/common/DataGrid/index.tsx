import {
    flexRender,
    getCoreRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
    type ColumnDef,
    type SortingState,
} from '@tanstack/react-table';
import { ArrowUpDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';

type DataGridProps<TData> = {
    columns: ColumnDef<TData>[];
    data: TData[];
    pageSize?: number;
};

export function DataGrid<TData>({
    columns,
    data,
    pageSize = 10,
}: DataGridProps<TData>) {
    const [sorting, setSorting] = useState<SortingState>([]);

    const table = useReactTable({
        data,
        columns,
        state: { sorting },
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        initialState: { pagination: { pageSize } },
    });

    return (
        <div className="space-y-3">
            <div className="overflow-x-auto rounded-xl border border-border">
                <table className="w-full text-sm">
                    <thead>
                        {table.getHeaderGroups().map((hg) => (
                            <tr key={hg.id} className="border-b border-border">
                                {hg.headers.map((header) => (
                                    <th
                                        key={header.id}
                                        className="h-10 px-4 text-left text-xs font-medium text-muted-foreground"
                                        onClick={header.column.getToggleSortingHandler()}
                                    >
                                        <div className="inline-flex cursor-pointer items-center gap-1 select-none">
                                            {flexRender(
                                                header.column.columnDef.header,
                                                header.getContext(),
                                            )}
                                            {header.column.getCanSort() && (
                                                <ArrowUpDown className="h-3 w-3" />
                                            )}
                                        </div>
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    <tbody>
                        {table.getRowModel().rows.map((row) => (
                            <tr
                                key={row.id}
                                className="border-b border-border last:border-0 hover:bg-muted/50"
                            >
                                {row.getVisibleCells().map((cell) => (
                                    <td
                                        key={cell.id}
                                        className="h-12 px-4 py-2 text-sm text-foreground"
                                    >
                                        {flexRender(
                                            cell.column.columnDef.cell,
                                            cell.getContext(),
                                        )}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">
                    Page {table.getState().pagination.pageIndex + 1} of{' '}
                    {table.getPageCount()}
                </span>
                <div className="flex items-center gap-1">
                    <Button
                        variant="ghost"
                        size="xs"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    {Array.from(
                        { length: table.getPageCount() },
                        (_, i) => i + 1,
                    ).map((page) => (
                        <Button
                            key={page}
                            variant={
                                table.getState().pagination.pageIndex + 1 ===
                                page
                                    ? 'default'
                                    : 'ghost'
                            }
                            size="xs"
                            onClick={() => table.setPageIndex(page - 1)}
                        >
                            {page}
                        </Button>
                    ))}
                    <Button
                        variant="ghost"
                        size="xs"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
}
