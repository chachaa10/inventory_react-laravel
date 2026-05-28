import type { ColumnDef, SortingState } from '@tanstack/react-table';
import {
    flexRender,
    getCoreRowModel,
    getSortedRowModel,
    useReactTable,
} from '@tanstack/react-table';
import { ArrowUpDown } from 'lucide-react';
import { useState } from 'react';

type DataGridProps<TData> = {
    columns: ColumnDef<TData>[];
    data: TData[];
};

export function DataGrid<TData>({ columns, data }: DataGridProps<TData>) {
    const [sorting, setSorting] = useState<SortingState>([]);

    const table = useReactTable({
        data,
        columns,
        state: { sorting },
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
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
                                            {header.column.getCanSort() &&
                                                !(
                                                    header.column.columnDef
                                                        .meta as
                                                        | Record<
                                                              string,
                                                              boolean
                                                          >
                                                        | undefined
                                                )?.['sortIconHidden'] && (
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
        </div>
    );
}
