import React from 'react'
import { cn } from '../../lib/utils'

export interface Column<T> {
  header: string
  accessorKey?: keyof T
  cell?: (item: T) => React.ReactNode
  className?: string
}

export interface DataTableProps<T> {
  data: T[]
  columns: Column<T>[]
  isLoading?: boolean
  emptyMessage?: string
  className?: string
}

export function DataTable<T>({
  data,
  columns,
  isLoading,
  emptyMessage = 'No data available',
  className,
}: DataTableProps<T>) {
  return (
    <div className={cn('w-full overflow-auto border border-border rounded-md bg-mine-black', className)}>
      <table className="w-full text-left text-sm text-text-primary">
        <thead className="bg-surface border-b border-border text-text-secondary font-medium">
          <tr>
            {columns.map((col, i) => (
              <th key={i} className={cn('px-4 py-3 align-middle font-medium', col.className)}>
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {isLoading ? (
            <tr>
              <td colSpan={columns.length} className="px-4 py-8 text-center text-text-muted">
                <div className="flex justify-center items-center gap-2">
                  <div className="w-4 h-4 rounded-full border-2 border-amber border-t-transparent animate-spin" />
                  Loading data...
                </div>
              </td>
            </tr>
          ) : data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-4 py-8 text-center text-text-muted">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row, rowIndex) => (
              <tr key={rowIndex} className="hover:bg-surface-raised transition-colors group">
                {columns.map((col, colIndex) => (
                  <td key={colIndex} className={cn('px-4 py-3 align-middle', col.className)}>
                    {col.cell ? col.cell(row) : (row as any)[col.accessorKey as string]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}
