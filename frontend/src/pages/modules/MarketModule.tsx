import { useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Bell, RefreshCw, Star } from 'lucide-react'
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { PageContainer } from '../../components/layout/PageContainer'
import { Card } from '../../components/ui/Card'
import { Input } from '../../components/ui/Input'
import { Select } from '../../components/ui/Select'
import { Button } from '../../components/ui/Button'
import { Skeleton } from '../../components/ui/Skeleton'
import { Modal } from '../../components/ui/Modal'
import { fetchFavorites, fetchPrices, toggleFavorite } from '../../services/marketService'
import { tomatoTrend } from '../../data/markets'
import { formatCurrency } from '../../lib/utils'
import { useToast } from '../../components/ui/Toast'
import type { CommodityPrice, FavoriteItem } from '../../types'

export default function MarketModule() {
  const { t } = useTranslation()
  const { toast } = useToast()
  const [prices, setPrices] = useState<CommodityPrice[]>([])
  const [favorites, setFavorites] = useState<FavoriteItem[]>([])
  const [search, setSearch] = useState('')
  const [state, setState] = useState('Tamil Nadu')
  const [district, setDistrict] = useState('')
  const [market, setMarket] = useState('')
  const [commodity, setCommodity] = useState('')
  const [sort, setSort] = useState<'modal' | 'change'>('modal')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [alertOpen, setAlertOpen] = useState(false)
  const [alertPrice, setAlertPrice] = useState('3000')

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const res = await fetchPrices(search || commodity || undefined, state || undefined)
      setPrices(res.data)
      setFavorites(await fetchFavorites())
    } catch {
      setError(t('modules.market.error', "We couldn't load today's prices. Please try again."))
    } finally {
      setLoading(false)
    }
  }, [search, state, commodity, t])

  useEffect(() => {
    const t = setTimeout(load, 200)
    return () => clearTimeout(t)
  }, [load])

  const rows = useMemo(() => {
    return prices
      .filter((p) => !district || (p.district || '').toLowerCase().includes(district.toLowerCase()))
      .filter((p) => !market || p.market.toLowerCase().includes(market.toLowerCase()))
      .sort((a, b) => (sort === 'change' ? (b.change || 0) - (a.change || 0) : b.modal_price - a.modal_price))
  }, [prices, district, market, sort])

  const states = ['', 'Tamil Nadu', 'Karnataka', 'Maharashtra', 'Punjab', 'Gujarat', 'Andhra Pradesh']

  return (
    <PageContainer
      title={t('modules.market.title', "Today's Prices")}
      subtitle={t('modules.market.desc', 'See today’s prices and choose where to sell.')}
      actions={
        <div className="flex gap-2">
          <Button variant="secondary" onClick={() => setAlertOpen(true)}>
            <Bell className="h-4 w-4" /> {t('modules.market.priceAlert', 'Price alert')}
          </Button>
          <Button variant="ghost" onClick={load} aria-label="Refresh">
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      }
    >
      <div className="grid gap-3 md:grid-cols-5">
        <Select value={state} onChange={(e) => setState(e.target.value)} aria-label={t('modules.market.state', 'State')}>
          {states.map((s) => (
            <option key={s} value={s}>{s || t('modules.market.allStates', 'All states')}</option>
          ))}
        </Select>
        <Input placeholder={t('modules.market.district', 'District')} value={district} onChange={(e) => setDistrict(e.target.value)} aria-label={t('modules.market.district', 'District')} />
        <Input placeholder={t('modules.market.market', 'Market')} value={market} onChange={(e) => setMarket(e.target.value)} aria-label={t('modules.market.market', 'Market')} />
        <Input placeholder={t('modules.market.commodity', 'Commodity')} value={commodity} onChange={(e) => setCommodity(e.target.value)} aria-label={t('modules.market.commodity', 'Commodity')} />
        <Input placeholder={t('modules.market.search', 'Search crop')} value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      {error && (
        <Card className="text-center text-sm">
          {error} <Button size="sm" className="ml-2" onClick={load}>{t('common.retry', 'Try again')}</Button>
        </Card>
      )}
      {loading && <Skeleton className="h-64 w-full" />}

      {!loading && (
        <div className="grid gap-4 lg:grid-cols-3">
          <Card className="overflow-x-auto lg:col-span-2">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="font-display font-bold">{t('modules.market.liveTable', "Today's prices")}</h3>
              <Select value={sort} onChange={(e) => setSort(e.target.value as 'modal' | 'change')} className="w-40">
                <option value="modal">{t('modules.market.sortModal', 'Sort: Price')}</option>
                <option value="change">{t('modules.market.sortChange', 'Sort: Change')}</option>
              </Select>
            </div>
            <table className="min-w-full text-left text-sm">
              <thead className="text-xs uppercase text-muted-foreground">
                <tr>
                  {[t('modules.market.commodity', 'Crop'), t('modules.market.market', 'Market'), t('modules.market.state', 'State'), t('modules.market.min', 'Min'), t('modules.market.max', 'Max'), t('modules.market.modal', 'Today'), t('modules.market.change', 'Change'), ''].map((h) => (
                    <th key={h} className="px-2 py-2">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => {
                  const fav = favorites.find((f) => f.commodity === row.commodity && f.market_name === row.market)
                  const up = (row.change || 0) >= 0
                  return (
                    <tr key={row.id} className="border-t border-border">
                      <td className="px-2 py-3 font-semibold">{row.commodity}</td>
                      <td className="px-2 py-3">{row.market}</td>
                      <td className="px-2 py-3">{row.state}</td>
                      <td className="px-2 py-3">{formatCurrency(row.min_price)}</td>
                      <td className="px-2 py-3">{formatCurrency(row.max_price)}</td>
                      <td className="px-2 py-3 font-bold text-emerald-600">{formatCurrency(row.modal_price)}</td>
                      <td className={`px-2 py-3 ${up ? 'text-emerald-600' : 'text-red-500'}`}>
                        {up ? '+' : ''}{row.change}%
                      </td>
                      <td>
                        <button
                          aria-label="Toggle favorite"
                          onClick={async () => {
                            await toggleFavorite(row, fav)
                            setFavorites(await fetchFavorites())
                            toast(fav ? t('modules.market.removeWatchlist', 'Removed from watchlist') : t('modules.market.watchlist', 'Watching this market'))
                          }}
                        >
                          <Star className={`h-4 w-4 ${fav ? 'fill-amber-400 text-amber-400' : 'text-muted-foreground'}`} />
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
            {rows.length === 0 && <p className="py-10 text-center text-sm text-muted-foreground">{t('modules.market.noResults', 'No prices match these filters.')}</p>}
          </Card>
          <div className="space-y-4">
            <Card>
              <h3 className="mb-3 font-display font-bold">{t('modules.market.tomatoTrend', 'Tomato price this week')}</h3>
              <div className="h-48">
                <ResponsiveContainer>
                  <LineChart data={tomatoTrend}>
                    <XAxis dataKey="day" fontSize={11} />
                    <YAxis fontSize={11} />
                    <Tooltip />
                    <Line dataKey="Mettupalayam" stroke="#10b981" />
                    <Line dataKey="Coimbatore" stroke="#84cc16" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Card>
            <Card>
              <h3 className="font-display font-bold">{t('modules.market.marketComparison', 'Where is the price better?')}</h3>
              <p className="mt-2 text-sm text-muted-foreground">Mettupalayam currently leads Coimbatore on tomato modal price — useful if fruit is graded and firm.</p>
            </Card>
          </div>
        </div>
      )}

      <Modal open={alertOpen} onClose={() => setAlertOpen(false)} title={t('modules.market.alertTitle', 'Tomato price alert')}>
        <p className="mb-3 text-sm text-muted-foreground">{t('modules.market.alertText', 'Notify when the tomato price crosses this value.')}</p>
        <Input value={alertPrice} onChange={(e) => setAlertPrice(e.target.value)} />
        <Button
          className="mt-4"
          onClick={() => {
            localStorage.setItem('agrova.priceAlert', alertPrice)
            setAlertOpen(false)
            toast(t('modules.market.alertSaved', `Alert set at ₹${alertPrice}`))
          }}
        >
          {t('modules.market.saveAlert', 'Save alert')}
        </Button>
      </Modal>
    </PageContainer>
  )
}
