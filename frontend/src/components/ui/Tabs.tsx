import type { ReactNode } from 'react'
import { cn } from '../../lib/utils'

export function Tabs({
  tabs,
  value,
  onChange,
}: {
  tabs: string[]
  value: string
  onChange: (tab: string) => void
}) {
  return (
    <div className="flex gap-2 overflow-x-auto" role="tablist">
      {tabs.map((tab) => (
        <button
          key={tab}
          role="tab"
          aria-selected={value === tab}
          onClick={() => onChange(tab)}
          className={cn(
            'whitespace-nowrap rounded-full border px-3 py-1.5 text-xs',
            value === tab ? 'border-emerald-500 bg-emerald-500/15' : 'border-border',
          )}
        >
          {tab}
        </button>
      ))}
    </div>
  )
}

export function TabPanel({ children }: { children: ReactNode }) {
  return <div role="tabpanel">{children}</div>
}
