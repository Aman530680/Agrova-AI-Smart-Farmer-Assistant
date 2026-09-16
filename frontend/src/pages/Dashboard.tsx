import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { ArrowRight, CloudSun, Coins, Leaf, MapPin, Shield, Sprout } from 'lucide-react'
import { PageContainer } from '../components/layout/PageContainer'
import { Card } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { Progress } from '../components/ui/Progress'
import { Button } from '../components/ui/Button'
import { greetingForHour, todayLabel } from '../lib/utils'
import { loadProfile } from '../lib/profile'
import {
  agriculturalAlerts,
  aiRecommendations,
  recentActivity,
  tomatoPriceTrend,
} from '../data/dashboard'
import { cropGuides } from '../data/crops'
import { sampleWeather } from '../data/weather'

export default function Dashboard() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const profile = loadProfile()
  const tomato = cropGuides[0]
  const progress = Math.round((tomato.currentDay / tomato.durationDays) * 100)
  const greeting = useMemo(() => greetingForHour(), [])

  return (
    <PageContainer>
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm text-[#607364]">{todayLabel()}</p>
          <h1 className="font-display text-3xl font-extrabold tracking-tight">
            {t('dashboard.greeting', greeting)}, {profile.name.split(' ')[0]} 👋
          </h1>
          <p className="mt-1 flex items-center gap-1.5 text-sm text-[#607364]">
            <MapPin className="h-4 w-4 text-emerald-500" /> {profile.location}
          </p>
        </div>
        <Button onClick={() => navigate('/dashboard/chatbot')}>{t('nav.kisanMitra', 'Ask Kisan Mitra')}</Button>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Stat icon={Leaf} label={t('dashboard.activeCrop', 'My Crop')} value="Tomato" meta={`${t('dashboard.day', 'Day')} ${tomato.currentDay} ${t('dashboard.of', 'of')} ${tomato.durationDays}`} tone="green" />
        <Stat icon={Shield} label={t('dashboard.health', 'Crop Health')} value={t('dashboard.healthy', 'Good')} meta="87% · No critical pests" tone="green" />
        <Stat icon={CloudSun} label={t('dashboard.weather', "Today's Weather")} value={`${sampleWeather.current.temp}°C`} meta={sampleWeather.current.description} tone="blue" />
        <Stat icon={Coins} label={t('dashboard.market', "Today's Price")} value="₹2,850" meta="per quintal · Tomato" tone="amber" />
      </div>

      <div className="grid gap-3 lg:grid-cols-[1.15fr_0.85fr]">
        <Card className="overflow-hidden">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#718174]">{t('dashboard.today', 'Today')}</p>
              <h3 className="mt-1 font-display font-bold text-[#183122]">{t('dashboard.weatherOverview', 'Weather overview')}</h3>
            </div>
            <Badge>Coimbatore</Badge>
          </div>
          <div className="mb-4 grid grid-cols-2 gap-3 md:grid-cols-4">
            <Mini k="Now" v={`${sampleWeather.current.temp}°C`} />
            <Mini k="Humidity" v={`${sampleWeather.current.humidity}%`} />
            <Mini k="Wind" v={`${sampleWeather.current.wind_speed} km/h`} />
            <Mini k="Rain" v={`${sampleWeather.current.rain_probability}%`} />
          </div>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={sampleWeather.forecast}>
                <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-border" />
                <XAxis dataKey="day" fontSize={11} />
                <YAxis fontSize={11} />
                <Tooltip />
                <Area type="monotone" dataKey="temp" stroke="#10b981" fill="#10b98133" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card className="flex flex-col justify-between bg-[#edf7e9]">
          <div>
            <div className="flex items-center gap-2">
              <Sprout className="h-5 w-5 text-[#3f8b4a]" />
              <h3 className="font-display font-bold text-[#183122]">{t('dashboard.adviceTitle', "Today's advice")}</h3>
            </div>
            <p className="mt-4 text-xl font-semibold leading-snug text-[#24452d]">{t('dashboard.advice', 'Rain may come tomorrow. You can wait before watering.')}</p>
            <p className="mt-3 text-sm leading-relaxed text-[#607364]">{t('dashboard.adviceDetail', 'Keep leaves dry and check the lower tomato leaves this evening.')}</p>
          </div>
          <Button variant="secondary" className="mt-6 w-fit" onClick={() => navigate('/dashboard/chatbot')}>
            {t('dashboard.askAdvice', 'Get more advice')} <ArrowRight className="h-4 w-4" />
          </Button>
        </Card>
      </div>

      <div className="grid gap-3 lg:grid-cols-2">
        <Card>
          <div className="mb-3 flex items-center justify-between">
            <h3 className="font-display font-bold">{t('dashboard.marketTrend', 'Price this week')}</h3>
            <Coins className="h-5 w-5 text-[#c57a16]" />
          </div>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={tomatoPriceTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-border" />
                <XAxis dataKey="day" fontSize={11} />
                <YAxis fontSize={11} />
                <Tooltip />
                <Area type="monotone" dataKey="price" stroke="#f59e0b" fill="#f59e0b22" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card>
          <div className="mb-3 flex items-center justify-between">
            <h3 className="font-display font-bold">{t('dashboard.lifecycle', 'My crop progress')}</h3>
            <Leaf className="h-5 w-5 text-[#3f8b4a]" />
          </div>
          <p className="mb-2 text-sm text-[#607364]">Tomato · {tomato.currentStage} · {progress}%</p>
          <Progress value={progress} />
          <div className="mt-5 grid grid-cols-2 gap-2 text-xs">
            {tomato.stages.map((s) => (
              <div key={s.name} className="rounded-xl border border-border px-3 py-2">
                <p className="font-semibold">{s.name}</p>
                <p className="text-muted-foreground">Day {s.day}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid gap-3 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <h3 className="mb-3 font-display font-bold">{t('dashboard.recs', 'What to do next')}</h3>
          <div className="space-y-3">
            {aiRecommendations.map((r) => (
              <button key={r.id} onClick={() => navigate('/dashboard/chatbot')} className="w-full rounded-xl border border-border p-3 text-left hover:border-emerald-500/40">
                <Badge>{r.tag}</Badge>
                <p className="mt-2 text-sm font-semibold">{r.title}</p>
                <p className="mt-1 text-xs text-muted-foreground">{r.body}</p>
              </button>
            ))}
          </div>
        </Card>
        <Card>
          <h3 className="mb-3 font-display font-bold">{t('dashboard.activity', 'Recent activity')}</h3>
          <ul className="space-y-3">
            {recentActivity.map((a) => (
              <li key={a.id} className="border-b border-border pb-3 last:border-0">
                <p className="text-sm font-medium">{a.title}</p>
                <p className="text-xs text-muted-foreground">{a.time}</p>
              </li>
            ))}
          </ul>
        </Card>
        <Card>
          <h3 className="mb-3 font-display font-bold">{t('dashboard.alerts', 'Farm alerts')}</h3>
          <div className="space-y-3">
            {agriculturalAlerts.map((a) => (
              <div key={a.id} className="rounded-xl border border-border p-3">
                <p className="text-sm font-semibold">{a.title}</p>
                <p className="text-xs text-muted-foreground">{a.body}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </PageContainer>
  )
}

function Stat({ icon: Icon, label, value, meta, tone }: { icon: typeof Leaf; label: string; value: string; meta: string; tone: 'green' | 'blue' | 'amber' }) {
  const toneClass = tone === 'blue' ? 'bg-[#e9f4f6] text-[#23717b]' : tone === 'amber' ? 'bg-[#fff5df] text-[#b56d08]' : 'bg-[#edf7e9] text-[#3f8b4a]'
  return (
    <Card className="flex items-start gap-3">
      <div className={`rounded-xl p-2.5 ${toneClass}`}>
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-[#718174]">{label}</p>
        <p className="font-display text-xl font-extrabold text-[#183122]">{value}</p>
        <p className="text-xs text-[#607364]">{meta}</p>
      </div>
    </Card>
  )
}

function Mini({ k, v }: { k: string; v: string }) {
  return (
    <div className="rounded-xl bg-muted/60 px-3 py-2">
      <p className="text-[10px] uppercase text-muted-foreground">{k}</p>
      <p className="font-semibold">{v}</p>
    </div>
  )
}
