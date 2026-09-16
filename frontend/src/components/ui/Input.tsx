import { cn } from '../../lib/utils'
import type { InputHTMLAttributes } from 'react'

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        'w-full rounded-lg border border-[#cbdcca] bg-white px-3.5 py-2.5 text-sm text-[#183122] placeholder:text-[#718174] shadow-sm focus:border-[#3b8a4c] focus:ring-2 focus:ring-[#3b8a4c]/15',
        className,
      )}
      {...props}
    />
  )
}
