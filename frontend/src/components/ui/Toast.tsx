import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'

interface ToastItem {
  id: string
  title: string
  tone?: 'success' | 'error' | 'info'
}

interface ToastCtx {
  toast: (title: string, tone?: ToastItem['tone']) => void
}

const Ctx = createContext<ToastCtx>({ toast: () => undefined })

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([])

  const toast = useCallback((title: string, tone: ToastItem['tone'] = 'success') => {
    const id = String(Date.now())
    setItems((prev) => [...prev, { id, title, tone }])
    setTimeout(() => setItems((prev) => prev.filter((t) => t.id !== id)), 3200)
  }, [])

  const value = useMemo(() => ({ toast }), [toast])

  return (
    <Ctx.Provider value={value}>
      {children}
      <div className="fixed bottom-5 right-5 z-[80] flex flex-col gap-2">
        <AnimatePresence>
          {items.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8 }}
              className={`min-w-[240px] max-w-sm rounded-xl border bg-white px-4 py-3 text-sm text-[#183122] shadow-[0_10px_26px_rgba(35,76,45,0.14)] ${
                item.tone === 'error'
                  ? 'border-[#e7bdb5] bg-[#fff7f4] text-[#8e4034]'
                  : item.tone === 'info'
                    ? 'border-[#b9dce0] bg-[#f1fbfc] text-[#23656d]'
                    : 'border-[#b9d9bc] bg-[#f2faf0] text-[#2d6f3a]'
              }`}
            >
              <div className="flex items-start gap-2">
                <p className="flex-1 leading-relaxed">{item.title}</p>
                <button aria-label="Dismiss notification" onClick={() => setItems((p) => p.filter((t) => t.id !== item.id))}>
                  <X className="h-4 w-4 opacity-70" />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </Ctx.Provider>
  )
}

export function useToast() {
  return useContext(Ctx)
}
