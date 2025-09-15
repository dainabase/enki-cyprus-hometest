import React from 'react'
import { cn } from '@/lib/utils'

interface FormProps extends React.FormHTMLAttributes<HTMLFormElement> {
  variant?: 'executive' | 'clean'
}

export const Form = React.forwardRef<HTMLFormElement, FormProps>(
  ({ className, variant = 'executive', ...props }, ref) => {
    return (
      <form
        ref={ref}
        className={cn(
          "space-y-6",
          variant === 'executive' && "p-6 bg-white rounded-xl border border-slate-200",
          variant === 'clean' && "space-y-4",
          className
        )}
        {...props}
      />
    )
  }
)