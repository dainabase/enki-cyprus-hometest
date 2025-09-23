import React from 'react'
import { cn } from '@/lib/utils'

interface AppShellProps {
  children: React.ReactNode
  header?: React.ReactNode
  sidebar?: React.ReactNode
  breadcrumbs?: React.ReactNode
  footer?: React.ReactNode
  variant?: 'executive' | 'client'
  className?: string
}

export const AppShell: React.FC<AppShellProps> = ({
  children,
  header,
  sidebar,
  breadcrumbs,
  footer,
  variant = 'executive',
  className,
}) => {
  return (
    <div className={cn(
      "min-h-screen bg-white",
      className
    )}>
      {header && (
        <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
          {header}
        </header>
      )}

      <div className="flex">
        {sidebar && (
          <aside className="w-64 bg-white border-r border-slate-200 sticky top-32 h-[calc(100vh-8rem)] overflow-y-auto flex-shrink-0">
            {sidebar}
          </aside>
        )}

        <main className="flex-1 min-h-screen">
          {breadcrumbs && (
            <div className="bg-white border-b border-slate-200 px-6 py-4">
              {breadcrumbs}
            </div>
          )}

          <div className="p-6">
            {children}
          </div>
        </main>
      </div>

      {footer && (
        <div className="mt-auto">
          {footer}
        </div>
      )}
    </div>
  )
}
