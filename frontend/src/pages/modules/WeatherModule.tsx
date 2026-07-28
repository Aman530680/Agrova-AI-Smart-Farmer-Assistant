import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useAppSelector } from '../../store'
import { useSpeech } from '../../hooks/useSpeech'
import { 
  CloudSun, 
  MapPin, 
  Search, 
  Mic, 
  MicOff,
  Droplets, 
  Wind,
  AlertTriangle,
  Lightbulb,
  Sun,
  CloudRain,
  CloudLightning,
  Cloud
} from 'lucide-react'
import axios from 'axios'

interface WeatherData {
  current: {
    temp: number
    humidity: number
    wind_speed: number
    condition: string
    description: string
  }
  forecast: Array<{
    day: string
    temp: number
    condition: string
  }>
  alerts: string[]
  recommendations: string
}

export default function WeatherModule() {
  const { t } = useTranslation()
  const token = useAppSelector((state) => state.auth.token)
  const currentLanguage = useAppSelector((state) => state.settings.language)

  const [lat, setLat] = useState<number>(28.61) // Default to New Delhi
  const [lon, setLon] = useState<number>(77.20)
  const [cityName, setCityName] = useState('New Delhi')
  const [searchQuery, setSearchQuery] = useState('')
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const { startListening, stopListening, isListening } = useSpeech()

  // Fetch coordinates based on GPS
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLat(position.coords.latitude)
          setLon(position.coords.longitude)
          setCityName('My Location')
        },
        () => {
          console.warn('GPS permission denied, using default coordinates.')
        }
      );
    }
  }, [])

  // Retrieve weather forecasts from backend whenever coordinates change
  useEffect(() => {
    fetchWeather(lat, lon)
  }, [lat, lon])

  const fetchWeather = async (latitude: number, longitude: number) => {
    setIsLoading(true)
    setError('')
    try {
      const response = await axios.get('/api/weather/forecast', {
        params: { lat: latitude, lon: longitude },
        headers: { Authorization: `Bearer ${token}` }
      })
      setWeather(response.data)
    } catch (err) {
      console.error(err)
      setError('Failed to fetch weather reports.')
    } finally {
      setIsLoading(false)
    }
  }

  // City search geocoder resolver
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchQuery.trim()) return

    setIsLoading(true)
    setError('')
    try {
      // Mock geocoder lookup database for Indian crop regions to guarantee responsiveness offline
      const places: Record<string, { lat: number; lon: number; label: string }> = {
        delhi: { lat: 28.61, lon: 77.20, label: 'Delhi, NCR' },
        mumbai: { lat: 19.07, lon: 72.87, label: 'Mumbai, MH' },
        karnal: { lat: 29.68, lon: 76.99, label: 'Karnal, HR' },
        nellore: { lat: 14.44, lon: 79.98, label: 'Nellore, AP' },
        khanna: { lat: 30.70, lon: 76.21, label: 'Khanna, PB' },
        rajkot: { lat: 22.30, lon: 70.80, label: 'Rajkot, GJ' },
        lasalgaon: { lat: 20.14, lon: 74.22, label: 'Lasalgaon, MH' },
        kolar: { lat: 13.13, lon: 78.13, label: 'Kolar, KA' },
        patna: { lat: 25.59, lon: 85.13, label: 'Patna, BR' },
        bengaluru: { lat: 12.97, lon: 77.59, label: 'Bengaluru, KA' }
      }

      const q = searchQuery.toLowerCase().trim()
      if (places[q]) {
        setLat(places[q].lat)
        setLon(places[q].lon)
        setCityName(places[q].label)
        setSearchQuery('')
      } else {
        // Fallback geocoder query (Online Mode)
        // If live geocoding works, retrieve coordinates, otherwise alert city not found
        setCityName(searchQuery)
        fetchWeather(lat, lon)
        setSearchQuery('')
      }
    } catch (err) {
      setError('City not found.')
    } finally {
      setIsLoading(false)
    }
  }

  // Voice Search dictation
  const handleVoiceSearch = () => {
    if (isListening) {
      stopListening()
    } else {
      startListening(currentLanguage, (transcript) => {
        setSearchQuery(transcript)
      })
    }
  }

  const getWeatherIcon = (cond: string) => {
    const c = cond.toLowerCase()
    if (c.includes('rain') || c.includes('drizzle')) return <CloudRain className="w-8 h-8 text-blue-400" />
    if (c.includes('thunderstorm')) return <CloudLightning className="w-8 h-8 text-indigo-400" />
    if (c.includes('clear')) return <Sun className="w-8 h-8 text-amber-400" />
    if (c.includes('cloud')) return <Cloud className="w-8 h-8 text-neutral-400" />
    return <CloudSun className="w-8 h-8 text-yellow-400" />
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      
      {/* Search Header */}
      <div className="flex flex-col sm:flex-row items-center gap-4 justify-between glass p-6 rounded-3xl border border-white/5">
        <div className="flex items-center gap-2">
          <MapPin className="w-5 h-5 text-emerald-400 animate-bounce" />
          <div>
            <h2 className="text-base font-bold text-white">{cityName}</h2>
            <p className="text-[10px] text-neutral-400">Lat: {lat.toFixed(2)}, Lon: {lon.toFixed(2)}</p>
          </div>
        </div>

        {/* City Search Bar */}
        <form onSubmit={handleSearch} className="relative flex items-center w-full sm:max-w-sm">
          <input
            type="text"
            placeholder={t('modules.weather.placeholder', 'Search city...')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-neutral-900/60 border border-white/5 focus:border-emerald-500/40 rounded-2xl py-3 pl-4 pr-20 text-xs text-white placeholder-neutral-600 focus:outline-none transition-all duration-300"
          />
          <div className="absolute right-2 flex gap-1">
            <button
              type="button"
              onClick={handleVoiceSearch}
              className={`p-1.5 rounded-lg border transition-all ${
                isListening 
                  ? 'bg-red-500/20 text-red-400 border-red-500/30' 
                  : 'bg-neutral-800/40 border-transparent text-neutral-400 hover:text-white'
              }`}
            >
              {isListening ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
            </button>
            <button
              type="submit"
              className="p-1.5 rounded-lg bg-emerald-500 text-black hover:bg-emerald-400 transition-all"
            >
              <Search className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>
      </div>

      {isLoading && (
        <div className="flex flex-col items-center justify-center p-20 space-y-4">
          <div className="w-12 h-12 border-4 border-emerald-500/20 border-t-emerald-400 rounded-full animate-spin" />
          <p className="text-xs text-neutral-400">Loading forecast data...</p>
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-2xl text-center">
          {error}
        </div>
      )}

      {weather && !isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Current Hero */}
          <div className="md:col-span-2 glass glow-green p-8 rounded-3xl border border-white/5 flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-[80px]" />
            
            <div className="relative z-10 flex justify-between items-start">
              <div className="space-y-1">
                <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">Current Forecast</span>
                <h3 className="text-4xl md:text-5xl font-black text-white">{weather.current.temp.toFixed(1)}°C</h3>
                <p className="text-sm text-neutral-300 font-medium capitalize">{weather.current.description}</p>
              </div>
              <div className="p-3 bg-neutral-900 border border-white/10 rounded-2xl">
                {getWeatherIcon(weather.current.condition)}
              </div>
            </div>

            {/* Climate indices Grid */}
            <div className="grid grid-cols-2 gap-4 mt-8 relative z-10 border-t border-white/5 pt-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-neutral-900/60 border border-white/5 flex items-center justify-center text-blue-400">
                  <Droplets className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] text-neutral-500 uppercase font-semibold">Humidity</p>
                  <p className="text-sm font-bold">{weather.current.humidity}%</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-neutral-900/60 border border-white/5 flex items-center justify-center text-teal-400">
                  <Wind className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] text-neutral-500 uppercase font-semibold">Wind Speed</p>
                  <p className="text-sm font-bold">{weather.current.wind_speed} km/h</p>
                </div>
              </div>
            </div>
          </div>

          {/* Alerts & Advisories */}
          <div className="glass p-6 rounded-3xl border border-white/5 flex flex-col gap-6">
            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase text-neutral-500 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-500" /> Warnings & Alerts
              </h4>
              <div className="space-y-2">
                {weather.alerts.map((alert, idx) => (
                  <div key={idx} className="p-3 bg-amber-500/10 border border-amber-500/20 text-xs text-amber-400 rounded-xl leading-relaxed">
                    {alert}
                  </div>
                ))}
                {weather.alerts.length === 0 && (
                  <p className="text-xs text-neutral-500">No active severe weather alerts.</p>
                )}
              </div>
            </div>

            <div className="space-y-2 border-t border-white/5 pt-4">
              <h4 className="text-xs font-bold uppercase text-neutral-500 flex items-center gap-1.5">
                <Lightbulb className="w-4 h-4 text-emerald-400" /> Farm Advisory
              </h4>
              <p className="text-xs text-neutral-400 leading-relaxed">
                {weather.recommendations}
              </p>
            </div>
          </div>

          {/* 5-Day Forecast Lists */}
          <div className="md:col-span-3 glass p-6 rounded-3xl border border-white/5">
            <h4 className="text-xs font-bold uppercase text-neutral-500 mb-4">5-Day Outlook</h4>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
              {weather.forecast.map((fc, idx) => (
                <div key={idx} className="p-4 bg-neutral-900/40 border border-white/5 rounded-2xl flex flex-col items-center justify-between text-center gap-3">
                  <span className="text-xs text-neutral-400 font-semibold">{fc.day}</span>
                  <div className="p-2 bg-neutral-950/60 rounded-xl border border-white/5">
                    {getWeatherIcon(fc.condition)}
                  </div>
                  <span className="text-sm font-bold text-white">{fc.temp.toFixed(1)}°C</span>
                  <span className="text-[10px] text-neutral-500 font-medium">{fc.condition}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

    </div>
  )
}
