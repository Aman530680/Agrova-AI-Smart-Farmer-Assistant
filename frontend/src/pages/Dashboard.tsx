import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { useAppSelector } from '../store'
import { 
  MessageSquare, 
  Bug, 
  CloudSun, 
  Coins, 
  Calendar, 
  HelpCircle,
  ArrowRight,
  TrendingUp
} from 'lucide-react'

export default function Dashboard() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const user = useAppSelector((state) => state.auth.user)
  const theme = useAppSelector((state) => state.settings.theme)

  const modules = [
    {
      title: t('modules.chatbot.title', 'AI Chatbot'),
      desc: t('modules.chatbot.desc', 'Ask farm-related queries, upload files or images, and get instant guidance.'),
      path: '/dashboard/chatbot',
      color: 'from-emerald-500/20 to-teal-500/10 border-emerald-500/30 text-emerald-400',
      icon: MessageSquare
    },
    {
      title: t('modules.pest.title', 'Pest Management'),
      desc: t('modules.pest.desc', 'Identify crop diseases and get organic & chemical solutions.'),
      path: '/dashboard/pest',
      color: 'from-red-500/20 to-orange-500/10 border-red-500/30 text-red-400',
      icon: Bug
    },
    {
      title: t('modules.weather.title', 'Weather Forecast'),
      desc: t('modules.weather.desc', 'Get current weather conditions and farming recommendations.'),
      path: '/dashboard/weather',
      color: 'from-blue-500/20 to-indigo-500/10 border-blue-500/30 text-blue-400',
      icon: CloudSun
    },
    {
      title: t('modules.market.title', 'Market Prices'),
      desc: t('modules.market.desc', 'Compare commodity prices across regional markets.'),
      path: '/dashboard/market',
      color: 'from-amber-500/20 to-yellow-500/10 border-amber-500/30 text-amber-400',
      icon: Coins
    },
    {
      title: t('modules.crop.title', 'Crop Tracker'),
      desc: t('modules.crop.desc', 'Create personalized crop lifecycle calendars with alerts.'),
      path: '/dashboard/crop',
      color: 'from-lime-500/20 to-green-500/10 border-lime-500/30 text-lime-400',
      icon: Calendar
    },
    {
      title: t('modules.schemes.title', 'Govt Schemes'),
      desc: t('modules.schemes.desc', 'Explore central and state schemes for agricultural benefits.'),
      path: '/dashboard/schemes',
      color: 'from-purple-500/20 to-pink-500/10 border-purple-500/30 text-purple-400',
      icon: HelpCircle
    }
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08
      }
    }
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } }
  }

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className={`p-8 rounded-3xl relative overflow-hidden border ${
        theme === 'dark'
          ? 'bg-gradient-to-br from-neutral-900/60 to-neutral-950 border-white/5 glow-green'
          : 'bg-gradient-to-br from-emerald-50 to-white border-stone-200 glow-green'
      }`}>
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-[80px]" />
        
        <div className="relative z-10 max-w-2xl space-y-3">
          <span className="flex items-center gap-1 text-xs font-bold text-emerald-400 uppercase tracking-widest">
            <TrendingUp className="w-4 h-4" /> Live Agriculture Portal
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
            Namaste, {user?.name || 'Farmer'}!
          </h1>
          <p className={`text-sm leading-relaxed ${theme === 'dark' ? 'text-neutral-400' : 'text-stone-600'}`}>
            Welcome to your **Agrova AI Farmer Query** dashboard. Here you can run AI diagnostic checks on sick leaves, verify local forecasts for spray alerts, search crop pricing trends, and maintain planting calendars.
          </p>
        </div>
      </div>

      {/* Modules Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {modules.map((mod, index) => {
          const Icon = mod.icon
          return (
            <motion.button
              key={index}
              variants={cardVariants}
              whileHover={{ y: -6, scale: 1.01 }}
              onClick={() => navigate(mod.path)}
              className={`p-6 rounded-2xl border text-left flex flex-col justify-between h-64 hover:shadow-2xl transition-all duration-300 ${
                theme === 'dark'
                  ? `bg-gradient-to-br ${mod.color} hover:bg-white/5`
                  : 'bg-white border-stone-200 hover:border-emerald-500/30'
              }`}
            >
              <div className="space-y-4">
                {/* Icon Wrapper */}
                <div className={`w-12 h-12 rounded-xl bg-neutral-950/60 border border-white/10 flex items-center justify-center ${mod.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                
                {/* Title & Description */}
                <div className="space-y-1">
                  <h2 className="text-lg font-bold tracking-tight text-white">{mod.title}</h2>
                  <p className={`text-xs leading-relaxed line-clamp-3 ${
                    theme === 'dark' ? 'text-neutral-400' : 'text-stone-500'
                  }`}>
                    {mod.desc}
                  </p>
                </div>
              </div>

              {/* Card Footer Link */}
              <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400 group pt-4">
                <span>Launch Tool</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </div>
            </motion.button>
          )
        })}
      </motion.div>
    </div>
  )
}
