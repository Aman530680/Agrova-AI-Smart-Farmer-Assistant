import { useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Sidebar from '../components/layout/Sidebar'
import Topbar from '../components/layout/Topbar'
import MobileNav from '../components/layout/MobileNav'

export default function DashboardLayout() {
  const location = useLocation()
  const { t } = useTranslation()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  const title = (() => {
    const map: Record<string, string> = {
      '/dashboard': 'nav.dashboard',
      '/dashboard/chatbot': 'nav.kisanMitra',
      '/dashboard/pest': 'nav.cropDoctor',
      '/dashboard/weather': 'nav.weather',
      '/dashboard/market': 'nav.market',
      '/dashboard/crop': 'nav.crop',
      '/dashboard/schemes': 'nav.schemes',
      '/dashboard/profile': 'nav.profile',
      '/dashboard/settings': 'nav.settings',
    }
    return t(map[location.pathname] || 'common.appName', 'Agrova AI')
  })()

  return (
    <div className="flex min-h-screen bg-[#f7faf5] text-[#183122]">
      <aside className={`${sidebarCollapsed ? 'hidden w-[76px]' : 'hidden w-[252px]'} shrink-0 border-r border-[#dce8dc] bg-white md:block`}>
        <Sidebar collapsed={sidebarCollapsed} />
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar
          title={title}
          onMenu={() => setMobileOpen(true)}
          onToggleSidebar={() => setSidebarCollapsed((value) => !value)}
        />
        <MobileNav open={mobileOpen} onClose={() => setMobileOpen(false)} />
        <main className="flex-1 overflow-y-auto bg-[#f7faf5] p-4 md:p-5 xl:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
