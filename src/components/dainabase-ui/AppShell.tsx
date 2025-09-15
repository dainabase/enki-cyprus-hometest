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
      "min-h-screen bg-white flex flex-col",
      className
    )}>
      {header && (
        <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
          {header}
        </header>
      )}

      <div className="flex flex-1">
        {sidebar && (
          <aside className="w-64 min-h-full bg-white border-r border-slate-200">
            {sidebar}
          </aside>
        )}

        <main className="flex-1 flex flex-col">
          {breadcrumbs && (
            <div className="bg-white border-b border-slate-200 px-6 py-4">
              {breadcrumbs}
            </div>
          )}

          <div className="flex-1 p-6">
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