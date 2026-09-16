import type { ReactNode } from 'react'
import { cn } from '../../lib/utils'

export function Badge({ children, tone = 'green' }: { children: ReactNode; tone?: 'green' | 'amber' | 'red' | 'slate' }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider',
        tone === 'green' && 'border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
        tone === 'amber' && 'border-amber-500/30 bg-amber-500/10 text-amber-600',
        tone === 'red' && 'border-red-500/30 bg-red-500/10 text-red-500',
        tone === 'slate' && 'border-border bg-muted text-muted-foreground',
      )}
    >
      {children}
    </span>
  )
}
