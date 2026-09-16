import type { NotificationItem } from '../types'

export const DEFAULT_FARMER = {
  name: 'Rajesh Kumar',
  location: 'Coimbatore, Tamil Nadu',
  primaryCrop: 'Tomato',
  farmSize: '4.5 acres',
  experience: '12 years',
  district: 'Coimbatore',
  state: 'Tamil Nadu',
}

export const COIMBATORE = { lat: 11.0168, lon: 76.9558, label: 'Coimbatore, Tamil Nadu' }

export const cropHealthSeries = [
  { day: 'Mon', score: 82 },
  { day: 'Tue', score: 84 },
  { day: 'Wed', score: 83 },
  { day: 'Thu', score: 86 },
  { day: 'Fri', score: 88 },
  { day: 'Sat', score: 87 },
  { day: 'Sun', score: 87 },
]

export const tomatoPriceTrend = [
  { day: 'Mon', price: 2480 },
  { day: 'Tue', price: 2550 },
  { day: 'Wed', price: 2610 },
  { day: 'Thu', price: 2700 },
  { day: 'Fri', price: 2780 },
  { day: 'Sat', price: 2820 },
  { day: 'Sun', price: 2850 },
]

export const aiRecommendations = [
  {
    id: 'r1',
    title: 'Irrigate before 8 AM',
    body: 'Soil moisture is dropping in block B. A 25-minute drip cycle will protect fruit set without waterlogging.',
    tag: 'Irrigation',
  },
  {
    id: 'r2',
    title: 'Watch for early blight',
    body: 'Humidity is elevated. Inspect lower tomato leaves and keep the canopy dry after irrigation.',
    tag: 'Crop health',
  },
  {
    id: 'r3',
    title: 'Sell a portion at Mettupalayam',
    body: 'Tomato modal price is up 8.2% this week. Moving 12 quintals today captures the premium.',
    tag: 'Market',
  },
]

export const recentActivity = [
  { id: 'a1', title: 'Kisan Mitra answered a fertilizer query', time: '12 min ago' },
  { id: 'a2', title: 'Crop scan completed — no critical pests', time: '1 hr ago' },
  { id: 'a3', title: 'Price alert set for Tomato ≥ ₹3,000', time: 'Yesterday' },
  { id: 'a4', title: 'PM-KISAN installment reminder saved', time: '2 days ago' },
]

export const agriculturalAlerts = [
  { id: 'al1', level: 'warning' as const, title: 'Evening rain likely', body: 'Hold foliar sprays after 4 PM today.' },
  { id: 'al2', level: 'info' as const, title: 'Market window', body: 'Tomato demand is firm at Mettupalayam mandi.' },
  { id: 'al3', level: 'success' as const, title: 'Crop stage on track', body: 'Day 42 of 90 — fruiting phase is healthy.' },
]

export const defaultNotifications: NotificationItem[] = [
  { id: 'n1', title: 'Rain probability 35%', body: 'Light showers expected tomorrow evening in Coimbatore.', time: '8 min ago', type: 'weather', unread: true },
  { id: 'n2', title: 'Tomato +8.2%', body: 'Modal price at Mettupalayam is ₹2,850 / quintal.', time: '22 min ago', type: 'market', unread: true },
  { id: 'n3', title: 'Irrigation reminder', body: 'Tomato block A is due for a drip cycle.', time: '2 hr ago', type: 'crop', unread: false },
  { id: 'n4', title: 'Kisan Mitra insight', body: 'Yellowing leaves often start from nitrogen or drainage issues.', time: 'Yesterday', type: 'ai', unread: false },
]
