import { cn } from '../../lib/utils'
import type { SelectHTMLAttributes } from 'react'

export function Select({ className, children, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={cn(
        'w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm text-foreground',
        className,
      )}
      {...props}
    >
      {children}
    </select>
  )
}
