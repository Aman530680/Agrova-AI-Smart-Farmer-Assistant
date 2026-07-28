import { useState } from 'react'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAppDispatch, useAppSelector } from '../store'
import { logout } from '../store/slices/authSlice'
import { setTheme, setLanguage } from '../store/slices/settingsSlice'
import { 
  Sprout, 
  MessageSquare, 
  Bug, 
  CloudSun, 
  Coins, 
  Calendar, 
  HelpCircle, 
  LogOut, 
  Sun, 
  Moon, 
  Globe, 
  Menu, 
  X,
  User
} from 'lucide-react'

export default function DashboardLayout() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useAppDispatch()
  
  const user = useAppSelector((state) => state.auth.user)
  const theme = useAppSelector((state) => state.settings.theme)
  const currentLanguage = useAppSelector((state) => state.settings.language)
  
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  const handleLogout = () => {
    dispatch(logout())
    navigate('/')
  }

  const toggleTheme = () => {
    dispatch(setTheme(theme === 'dark' ? 'light' : 'dark'))
  }

  const handleLanguageChange = (lang: string) => {
    dispatch(setLanguage(lang))
  }

  const navigationItems = [
    { name: t('modules.chatbot.title', 'AI Chatbot'), path: '/dashboard/chatbot', icon: MessageSquare },
    { name: t('modules.pest.title', 'Pest Management'), path: '/dashboard/pest', icon: Bug },
    { name: t('modules.weather.title', 'Weather Forecast'), path: '/dashboard/weather', icon: CloudSun },
    { name: t('modules.market.title', 'Market Prices'), path: '/dashboard/market', icon: Coins },
    { name: t('modules.crop.title', 'Crop Tracker'), path: '/dashboard/crop', icon: Calendar },
    { name: t('modules.schemes.title', 'Govt Schemes'), path: '/dashboard/schemes', icon: HelpCircle },
  ]

  const languages = [
    { code: 'en', label: 'EN' },
    { code: 'hi', label: 'हिं' },
    { code: 'ta', label: 'த' },
    { code: 'te', label: 'తె' },
    { code: 'kn', label: 'ಕ' },
    { code: 'ml', label: 'മ' },
    { code: 'mr', label: 'म' },
    { code: 'gu', label: 'ગુ' },
    { code: 'bn', label: 'বা' },
    { code: 'pa', label: 'ਪੰ' },
    { code: 'as', label: 'অ' },
    { code: 'or', label: 'ଓ' },
    { code: 'ur', label: 'ار' }
  ]

  return (
    <div className={`min-h-screen flex transition-colors duration-300 ${
      theme === 'dark' ? 'bg-neutral-950 text-white' : 'bg-stone-50 text-emerald-950'
    }`}>
      
      {/* Desktop Sidebar */}
      <aside className={`hidden md:flex flex-col w-72 border-r transition-colors duration-300 ${
        theme === 'dark' ? 'bg-neutral-900/40 border-white/5' : 'bg-white border-stone-200'
      }`}>
        {/* Brand Logo */}
        <div className="p-6 flex items-center gap-3 border-b border-white/5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-emerald-400 flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <Sprout className="w-5.5 h-5.5 text-black" />
          </div>
          <span className="text-lg font-bold tracking-tight bg-gradient-to-r from-emerald-400 to-amber-200 bg-clip-text text-transparent">
            Agrova AI Farmer Query
          </span>
        </div>

        {/* Sidebar Nav Links */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          <button
            onClick={() => navigate('/dashboard')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
              location.pathname === '/dashboard'
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                : 'text-neutral-400 hover:bg-white/5 hover:text-white'
            }`}
          >
            <User className="w-5 h-5" />
            <span>{t('nav.dashboard', 'Dashboard')}</span>
          </button>
          
          <div className="h-px bg-white/5 my-4" />

          {navigationItems.map((item) => {
            const isActive = location.pathname === item.path
            const Icon = item.icon
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-black shadow-lg shadow-emerald-500/10 font-semibold'
                    : theme === 'dark'
                      ? 'text-neutral-400 hover:bg-neutral-800/60 hover:text-white'
                      : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-black' : 'text-neutral-400'}`} />
                <span>{item.name}</span>
              </button>
            )
          })}
        </nav>

        {/* Sidebar Footer / User Profile */}
        <div className="p-4 border-t border-white/5 space-y-4">
          <div className="flex items-center gap-3 px-2">
            <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 text-emerald-400">
              <User className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate">{user?.name || 'Farmer'}</p>
              <p className="text-xs text-neutral-500 truncate">{user?.email || 'farmer@ageova.com'}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-medium border border-white/5 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/20 transition-all duration-300"
          >
            <LogOut className="w-4 h-4" />
            <span>{t('nav.logout', 'Logout')}</span>
          </button>
        </div>
      </aside>

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Header */}
        <header className={`h-16 border-b px-6 flex items-center justify-between z-20 ${
          theme === 'dark' ? 'bg-neutral-900/60 border-white/5' : 'bg-white border-stone-200'
        }`}>
          {/* Mobile Menu Trigger */}
          <button
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-white/5"
          >
            {isMobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          {/* Title Area */}
          <h2 className="hidden sm:block text-lg font-bold">
            {location.pathname === '/dashboard' ? t('nav.dashboard', 'Dashboard') : navigationItems.find(i => i.path === location.pathname)?.name || ''}
          </h2>

          {/* Quick settings toolbar */}
          <div className="flex items-center gap-3 ml-auto">
            {/* Language Selection Popover/Menu */}
            <div className="relative group">
              <button className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-white/5 bg-neutral-900/40 text-xs font-semibold text-neutral-300 hover:border-emerald-500/30 transition-all">
                <Globe className="w-4 h-4 text-emerald-400" />
                <span>{currentLanguage.toUpperCase()}</span>
              </button>
              
              {/* Language picker dropdown list on hover */}
              <div className="absolute right-0 mt-2 w-48 rounded-xl bg-neutral-900 border border-white/5 p-2 shadow-xl opacity-0 scale-95 pointer-events-none group-hover:opacity-100 group-hover:scale-100 group-hover:pointer-events-auto transition-all duration-200 grid grid-cols-3 gap-1.5">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => handleLanguageChange(lang.code)}
                    className={`py-1 rounded-lg text-[10px] font-bold text-center border ${
                      currentLanguage === lang.code
                        ? 'bg-emerald-500 text-black border-emerald-500'
                        : 'bg-neutral-800 border-transparent hover:border-white/10 text-neutral-400'
                    }`}
                  >
                    {lang.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Theme Switcher */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg border border-white/5 bg-neutral-900/40 text-neutral-400 hover:text-emerald-400 hover:border-emerald-500/30 transition-all"
            >
              {theme === 'dark' ? <Sun className="w-4.5 h-4.5" /> : <Moon className="w-4.5 h-4.5" />}
            </button>
          </div>
        </header>

        {/* Mobile menu panel */}
        {isMobileOpen && (
          <div className="md:hidden fixed inset-x-0 top-16 bg-neutral-900 border-b border-white/10 p-4 space-y-2 z-50">
            <button
              onClick={() => { navigate('/dashboard'); setIsMobileOpen(false); }}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm text-neutral-400 hover:bg-white/5 hover:text-white"
            >
              <User className="w-5 h-5" />
              <span>{t('nav.dashboard', 'Dashboard')}</span>
            </button>
            {navigationItems.map((item) => (
              <button
                key={item.path}
                onClick={() => { navigate(item.path); setIsMobileOpen(false); }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm text-neutral-400 hover:bg-white/5 hover:text-white"
              >
                <item.icon className="w-5 h-5 text-neutral-500" />
                <span>{item.name}</span>
              </button>
            ))}
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm text-red-400 hover:bg-red-500/10"
            >
              <LogOut className="w-5 h-5" />
              <span>{t('nav.logout', 'Logout')}</span>
            </button>
          </div>
        )}

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          <Outlet />
        </main>
      </div>

    </div>
  )
}
