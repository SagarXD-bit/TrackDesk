"use client";

import { cn } from "@/lib/utils";

export interface Column<T> {
  key: string;
  header: string;
  render: (item: T) => React.ReactNode;
  className?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (item: T) => string;
  onRowClick?: (item: T) => void;
  className?: string;
}

export function DataTable<T>({
  columns,
  data,
  keyExtractor,
  onRowClick,
  className,
}: DataTableProps<T>) {
  return (
    <div className={cn("overflow-x-auto rounded-[20px] border border-[#D9D9D9] bg-white dark:border-gray-700 dark:bg-gray-800", className)}>
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-[#D9D9D9] dark:border-gray-700">
            {columns.map((col) => (
              <th
                key={col.key}
                className={cn("px-5 py-3.5 font-medium text-[#666] dark:text-gray-400", col.className)}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-[#D9D9D9] dark:divide-gray-700">
          {data.map((item) => (
            <tr
              key={keyExtractor(item)}
              onClick={() => onRowClick?.(item)}
              className={cn(
                "transition-colors duration-150",
                onRowClick && "cursor-pointer hover:bg-[#F2FFD9] dark:hover:bg-gray-700/50"
              )}
            >
              {columns.map((col) => (
                <td key={col.key} className={cn("px-5 py-3.5", col.className)}>
                  {col.render(item)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
