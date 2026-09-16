import { useCallback, useEffect, useState, type FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { CloudSun, Droplets, Thermometer, Wind } from 'lucide-react'
import { Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { PageContainer } from '../../components/layout/PageContainer'
import { Card } from '../../components/ui/Card'
import { Input } from '../../components/ui/Input'
import { Button } from '../../components/ui/Button'
import { Skeleton } from '../../components/ui/Skeleton'
import { fetchForecast } from '../../services/weatherService'
import { weatherLocations } from '../../data/weather'
import { COIMBATORE } from '../../data/dashboard'
import type { WeatherData } from '../../types'

export default function WeatherModule() {
  const { t } = useTranslation()
  const [lat, setLat] = useState(COIMBATORE.lat)
  const [lon, setLatLon] = useState(COIMBATORE.lon)
  const [label, setLabel] = useState(COIMBATORE.label)
  const [q, setQ] = useState('')
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [fallback, setFallback] = useState(false)

  const load = useCallback(async (a = lat, b = lon) => {
    setLoading(true)
    setError('')
    try {
      const res = await fetchForecast(a, b)
      setWeather(res.data)
      setFallback(res.fallback)
    } catch {
      setError(t('modules.weather.error', "We couldn't load the weather. Please try again."))
    } finally {
      setLoading(false)
    }
  }, [lat, lon, t])

  useEffect(() => {
    load()
  }, [load])

  const search = (e: FormEvent) => {
    e.preventDefault()
    const hit = weatherLocations[q.toLowerCase().trim()]
    if (hit) {
      setLat(hit.lat)
      setLatLon(hit.lon)
      setLabel(hit.label)
      setQ('')
    } else {
      setLabel(q || COIMBATORE.label)
    }
  }

  const c = weather?.current

  return (
    <PageContainer
      title={t('modules.weather.title', 'Weather')}
      subtitle={label}
      actions={
        <form onSubmit={search} className="flex gap-2">
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder={t('modules.weather.searchCity', 'Search city (Coimbatore)')} />
          <Button type="submit">{t('common.go', 'Go')}</Button>
        </form>
      }
    >
      {fallback && <p className="text-xs text-amber-600">{t('modules.weather.fallback', 'Showing sample weather while the live forecast is unavailable.')}</p>}
      {loading && <Skeleton className="h-72 w-full" />}
      {error && (
        <Card className="text-center">
          {error} <Button className="ml-2" size="sm" onClick={() => load()}>{t('common.retry', 'Try again')}</Button>
        </Card>
      )}
      {weather && !loading && c && (
        <>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            <Card className="md:col-span-2">
              <CloudSun className="mb-2 h-8 w-8 text-amber-400" />
              <p className="font-display text-5xl font-extrabold">{Math.round(c.temp)}°C</p>
              <p className="capitalize text-muted-foreground">{c.description || 'Partly Cloudy'}</p>
            </Card>
            <Metric icon={Thermometer} k={t('modules.weather.feelsLike', 'Feels like')} v={`${Math.round(c.feels_like ?? c.temp + 2)}°C`} />
            <Metric icon={Droplets} k={t('modules.weather.humidity', 'Humidity')} v={`${c.humidity}%`} />
            <Metric icon={Wind} k={t('modules.weather.wind', 'Wind')} v={`${c.wind_speed} km/h`} />
          </div>
          <Card>
            <p className="mb-2 text-sm font-semibold">{t('modules.weather.rainProbability', 'Rain chance')} {c.rain_probability ?? 35}%</p>
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="h-56">
                <p className="mb-2 text-xs uppercase text-muted-foreground">{t('modules.weather.temperature', 'Temperature')}</p>
                <ResponsiveContainer>
                  <AreaChart data={weather.forecast}>
                    <CartesianGrid strokeDasharray="3 3" className="text-border" stroke="currentColor" />
                    <XAxis dataKey="day" fontSize={11} />
                    <YAxis fontSize={11} />
                    <Tooltip />
                    <Area dataKey="temp" stroke="#10b981" fill="#10b98133" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div className="h-56">
                <p className="mb-2 text-xs uppercase text-muted-foreground">{t('modules.weather.rainProbability', 'Rain chance')}</p>
                <ResponsiveContainer>
                  <BarChart data={weather.forecast}>
                    <XAxis dataKey="day" fontSize={11} />
                    <Tooltip />
                    <Bar dataKey="rain" fill="#38bdf8" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </Card>
          <div className="grid gap-3 sm:grid-cols-4 md:grid-cols-7">
            {weather.forecast.slice(0, 7).map((d) => (
              <Card key={d.day} className="text-center">
                <p className="text-xs font-semibold">{d.day}</p>
                <p className="mt-2 text-lg font-bold">{Math.round(d.temp)}°</p>
                <p className="text-[11px] text-muted-foreground">{d.condition}</p>
              </Card>
            ))}
          </div>
          <Card>
            <h3 className="font-display font-bold">{t('modules.weather.advisory', "Today's farm advice")}</h3>
            <p className="mt-2 text-sm leading-relaxed">{weather.recommendations}</p>
            <ul className="mt-3 list-disc pl-5 text-sm text-muted-foreground">
              {weather.alerts.map((a) => (
                <li key={a}>{a}</li>
              ))}
            </ul>
          </Card>
        </>
      )}
    </PageContainer>
  )
}

function Metric({ icon: Icon, k, v }: { icon: typeof Wind; k: string; v: string }) {
  return (
    <Card>
      <Icon className="mb-2 h-5 w-5 text-emerald-500" />
      <p className="text-xs uppercase text-muted-foreground">{k}</p>
      <p className="text-xl font-bold">{v}</p>
    </Card>
  )
}
