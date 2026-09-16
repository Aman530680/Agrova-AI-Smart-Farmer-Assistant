import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { useAppDispatch, useAppSelector } from '../store'
import { setLanguage } from '../store/slices/settingsSlice'
import { ArrowRight, Globe } from 'lucide-react'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { DEFAULT_FARMER } from '../data/dashboard'
import { loadProfile, saveProfile } from '../lib/profile'

const languageList = [
  { code: 'en', name: 'English', native: 'English' },
  { code: 'hi', name: 'Hindi', native: 'हिन्दी' },
  { code: 'ta', name: 'Tamil', native: 'தமிழ்' },
  { code: 'ml', name: 'Malayalam', native: 'മലയാളം' },
  { code: 'te', name: 'Telugu', native: 'తెలుగు' },
  { code: 'fr', name: 'French', native: 'Français' },
]

export default function LanguageSelect() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const currentLanguage = useAppSelector((s) => s.settings.language)
  const existing = loadProfile()
  const [form, setForm] = useState({
    name: existing.name || DEFAULT_FARMER.name,
    location: existing.location || DEFAULT_FARMER.location,
    language: currentLanguage || 'en',
  })

  const submit = () => {
    const nextProfile = {
      ...existing,
      name: form.name.trim() || DEFAULT_FARMER.name,
      location: form.location.trim() || DEFAULT_FARMER.location,
    }
    saveProfile(nextProfile)
    dispatch(setLanguage(form.language))
    navigate('/dashboard')
  }

  return (
    <div className="onboarding-page min-h-screen bg-[#f7faf5] px-4 py-8 text-[#183122] sm:px-6 sm:py-12">
      <div className="mx-auto max-w-4xl rounded-2xl border border-[#d8e7d6] bg-white p-5 shadow-[0_16px_42px_rgba(42,91,49,0.1)] sm:p-8">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#eaf6e5] text-[#2f6f3e]">
            <Globe className="h-7 w-7" />
          </div>
          <h1 className="font-display text-3xl font-extrabold text-[#183122] sm:text-4xl">{t('onboarding.title', 'Welcome to Agrova AI')}</h1>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-[#607364]">{t('onboarding.subtitle', 'Tell us about your farm to personalize the experience.')}</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <label className="space-y-2 text-sm font-semibold text-[#24452d]">
            <span>{t('onboarding.name', 'Name')}</span>
            <Input
              value={form.name}
              onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
              placeholder={t('onboarding.namePlaceholder', 'Rajesh Kumar')}
            />
          </label>

          <label className="space-y-2 text-sm font-semibold text-[#24452d]">
            <span>{t('onboarding.location', 'Location')}</span>
            <Input
              value={form.location}
              onChange={(e) => setForm((prev) => ({ ...prev, location: e.target.value }))}
              placeholder={t('onboarding.locationPlaceholder', 'Coimbatore, Tamil Nadu')}
            />
          </label>
        </div>

        <div className="mt-6">
          <p className="mb-3 text-sm font-semibold text-[#24452d]">{t('onboarding.language', 'Preferred Language')}</p>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
            {languageList.map((lang) => (
              <motion.button
                key={lang.code}
                whileHover={{ y: -2 }}
                type="button"
                onClick={() => setForm((prev) => ({ ...prev, language: lang.code }))}
                className={`rounded-2xl border p-5 text-left ${
                  form.language === lang.code ? 'border-[#3f8b4a] bg-[#edf7e9] shadow-sm' : 'border-[#dce8dc] bg-[#fbfdf9] hover:border-[#88bb8a] hover:bg-[#f5faf2]'
                }`}
              >
                <p className="text-lg font-bold text-[#183122]">{lang.native}</p>
                <p className="text-xs text-[#718174]">{lang.name}</p>
              </motion.button>
            ))}
          </div>
        </div>

        <div className="mt-8 flex justify-end">
          <Button onClick={submit}>
            {t('onboarding.continue', 'Continue')} <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
