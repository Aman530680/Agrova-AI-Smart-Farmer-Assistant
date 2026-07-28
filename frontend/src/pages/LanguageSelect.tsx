import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { useAppDispatch, useAppSelector } from '../store'
import { setLanguage } from '../store/slices/settingsSlice'
import { Globe, ArrowRight } from 'lucide-react'

const languageList = [
  { code: 'en', name: 'English', native: 'English' },
  { code: 'hi', name: 'Hindi', native: 'हिंदी' },
  { code: 'ta', name: 'Tamil', native: 'தமிழ்' },
  { code: 'te', name: 'Telugu', native: 'తెలుగు' },
  { code: 'kn', name: 'Kannada', native: 'ಕನ್ನಡ' },
  { code: 'ml', name: 'Malayalam', native: 'മലയാളം' },
  { code: 'mr', name: 'Marathi', native: 'मराठी' },
  { code: 'gu', name: 'Gujarati', native: 'ગુજરાતી' },
  { code: 'bn', name: 'Bengali', native: 'বাংলা' },
  { code: 'pa', name: 'Punjabi', native: 'ਪੰਜਾਬੀ' },
  { code: 'as', name: 'Assamese', native: 'অসমীয়া' },
  { code: 'or', name: 'Odia', native: 'ଓଡ଼ିଆ' },
  { code: 'ur', name: 'Urdu', native: 'اردو' }
]

export default function LanguageSelect() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const currentLanguage = useAppSelector((state) => state.settings.language)
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated)

  const handleSelectLanguage = (code: string) => {
    dispatch(setLanguage(code))
  }

  const handleConfirm = () => {
    if (isAuthenticated) {
      navigate('/dashboard')
    } else {
      navigate('/login')
    }
  }

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-950 via-neutral-950 to-black text-white p-4">
      {/* Decorative glows */}
      <div className="absolute top-10 w-96 h-96 bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-4xl glass glow-green rounded-3xl p-8 md:p-12 space-y-8 relative z-10">
        
        {/* Page Title */}
        <div className="text-center space-y-3">
          <div className="mx-auto w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center">
            <Globe className="w-6 h-6 text-amber-400" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-emerald-400 to-amber-200 bg-clip-text text-transparent">
            {t('language.select', 'Choose Your Language')}
          </h1>
          <p className="text-sm text-neutral-400">
            Please choose a language to update the entire experience.
          </p>
        </div>

        {/* Language Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {languageList.map((lang) => {
            const isSelected = currentLanguage === lang.code
            return (
              <motion.button
                key={lang.code}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleSelectLanguage(lang.code)}
                className={`p-5 rounded-2xl border text-left flex flex-col justify-between transition-all duration-300 ${
                  isSelected
                    ? 'bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 border-emerald-500 glow-green'
                    : 'bg-neutral-900/40 border-white/5 hover:border-emerald-500/30'
                }`}
              >
                <div className="flex justify-between items-center w-full">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                    isSelected ? 'bg-emerald-500 text-black' : 'bg-neutral-800 text-neutral-400'
                  }`}>
                    {lang.code.toUpperCase()}
                  </span>
                  {isSelected && (
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  )}
                </div>
                <div className="mt-4">
                  <h2 className="text-base font-semibold tracking-tight text-white">
                    {lang.native}
                  </h2>
                  <p className="text-xs text-neutral-400">
                    {lang.name}
                  </p>
                </div>
              </motion.button>
            )
          })}
        </div>

        {/* Confirm Button */}
        <div className="flex justify-end pt-4">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleConfirm}
            className="flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-emerald-500 to-emerald-400 text-black font-semibold rounded-2xl shadow-xl shadow-emerald-500/10 hover:shadow-emerald-500/20 transition-all duration-300"
          >
            {t('landing.continue', 'Continue')}
            <ArrowRight className="w-5 h-5" />
          </motion.button>
        </div>

      </div>
    </div>
  )
}
