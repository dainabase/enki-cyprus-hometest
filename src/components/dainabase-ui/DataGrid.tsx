import React from 'react'
import { cn } from '@/lib/utils'

interface Column {
  key: string
  label: string
  render?: (value: any, row: any) => React.ReactNode
}

interface DataGridProps {
  data: any[]
  columns: Column[]
  variant?: 'executive' | 'enterprise' | 'clean'
  features?: string[]
  className?: string
}

export const DataGrid: React.FC<DataGridProps> = ({
  data,
  columns,
  variant = 'executive',
  features = [],
  className,
}) => {
  return (
    <div className={cn(
      "rounded-xl border overflow-hidden",
      variant === 'executive' && "border-slate-200 shadow-lg",
      variant === 'enterprise' && "border-slate-300 shadow-xl",
      variant === 'clean' && "border-slate-100 shadow-sm",
      className
    )}>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className={cn(
            "border-b",
            variant === 'executive' && "bg-slate-50 border-slate-200",
            variant === 'enterprise' && "bg-slate-100 border-slate-300",
            variant === 'clean' && "bg-white border-slate-100"
          )}>
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className="px-6 py-4 text-left text-sm font-semibold text-slate-900"
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 bg-white">
            {data.map((row, index) => (
              <tr key={index} className="hover:bg-slate-50 transition-colors">
                {columns.map((column) => (
                  <td key={column.key} className="px-6 py-4 text-sm text-slate-900">
                    {column.render ? column.render(row[column.key], row) : row[column.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}