import { cn } from '../../lib/utils'
import type { HTMLAttributes } from 'react'

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'rounded-xl border border-[#dce8dc] bg-white p-4 shadow-[0_2px_10px_rgba(35,76,45,0.05)] transition hover:border-[#bfd9c2] hover:shadow-[0_8px_22px_rgba(35,76,45,0.08)] md:p-5',
        className,
      )}
      {...props}
    />
  )
}
