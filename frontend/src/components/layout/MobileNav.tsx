import { AnimatePresence, motion } from 'framer-motion'
import Sidebar from './Sidebar'

export default function MobileNav({
  open,
  onClose,
}: {
  open: boolean
  onClose: () => void
}) {
  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 md:hidden">
          <motion.button
            aria-label="Close navigation"
            className="absolute inset-0 bg-black/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.aside
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ type: 'spring', stiffness: 320, damping: 32 }}
            className="absolute inset-y-0 left-0 w-72 border-r border-[#e8efe3] bg-white"
          >
            <Sidebar onNavigate={onClose} />
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  )
}
