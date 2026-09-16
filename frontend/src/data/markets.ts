import type { CommodityPrice } from '../types'

export const sampleMarkets: CommodityPrice[] = [
  { id: 'm1', commodity: 'Tomato', market: 'Mettupalayam', state: 'Tamil Nadu', district: 'Coimbatore', min_price: 2400, max_price: 3200, modal_price: 2850, unit: 'Quintal', change: 8.2 },
  { id: 'm2', commodity: 'Onion', market: 'Coimbatore', state: 'Tamil Nadu', district: 'Coimbatore', min_price: 1800, max_price: 2600, modal_price: 2200, unit: 'Quintal', change: 3.4 },
  { id: 'm3', commodity: 'Potato', market: 'Pollachi', state: 'Tamil Nadu', district: 'Coimbatore', min_price: 2000, max_price: 2800, modal_price: 2450, unit: 'Quintal', change: -1.8 },
  { id: 'm4', commodity: 'Rice', market: 'Erode', state: 'Tamil Nadu', district: 'Erode', min_price: 3100, max_price: 3600, modal_price: 3350, unit: 'Quintal', change: 2.1 },
  { id: 'm5', commodity: 'Chilli', market: 'Guntur', state: 'Andhra Pradesh', district: 'Guntur', min_price: 9800, max_price: 12400, modal_price: 11050, unit: 'Quintal', change: 4.6 },
  { id: 'm6', commodity: 'Cotton', market: 'Rajkot', state: 'Gujarat', district: 'Rajkot', min_price: 6800, max_price: 8200, modal_price: 7500, unit: 'Quintal', change: 1.2 },
  { id: 'm7', commodity: 'Wheat', market: 'Khanna', state: 'Punjab', district: 'Ludhiana', min_price: 2275, max_price: 2450, modal_price: 2350, unit: 'Quintal', change: 0.6 },
  { id: 'm8', commodity: 'Groundnut', market: 'Adoni', state: 'Andhra Pradesh', district: 'Kurnool', min_price: 5800, max_price: 6700, modal_price: 6300, unit: 'Quintal', change: -0.9 },
]

export const tomatoTrend = [
  { day: 'Week 1', Mettupalayam: 2420, Coimbatore: 2380, Pollachi: 2460 },
  { day: 'Week 2', Mettupalayam: 2510, Coimbatore: 2440, Pollachi: 2500 },
  { day: 'Week 3', Mettupalayam: 2680, Coimbatore: 2550, Pollachi: 2590 },
  { day: 'Week 4', Mettupalayam: 2850, Coimbatore: 2710, Pollachi: 2640 },
]
