import { cn } from '../../lib/utils'
import type { ReactNode } from 'react'

export function PageContainer({ title, subtitle, actions, children, className }: {
  title?: string
  subtitle?: string
  actions?: ReactNode
  children: ReactNode
  className?: string
}) {
  return (
    <div className={cn('mx-auto w-full max-w-[1440px] space-y-4 md:space-y-5', className)}>
      {(title || actions) && (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            {title && <h1 className="font-display text-2xl font-extrabold tracking-tight text-[#183122] md:text-[28px]">{title}</h1>}
            {subtitle && <p className="mt-1 max-w-2xl text-sm leading-relaxed text-[#607364]">{subtitle}</p>}
          </div>
          {actions}
        </div>
      )}
      {children}
    </div>
  )
}
