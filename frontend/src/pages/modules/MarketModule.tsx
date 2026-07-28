import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { useAppSelector } from '../../store'
import { 
  Coins, 
  Search, 
  MapPin, 
  Star, 
  TrendingUp, 
  Scale,
  RefreshCw
} from 'lucide-react'
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts'
import axios from 'axios'

interface CommodityPrice {
  id: string
  commodity: string
  market: string
  state: string
  min_price: number
  max_price: number
  modal_price: number
  unit: string
}

interface FavoriteItem {
  id: string
  user_id: string
  commodity: string
  market_name: string
  created_at: string
}

export default function MarketModule() {
  const { t } = useTranslation()
  const token = useAppSelector((state) => state.auth.token)

  const [prices, setPrices] = useState<CommodityPrice[]>([])
  const [favorites, setFavorites] = useState<FavoriteItem[]>([])
  const [selectedCommodity, setSelectedCommodity] = useState<CommodityPrice | null>(null)
  
  const [search, setSearch] = useState('')
  const [stateFilter, setStateFilter] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchPrices()
    fetchFavorites()
  }, [search, stateFilter])

  const fetchPrices = async () => {
    setIsLoading(true)
    setError('')
    try {
      const response = await axios.get('/api/market/prices', {
        params: { query: search || undefined, state: stateFilter || undefined },
        headers: { Authorization: `Bearer ${token}` }
      })
      setPrices(response.data)
      // Default select first item for chart
      if (response.data.length > 0 && !selectedCommodity) {
        setSelectedCommodity(response.data[0])
      }
    } catch (err) {
      console.error(err)
      setError('Failed to fetch commodity prices.')
    } finally {
      setIsLoading(false)
    }
  }

  const fetchFavorites = async () => {
    try {
      const response = await axios.get('/api/market/favorites', {
        headers: { Authorization: `Bearer ${token}` }
      })
      setFavorites(response.data)
    } catch (err) {
      console.error('Failed to load favorites list', err)
    }
  }

  const isFavorite = (commodity: string, market: string) => {
    return favorites.some(
      f => f.commodity.toLowerCase() === commodity.toLowerCase() && 
           f.market_name.toLowerCase() === market.toLowerCase()
    )
  }

  const getFavoriteId = (commodity: string, market: string) => {
    return favorites.find(
      f => f.commodity.toLowerCase() === commodity.toLowerCase() && 
           f.market_name.toLowerCase() === market.toLowerCase()
    )?.id
  }

  const handleToggleFavorite = async (item: CommodityPrice) => {
    const isFav = isFavorite(item.commodity, item.market)
    const favId = getFavoriteId(item.commodity, item.market)

    try {
      if (isFav && favId) {
        await axios.delete(`/api/market/favorites/${favId}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      } else {
        await axios.post('/api/market/favorites', {
          commodity: item.commodity,
          market_name: item.market
        }, {
          headers: { Authorization: `Bearer ${token}` }
        })
      }
      fetchFavorites()
    } catch (err) {
      console.error('Failed to update favorite', err)
    }
  }

  // Prepares data structure for the chart
  const getChartData = () => {
    if (!selectedCommodity) return []
    return [
      {
        name: 'Min Price',
        price: selectedCommodity.min_price,
        color: '#3b82f6'
      },
      {
        name: 'Modal Price',
        price: selectedCommodity.modal_price,
        color: '#10b981'
      },
      {
        name: 'Max Price',
        price: selectedCommodity.max_price,
        color: '#ef4444'
      }
    ]
  }

  const statesList = [
    { code: '', label: 'All States' },
    { code: 'Punjab', label: 'Punjab' },
    { code: 'Haryana', label: 'Haryana' },
    { code: 'Gujarat', label: 'Gujarat' },
    { code: 'Maharashtra', label: 'Maharashtra' },
    { code: 'Karnataka', label: 'Karnataka' },
    { code: 'Andhra Pradesh', label: 'Andhra Pradesh' },
    { code: 'Uttar Pradesh', label: 'Uttar Pradesh' },
    { code: 'Bihar', label: 'Bihar' }
  ]

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      
      {/* Module Title */}
      <div className="glass glow-green p-8 rounded-3xl space-y-3 relative overflow-hidden border border-white/5">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Coins className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">{t('modules.market.title', 'Market Prices')}</h1>
              <p className="text-xs text-neutral-400">Real-time commodity prices from the Agmarknet agricultural wholesale network.</p>
            </div>
          </div>
          <button 
            onClick={fetchPrices}
            className="p-2 rounded-xl bg-neutral-900 border border-white/5 text-neutral-400 hover:text-white"
          >
            <RefreshCw className="w-4.5 h-4.5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Prices Lists Column */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Filters Area */}
          <div className="flex flex-col sm:flex-row gap-4">
            
            {/* Search Input */}
            <div className="relative flex-1">
              <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-neutral-500">
                <Search className="w-4 h-4" />
              </span>
              <input
                type="text"
                placeholder={t('modules.market.placeholder', 'Search commodity...')}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-neutral-900/60 border border-white/5 focus:border-emerald-500/40 rounded-2xl py-3 pl-11 pr-4 text-xs text-white placeholder-neutral-600 focus:outline-none transition-all duration-300"
              />
            </div>

            {/* State filter selector */}
            <select
              value={stateFilter}
              onChange={(e) => setStateFilter(e.target.value)}
              className="bg-neutral-900/60 border border-white/5 focus:border-emerald-500/40 rounded-2xl px-4 py-3 text-xs text-white focus:outline-none transition-all duration-300"
            >
              {statesList.map(st => (
                <option key={st.code} value={st.code}>{st.label}</option>
              ))}
            </select>
          </div>

          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-2xl text-center">
              {error}
            </div>
          )}

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 space-y-4">
              <div className="w-12 h-12 border-4 border-emerald-500/20 border-t-emerald-400 rounded-full animate-spin" />
              <p className="text-xs text-neutral-400">Loading market prices...</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-white/5">
              {prices.map((item) => {
                const isSelected = selectedCommodity?.id === item.id
                const isFav = isFavorite(item.commodity, item.market)
                return (
                  <motion.div
                    key={item.id}
                    whileHover={{ scale: 1.01 }}
                    onClick={() => setSelectedCommodity(item)}
                    className={`p-4 border rounded-2xl flex items-center justify-between cursor-pointer transition-all duration-300 ${
                      isSelected
                        ? 'bg-gradient-to-br from-emerald-500/10 to-neutral-900 border-emerald-500'
                        : 'bg-neutral-900/30 border-white/5 hover:border-white/10'
                    }`}
                  >
                    <div className="space-y-1.5 min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-white truncate">{item.commodity}</h4>
                        <span className="text-[9px] px-2 py-0.5 rounded-full bg-neutral-950 border border-white/5 text-neutral-400">
                          Per {item.unit}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-neutral-500">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-emerald-500" /> {item.market}, {item.state}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      {/* Price rate display */}
                      <div className="text-right">
                        <span className="text-[10px] text-neutral-500 block uppercase font-bold">Modal Rate</span>
                        <span className="text-base font-extrabold text-emerald-400">₹{item.modal_price}</span>
                      </div>

                      {/* Favorite star */}
                      <button
                        onClick={(e) => { e.stopPropagation(); handleToggleFavorite(item); }}
                        className={`p-2.5 rounded-xl border transition-all ${
                          isFav
                            ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                            : 'bg-neutral-800/40 border-transparent text-neutral-500 hover:text-white'
                        }`}
                      >
                        <Star className={`w-4 h-4 ${isFav ? 'fill-amber-400' : ''}`} />
                      </button>
                    </div>
                  </motion.div>
                )
              })}

              {prices.length === 0 && (
                <div className="text-center py-16 text-neutral-500 text-sm">
                  No commodities found matching current query/filters.
                </div>
              )}
            </div>
          )}

        </div>

        {/* Charts & Analytics Column */}
        <div className="glass p-6 rounded-3xl border border-white/5 flex flex-col justify-between min-h-[400px]">
          
          {selectedCommodity ? (
            <div className="flex-grow flex flex-col justify-between h-full space-y-6">
              
              {/* Selected Commodity Header */}
              <div className="space-y-1 border-b border-white/5 pb-4">
                <span className="flex items-center gap-1.5 text-xs text-emerald-400 font-bold uppercase tracking-widest">
                  <TrendingUp className="w-4 h-4" /> Market Analytics
                </span>
                <h3 className="text-lg font-black text-white">{selectedCommodity.commodity}</h3>
                <p className="text-xs text-neutral-500">{selectedCommodity.market} Mandi, {selectedCommodity.state}</p>
              </div>

              {/* Chart Visualizer */}
              <div className="h-56 w-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={getChartData()} margin={{ top: 20, right: 10, left: -20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#222" />
                    <XAxis dataKey="name" stroke="#666" fontSize={10} />
                    <YAxis stroke="#666" fontSize={10} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#171717', border: '1px solid rgba(255,255,255,0.08)' }} 
                      labelStyle={{ color: '#fff', fontWeight: 'bold' }}
                    />
                    <Bar dataKey="price" radius={[8, 8, 0, 0]}>
                      {getChartData().map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Analytics Range details */}
              <div className="bg-neutral-950/60 border border-white/5 p-4 rounded-2xl grid grid-cols-2 gap-4">
                <div>
                  <span className="text-[10px] text-neutral-500 uppercase font-bold block">Min to Max range</span>
                  <span className="text-sm font-bold text-white">₹{selectedCommodity.min_price} - ₹{selectedCommodity.max_price}</span>
                </div>
                <div>
                  <span className="text-[10px] text-neutral-500 uppercase font-bold block flex items-center gap-1">
                    <Scale className="w-3.5 h-3.5 text-emerald-500" /> Unit Metric
                  </span>
                  <span className="text-sm font-bold text-neutral-300">1 {selectedCommodity.unit}</span>
                </div>
              </div>

            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8 space-y-4">
              <div className="w-16 h-16 rounded-full bg-neutral-900 flex items-center justify-center text-neutral-600">
                <Coins className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-semibold text-neutral-400">Select a Commodity</p>
                <p className="text-xs text-neutral-600">Click a record on the left grid to view pricing charts</p>
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  )
}
