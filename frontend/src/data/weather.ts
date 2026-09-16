import type { WeatherData } from '../types'

export const sampleWeather: WeatherData = {
  current: {
    temp: 29,
    humidity: 72,
    wind_speed: 14,
    condition: 'Clouds',
    description: 'Partly Cloudy',
    feels_like: 31,
    rain_probability: 35,
  },
  forecast: [
    { day: 'Thu', temp: 29, condition: 'Clouds', rain: 35 },
    { day: 'Fri', temp: 30, condition: 'Clear', rain: 12 },
    { day: 'Sat', temp: 28, condition: 'Rain', rain: 68 },
    { day: 'Sun', temp: 27, condition: 'Rain', rain: 55 },
    { day: 'Mon', temp: 29, condition: 'Clouds', rain: 28 },
    { day: 'Tue', temp: 31, condition: 'Clear', rain: 8 },
    { day: 'Wed', temp: 30, condition: 'Clouds', rain: 18 },
  ],
  alerts: ['Moderate humidity. Monitor tomato foliage for early blight.'],
  recommendations:
    'Irrigate in the early morning. Avoid pesticide sprays if evening showers develop. Fruiting tomatoes benefit from a light potassium feed this week.',
}

export const weatherLocations: Record<string, { lat: number; lon: number; label: string }> = {
  coimbatore: { lat: 11.0168, lon: 76.9558, label: 'Coimbatore, Tamil Nadu' },
  mettupalayam: { lat: 11.299, lon: 76.934, label: 'Mettupalayam, Tamil Nadu' },
  pollachi: { lat: 10.658, lon: 77.008, label: 'Pollachi, Tamil Nadu' },
  erode: { lat: 11.341, lon: 77.717, label: 'Erode, Tamil Nadu' },
  chennai: { lat: 13.0827, lon: 80.2707, label: 'Chennai, Tamil Nadu' },
  delhi: { lat: 28.61, lon: 77.2, label: 'Delhi, NCR' },
  mumbai: { lat: 19.07, lon: 72.87, label: 'Mumbai, MH' },
  karnal: { lat: 29.68, lon: 76.99, label: 'Karnal, HR' },
  nellore: { lat: 14.44, lon: 79.98, label: 'Nellore, AP' },
  khanna: { lat: 30.7, lon: 76.21, label: 'Khanna, PB' },
  rajkot: { lat: 22.3, lon: 70.8, label: 'Rajkot, GJ' },
  lasalgaon: { lat: 20.14, lon: 74.22, label: 'Lasalgaon, MH' },
  kolar: { lat: 13.13, lon: 78.13, label: 'Kolar, KA' },
  patna: { lat: 25.59, lon: 85.13, label: 'Patna, BR' },
  bengaluru: { lat: 12.97, lon: 77.59, label: 'Bengaluru, KA' },
}
