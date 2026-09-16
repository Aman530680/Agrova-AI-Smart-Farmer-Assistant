export interface User {
  id: string
  name: string
  email: string
  primary_language: string
}

export interface FarmerProfile {
  name: string
  location: string
  primaryCrop: string
  farmSize: string
  experience: string
  district: string
  state: string
}

export interface AppSettings {
  theme: 'light' | 'dark'
  language: string
  notifications: boolean
  weatherLocation: string
  marketAlerts: boolean
  aiVoice: boolean
  compactMode: boolean
}

export interface WeatherCurrent {
  temp: number
  humidity: number
  wind_speed: number
  condition: string
  description: string
  feels_like?: number
  rain_probability?: number
}

export interface WeatherForecastDay {
  day: string
  temp: number
  condition: string
  rain?: number
}

export interface WeatherData {
  current: WeatherCurrent
  forecast: WeatherForecastDay[]
  alerts: string[]
  recommendations: string
}

export interface CommodityPrice {
  id: string
  commodity: string
  market: string
  state: string
  min_price: number
  max_price: number
  modal_price: number
  unit: string
  change?: number
  district?: string
}

export interface FavoriteItem {
  id: string
  user_id: string
  commodity: string
  market_name: string
  created_at: string
}

export interface DiagnosisResult {
  disease_detected: string
  symptoms: string
  treatment: string
  organic_solution: string
  chemical_solution: string
  recommended_pesticides: string[]
  warning?: string
  confidence?: number
  severity?: string
  crop?: string
  prevention?: string
}

export interface Scheme {
  id: string
  name: string
  authority: string
  category: string
  eligibility: string
  benefits: string
  documents: string
  official_link: string
  region?: string
}

export interface BookmarkItem {
  id: string
  user_id: string
  scheme_id: string
  bookmarked_at: string
}

export interface ActiveCrop {
  id: string
  crop_name: string
  sowing_date: string
  current_stage: string
  created_at: string
}

export interface ScheduleEvent {
  stage: string
  start_date: string
  end_date: string
  task: string
  water_requirement: string
  fertilizer_recommendation: string
}

export interface CropScheduleResponse {
  crop_name: string
  sowing_date: string
  current_stage: string
  schedule: ScheduleEvent[]
}

export interface ChatMessage {
  id: string
  role: 'user' | 'model'
  content: string
  createdAt: string
}

export interface NotificationItem {
  id: string
  title: string
  body: string
  time: string
  type: 'weather' | 'market' | 'crop' | 'ai'
  unread: boolean
}
