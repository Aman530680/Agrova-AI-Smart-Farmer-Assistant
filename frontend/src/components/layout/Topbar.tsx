import { Bell, ChevronLeft, Menu, Search, UserRound } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { defaultNotifications } from '../../data/dashboard'
import { useState } from 'react'
import { loadProfile } from '../../lib/profile'

export default function Topbar({
  title,
  onMenu,
  onToggleSidebar,
}: {
  title: string
  onMenu: () => void
  onToggleSidebar: () => void
}) {
  const { t } = useTranslation()
  const profile = loadProfile()
  const [openNotes, setOpenNotes] = useState(false)
  const unread = defaultNotifications.filter((n) => n.unread).length

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-3 border-b border-[#e8efe3] bg-white/85 px-4 backdrop-blur-md md:px-6">
      <div className="flex min-w-0 items-center gap-3">
        <button
          className="hidden rounded-xl border border-[#dfe8dc] p-2 text-[#234432] md:inline-flex"
          onClick={onToggleSidebar}
          aria-label="Toggle sidebar"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <button className="rounded-xl border border-[#dfe8dc] p-2 text-[#234432] md:hidden" onClick={onMenu} aria-label="Open menu">
          <Menu className="h-5 w-5" />
        </button>
        <div className="min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#7a887c]">Agrova AI</p>
          <h2 className="truncate font-display text-base font-bold text-[#17201a] md:text-lg">{title}</h2>
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-3">
        <div className="hidden items-center gap-2 rounded-xl border border-[#dfe8dc] bg-[#f6f9f3] px-3 py-2 text-sm text-[#526459] md:flex">
          <Search className="h-4 w-4 text-[#166534]" />
          <input
            aria-label="Search"
            placeholder={t('common.search', 'Search')}
            className="w-28 border-0 bg-transparent text-sm text-[#25372f] outline-none placeholder:text-[#7a887c]"
          />
        </div>

        <div className="relative">
          <button
            className="relative rounded-xl border border-[#dfe8dc] bg-white p-2.5 text-[#1d3528]"
            onClick={() => setOpenNotes((v) => !v)}
            aria-label={t('nav.notifications', 'Notifications')}
          >
            <Bell className="h-4 w-4" />
            {unread > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#166534] px-1 text-[10px] font-bold text-white">
                {unread}
              </span>
            )}
          </button>

          {openNotes && (
            <div className="absolute right-0 z-40 mt-3 w-80 max-w-[calc(100vw-2rem)] rounded-2xl border border-[#e8efe3] bg-white p-3 shadow-lg shadow-[#dfe8dc]">
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#7a887c]">{t('nav.notifications', 'Notifications')}</p>
              <div className="max-h-72 space-y-2 overflow-y-auto">
                {defaultNotifications.map((n) => (
                  <div key={n.id} className="rounded-xl border border-[#edf3ea] bg-[#f9fbf7] p-3">
                    <p className="text-sm font-semibold text-[#17201a]">{n.title}</p>
                    <p className="mt-1 text-xs text-[#66736a]">{n.body}</p>
                    <p className="mt-1 text-[10px] text-[#7a887c]">{n.time}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 rounded-xl border border-[#dfe8dc] bg-[#f7faf4] px-2 py-1.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#dff5e5] text-sm font-bold text-[#166534]">
            <UserRound className="h-4 w-4" />
          </div>
          <div className="hidden text-left md:block">
            <p className="text-xs font-semibold text-[#17201a]">{profile.name}</p>
            <p className="text-[10px] text-[#66736a]">{profile.location}</p>
          </div>
        </div>
      </div>
    </header>
  )
}
