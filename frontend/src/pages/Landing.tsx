import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import {
  ArrowRight,
  Bot,
  CloudSun,
  Coins,
  Leaf,
  ShieldCheck,
  Sprout,
  Stethoscope,
} from 'lucide-react'
import { Button } from '../components/ui/Button'

const features = [
  { icon: Bot, titleKey: 'landing.features.kisanMitra.title', bodyKey: 'landing.features.kisanMitra.body' },
  { icon: Stethoscope, titleKey: 'landing.features.cropDoctor.title', bodyKey: 'landing.features.cropDoctor.body' },
  { icon: CloudSun, titleKey: 'landing.features.weather.title', bodyKey: 'landing.features.weather.body' },
  { icon: Coins, titleKey: 'landing.features.market.title', bodyKey: 'landing.features.market.body' },
  { icon: Leaf, titleKey: 'landing.features.crop.title', bodyKey: 'landing.features.crop.body' },
  { icon: ShieldCheck, titleKey: 'landing.features.schemes.title', bodyKey: 'landing.features.schemes.body' },
]

export default function Landing() {
  const navigate = useNavigate()
  const { t } = useTranslation()

  return (
    <div className="landing-page min-h-screen bg-[#f7faf5] text-[#183122]">
      <div className="landing-atmosphere pointer-events-none absolute inset-0" />
      <header className="relative z-10 mx-auto flex max-w-6xl items-center justify-between px-5 py-4 md:px-8">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#2f6f3e] text-white shadow-sm">
            <Sprout className="h-5 w-5" />
          </div>
          <div>
            <span className="font-display text-lg font-extrabold text-[#183122]">Agrova AI</span>
            <p className="hidden text-[11px] text-[#607364] sm:block">{t('landing.farmerAssistant', 'Practical help for your farm')}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <Button size="sm" onClick={() => navigate('/language')}>{t('landing.getStarted', 'Get Started')}</Button>
        </div>
      </header>

      <main className="relative z-10">
        <section className="mx-auto grid max-w-6xl gap-8 px-5 pb-12 pt-10 md:grid-cols-[1.1fr_0.9fr] md:items-center md:px-8 md:pb-16 md:pt-14">
          <div>
            <motion.p initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mb-4 inline-flex rounded-full border border-[#cfe4cd] bg-[#edf7e9] px-3 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-[#2f6f3e]">
              {t('landing.badge', 'AgriTech intelligence for Indian farms')}
            </motion.p>
            <motion.h1 initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="font-display text-4xl font-extrabold leading-[1.08] tracking-tight text-[#183122] md:text-6xl">
              {t('landing.heroTitle', 'Smart Farming.')}
              <br />
              {t('landing.heroTitle2', 'Better Decisions.')}
              <br />
              <span className="text-[#2f6f3e]">{t('landing.heroTitle3', 'Better Harvests.')}</span>
            </motion.h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-[#607364] md:text-lg">
              {t('landing.subtitle', 'Agrova AI gives Indian farmers intelligent agricultural guidance — from crop planning and pest diagnosis to mandi prices and weather insights.')}
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Button size="lg" onClick={() => navigate('/language')}>
              {t('landing.getStarted', 'Get Started')} <ArrowRight className="h-4 w-4" />
            </Button>
            </div>
          </div>
          <div className="relative rounded-2xl border border-[#d8e7d6] bg-white p-5 shadow-[0_18px_45px_rgba(42,91,49,0.1)] md:p-6">
            <div className="flex items-center justify-between border-b border-[#e7efe4] pb-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#718174]">{t('landing.previewLabel', 'Your farm, at a glance')}</p>
                <p className="mt-1 font-display text-lg font-bold text-[#183122]">{t('landing.previewTitle', 'Simple advice for today')}</p>
              </div>
              <Leaf className="h-7 w-7 text-[#4b963f]" />
            </div>
            <div className="mt-5 grid grid-cols-2 gap-3">
              {[
                ['🌱', t('landing.preview.crop', 'Tomato crop'), t('landing.preview.cropMeta', 'Day 42 · Good')],
                ['🌤️', t('landing.preview.weather', 'Today’s weather'), '29°C · Clear'],
                ['₹', t('landing.preview.price', 'Today’s price'), '₹2,850 / quintal'],
                ['✓', t('landing.preview.advice', 'Farm advice'), t('landing.preview.adviceMeta', 'Wait before watering')],
              ].map(([icon, title, meta]) => (
                <div key={title} className="rounded-xl bg-[#f5f9f2] p-3">
                  <span className="text-xl">{icon}</span>
                  <p className="mt-2 text-sm font-semibold text-[#24452d]">{title}</p>
                  <p className="mt-1 text-xs leading-relaxed text-[#718174]">{meta}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto grid max-w-6xl gap-3 px-5 pb-14 sm:grid-cols-2 md:px-8 lg:grid-cols-3">
          {features.map((f) => (
            <article key={f.titleKey} className="rounded-xl border border-[#dce8dc] bg-white p-5 text-left shadow-[0_2px_10px_rgba(35,76,45,0.04)]">
              <f.icon className="mb-3 h-6 w-6 text-[#3f8b4a]" />
              <h3 className="font-display text-lg font-bold text-[#183122]">{t(f.titleKey)}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[#607364]">{t(f.bodyKey)}</p>
            </article>
          ))}
        </section>

        <section className="mx-auto max-w-6xl px-5 pb-14 md:px-8">
          <h2 className="font-display text-2xl font-extrabold text-[#183122]">{t('landing.howItWorks', 'How it works')}</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {[1,2,3].map((step) => (
              <div key={step} className="rounded-xl border border-[#dce8dc] bg-white p-5">
                <p className="text-sm font-bold text-[#3f8b4a]">0{step}</p>
                <p className="mt-3 text-lg font-semibold text-[#24452d]">{t(`landing.steps.${step}`)}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="relative z-10 border-t border-[#dce8dc] px-5 py-6 text-center text-xs text-[#718174]">
        © 2026 Agrova AI · {t('landing.footerText', 'Built for Indian farmers')} · Coimbatore, Tamil Nadu
      </footer>
    </div>
  )
}
