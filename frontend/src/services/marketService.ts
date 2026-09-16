import { api } from '../lib/api'
import { sampleMarkets } from '../data/markets'
import type { CommodityPrice, FavoriteItem } from '../types'

function withChange(items: CommodityPrice[]): CommodityPrice[] {
  return items.map((item) => ({
    ...item,
    change: item.change ?? Number((((item.modal_price - item.min_price) / item.min_price) * 100 - 4).toFixed(1)),
  }))
}

export async function fetchPrices(query?: string, state?: string): Promise<{ data: CommodityPrice[]; fallback: boolean }> {
  try {
    const { data } = await api.get('/market/prices', {
      params: { query: query || undefined, state: state || undefined },
    })
    const live = withChange(data as CommodityPrice[])
    if (!live.length) {
      return { data: filterSample(query, state), fallback: true }
    }
    const extras = filterSample(query, state).filter(
      (s) => !live.some((l) => l.commodity === s.commodity && l.market === s.market),
    )
    return { data: [...live, ...extras], fallback: false }
  } catch {
    return { data: filterSample(query, state), fallback: true }
  }
}

function filterSample(query?: string, state?: string) {
  return sampleMarkets.filter((p) => {
    const q = query?.toLowerCase() || ''
    const okQ = !q || p.commodity.toLowerCase().includes(q) || p.market.toLowerCase().includes(q)
    const okS = !state || p.state.toLowerCase() === state.toLowerCase()
    return okQ && okS
  })
}

export async function fetchFavorites(): Promise<FavoriteItem[]> {
  try {
    const { data } = await api.get('/market/favorites')
    return data
  } catch {
    return JSON.parse(localStorage.getItem('agrova.favorites') || '[]')
  }
}

export async function toggleFavorite(item: CommodityPrice, existing?: FavoriteItem) {
  try {
    if (existing) {
      await api.delete(`/market/favorites/${existing.id}`)
      return
    }
    await api.post('/market/favorites', { commodity: item.commodity, market_name: item.market })
  } catch {
    const list: FavoriteItem[] = JSON.parse(localStorage.getItem('agrova.favorites') || '[]')
    if (existing) {
      localStorage.setItem('agrova.favorites', JSON.stringify(list.filter((f) => f.id !== existing.id)))
    } else {
      list.push({
        id: `local-${item.id}`,
        user_id: 'local',
        commodity: item.commodity,
        market_name: item.market,
        created_at: new Date().toISOString(),
      })
      localStorage.setItem('agrova.favorites', JSON.stringify(list))
    }
  }
}
