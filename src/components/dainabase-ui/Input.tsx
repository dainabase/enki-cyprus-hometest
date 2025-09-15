import React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const inputVariants = cva(
  "flex w-full rounded-lg border bg-background px-3 py-2 text-sm transition-all duration-200 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        executive: "border-slate-300 focus-visible:ring-slate-500 bg-white",
        clean: "border-slate-200 focus-visible:ring-blue-500 bg-white",
        minimal: "border-transparent bg-slate-50 focus-visible:ring-slate-400",
      },
      size: {
        sm: "h-8 px-2 text-xs",
        md: "h-10 px-3",
        lg: "h-12 px-4 text-base",
      },
    },
    defaultVariants: {
      variant: "executive",
      size: "md",
    },
  }
)

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>,
    VariantProps<typeof inputVariants> {
  label?: string
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, variant, size, label, ...props }, ref) => {
    return (
      <div className="space-y-2">
        {label && (
          <label className="text-sm font-medium text-slate-700">
            {label}
          </label>
        )}
        <input
          className={cn(inputVariants({ variant, size, className }))}
          ref={ref}
          {...props}
        />
      </div>
    )
  }
)