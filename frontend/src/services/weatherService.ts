import { api } from '../lib/api'
import { sampleWeather } from '../data/weather'
import type { WeatherData } from '../types'

export async function fetchForecast(lat: number, lon: number): Promise<{ data: WeatherData; fallback: boolean }> {
  try {
    const { data } = await api.get('/weather/forecast', { params: { lat, lon } })
    return {
      data: {
        ...data,
        current: {
          ...data.current,
          feels_like: data.current.feels_like ?? Math.round(data.current.temp + 2),
          rain_probability: data.current.rain_probability ?? 35,
        },
        forecast: (data.forecast || []).map((d: WeatherData['forecast'][number], i: number) => ({
          ...d,
          rain: d.rain ?? [35, 12, 68, 55, 28, 8, 18][i] ?? 20,
        })),
      },
      fallback: false,
    }
  } catch {
    return { data: sampleWeather, fallback: true }
  }
}
