import { NavLink } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  LayoutDashboard,
  MessageSquare,
  Stethoscope,
  CloudSun,
  Coins,
  Leaf,
  Landmark,
  UserRound,
  Settings,
  Sprout,
} from 'lucide-react'
import { cn } from '../../lib/utils'
import { loadProfile } from '../../lib/profile'

const mainNav = [
  { to: '/dashboard', labelKey: 'nav.dashboard', icon: LayoutDashboard, end: true },
  { to: '/dashboard/chatbot', labelKey: 'nav.kisanMitra', icon: MessageSquare },
  { to: '/dashboard/pest', labelKey: 'nav.cropDoctor', icon: Stethoscope },
  { to: '/dashboard/weather', labelKey: 'nav.weather', icon: CloudSun },
  { to: '/dashboard/market', labelKey: 'nav.market', icon: Coins },
  { to: '/dashboard/crop', labelKey: 'nav.crop', icon: Leaf },
  { to: '/dashboard/schemes', labelKey: 'nav.schemes', icon: Landmark },
]

const farmNav = [
  { to: '/dashboard/profile', labelKey: 'nav.profile', icon: UserRound },
  { to: '/dashboard/settings', labelKey: 'nav.settings', icon: Settings },
]

export default function Sidebar({ collapsed = false, onNavigate }: { collapsed?: boolean; onNavigate?: () => void }) {
  const profile = loadProfile()
  const { t } = useTranslation()

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    cn(
      'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200',
      collapsed ? 'justify-center px-2.5' : '',
      isActive
        ? 'border border-[#cfead8] bg-[#edf9f0] text-[#1a5d34] shadow-sm'
        : 'text-[#53665a] hover:bg-[#f4f7f0] hover:text-[#17201a]',
    )

  return (
    <div className="flex h-full flex-col bg-white">
      <div className="flex items-center gap-3 border-b border-[#e8efe3] px-4 py-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#166534] text-white shadow-sm">
          <Sprout className="h-5 w-5" />
        </div>
        {!collapsed && (
          <div>
            <p className="font-display text-base font-extrabold tracking-tight text-[#17201a]">Agrova AI</p>
            <p className="text-[11px] text-[#66736a]">{t('sidebar.tagline', 'Farmer assistant')}</p>
          </div>
        )}
      </div>

      <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-5" aria-label="Primary navigation">
        <div className="space-y-1">
          {mainNav.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.end} onClick={onNavigate} className={linkClass}>
              <item.icon className="h-4 w-4 shrink-0" />
              {!collapsed && <span>{t(item.labelKey)}</span>}
            </NavLink>
          ))}
        </div>

        <div>
          {!collapsed && (
            <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#7a887c]">{t('nav.myFarm', 'My Farm')}</p>
          )}
          <div className="space-y-1">
            {farmNav.map((item) => (
              <NavLink key={item.to} to={item.to} onClick={onNavigate} className={linkClass}>
                <item.icon className="h-4 w-4 shrink-0" />
                {!collapsed && <span>{t(item.labelKey)}</span>}
              </NavLink>
            ))}
          </div>
        </div>
      </nav>

      {!collapsed && (
        <div className="border-t border-[#e8efe3] p-4">
          <div className="flex items-center gap-3 rounded-2xl bg-[#f5f8f2] px-3 py-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#dff5e5] text-sm font-bold text-[#166534]">
              {profile.name.slice(0, 1)}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-[#17201a]">{profile.name}</p>
              <p className="truncate text-[11px] text-[#66736a]">{profile.location}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
