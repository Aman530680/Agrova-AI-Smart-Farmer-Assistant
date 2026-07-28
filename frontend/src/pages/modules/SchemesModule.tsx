import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { useAppSelector } from '../../store'
import { 
  HelpCircle, 
  Bookmark, 
  Share2, 
  ExternalLink,
  CheckCircle,
  FileCheck,
  Award,
  ChevronRight,
  X
} from 'lucide-react'
import axios from 'axios'

interface Scheme {
  id: string
  name: string
  authority: string
  category: string
  eligibility: string
  benefits: string
  documents: string
  official_link: string
}

interface BookmarkItem {
  id: string
  user_id: string
  scheme_id: string
  bookmarked_at: string
}

export default function SchemesModule() {
  const { t } = useTranslation()
  const token = useAppSelector((state) => state.auth.token)

  const [schemes, setSchemes] = useState<Scheme[]>([])
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([])
  const [selectedScheme, setSelectedScheme] = useState<Scheme | null>(null)
  
  const [categoryFilter, setCategoryFilter] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchSchemes()
    fetchBookmarks()
  }, [categoryFilter])

  const fetchSchemes = async () => {
    setIsLoading(true)
    setError('')
    try {
      const response = await axios.get('/api/schemes', {
        params: { category: categoryFilter || undefined },
        headers: { Authorization: `Bearer ${token}` }
      })
      setSchemes(response.data)
    } catch (err) {
      console.error(err)
      setError('Failed to fetch government schemes.')
    } finally {
      setIsLoading(false)
    }
  }

  const fetchBookmarks = async () => {
    try {
      const response = await axios.get('/api/schemes/bookmarks', {
        headers: { Authorization: `Bearer ${token}` }
      })
      setBookmarks(response.data)
    } catch (err) {
      console.error('Failed to load bookmarks', err)
    }
  }

  const isBookmarked = (schemeId: string) => {
    return bookmarks.some(b => b.scheme_id === schemeId)
  }

  const getBookmarkId = (schemeId: string) => {
    return bookmarks.find(b => b.scheme_id === schemeId)?.id
  }

  const handleToggleBookmark = async (schemeId: string) => {
    const isMarked = isBookmarked(schemeId)
    const bookmarkId = getBookmarkId(schemeId)

    try {
      if (isMarked && bookmarkId) {
        await axios.delete(`/api/schemes/bookmarks/${bookmarkId}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      } else {
        await axios.post('/api/schemes/bookmarks', {
          scheme_id: schemeId
        }, {
          headers: { Authorization: `Bearer ${token}` }
        })
      }
      fetchBookmarks()
    } catch (err) {
      console.error('Failed to update bookmark', err)
    }
  }

  const handleShare = async (scheme: Scheme) => {
    const text = `Check out this government scheme: ${scheme.name}. Benefits: ${scheme.benefits}. Apply here: ${scheme.official_link}`
    if (navigator.share) {
      try {
        await navigator.share({
          title: scheme.name,
          text: text,
          url: scheme.official_link
        })
      } catch (err) {
        console.log('Share canceled or failed', err)
      }
    } else {
      // Copy fallback
      navigator.clipboard.writeText(text)
      alert('Scheme details copied to clipboard!')
    }
  }

  const categories = [
    { code: '', label: 'All Categories' },
    { code: 'Financial Support', label: 'Financial Support' },
    { code: 'Crop Insurance', label: 'Crop Insurance' },
    { code: 'Soil Testing', label: 'Soil Testing' },
    { code: 'Irrigation', label: 'Irrigation' }
  ]

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      
      {/* Title Header */}
      <div className="glass glow-green p-8 rounded-3xl relative overflow-hidden border border-white/5">
        <div className="flex items-center gap-3 relative z-10">
          <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
            <HelpCircle className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">{t('modules.schemes.title', 'Government Schemes')}</h1>
            <p className="text-xs text-neutral-400">Identify eligibility, view benefits, bookmark, and apply for state and central subsidies.</p>
          </div>
        </div>
      </div>

      {/* Filter and layout */}
      <div className="space-y-6">
        
        {/* Category Filters */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map(cat => (
            <button
              key={cat.code}
              onClick={() => setCategoryFilter(cat.code)}
              className={`px-4 py-2 text-xs font-semibold rounded-xl border transition-all whitespace-nowrap ${
                categoryFilter === cat.code
                  ? 'bg-purple-500 text-black border-purple-500 shadow-lg shadow-purple-500/15'
                  : 'bg-neutral-900 border-white/5 hover:border-white/10 text-neutral-400'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-2xl text-center">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <div className="w-12 h-12 border-4 border-purple-500/20 border-t-purple-400 rounded-full animate-spin" />
            <p className="text-xs text-neutral-400">Loading government schemes...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {schemes.map((scheme) => {
              const isBooked = isBookmarked(scheme.id)
              return (
                <motion.div
                  key={scheme.id}
                  whileHover={{ y: -4 }}
                  className="glass p-6 rounded-2xl border border-white/5 flex flex-col justify-between h-72 hover:shadow-2xl transition-all duration-300"
                >
                  <div className="space-y-4">
                    <div className="flex justify-between items-start">
                      <span className="text-[9px] px-2 py-0.5 rounded-full bg-neutral-950 border border-white/5 text-purple-400 font-bold uppercase tracking-wider">
                        {scheme.category}
                      </span>
                      
                      <div className="flex gap-1.5">
                        <button
                          onClick={() => handleShare(scheme)}
                          className="p-1.5 rounded-lg bg-neutral-800/40 text-neutral-400 hover:text-white border border-transparent hover:border-white/5"
                        >
                          <Share2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleToggleBookmark(scheme.id)}
                          className={`p-1.5 rounded-lg border transition-all ${
                            isBooked
                              ? 'bg-purple-500/15 border-purple-500/20 text-purple-400'
                              : 'bg-neutral-800/40 border-transparent text-neutral-400 hover:text-white'
                          }`}
                        >
                          <Bookmark className={`w-3.5 h-3.5 ${isBooked ? 'fill-purple-400' : ''}`} />
                        </button>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <h3 className="text-sm font-bold text-white leading-snug line-clamp-2">{scheme.name}</h3>
                      <p className="text-[10px] text-neutral-500 font-semibold">{scheme.authority}</p>
                      <p className="text-xs text-neutral-400 line-clamp-3 leading-relaxed mt-2">{scheme.benefits}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedScheme(scheme)}
                    className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-white/5 bg-neutral-950 text-neutral-400 hover:text-white hover:border-purple-500/30 text-xs font-semibold transition-all pt-4"
                  >
                    <span>View Eligibility Details</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </motion.div>
              )
            })}
          </div>
        )}
      </div>

      {/* Details Dialog Modal */}
      {selectedScheme && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-xl glass border border-white/10 rounded-3xl p-6 md:p-8 space-y-6 relative overflow-hidden"
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedScheme(null)}
              className="absolute top-4 right-4 p-2 rounded-xl bg-neutral-900 border border-white/5 text-neutral-400 hover:text-white hover:scale-105 transition-all"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Scheme Title */}
            <div className="space-y-1 border-b border-white/5 pb-4">
              <span className="text-[9px] px-2 py-0.5 rounded-full bg-neutral-950 border border-white/5 text-purple-400 font-bold uppercase tracking-wider">
                {selectedScheme.category}
              </span>
              <h3 className="text-lg font-black text-white pr-8 leading-snug">{selectedScheme.name}</h3>
              <p className="text-[10px] text-neutral-500 font-bold">{selectedScheme.authority}</p>
            </div>

            {/* Eligibility, Benefits, Documents Details */}
            <div className="space-y-4 max-h-[350px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-white/5">
              
              {/* Eligibility */}
              <div className="space-y-1">
                <h4 className="text-[10px] font-bold uppercase text-purple-400 flex items-center gap-1.5">
                  <Award className="w-4 h-4" /> Eligibility Criteria
                </h4>
                <p className="text-xs text-neutral-300 leading-relaxed">{selectedScheme.eligibility}</p>
              </div>

              {/* Benefits */}
              <div className="space-y-1">
                <h4 className="text-[10px] font-bold uppercase text-purple-400 flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4" /> Scheme Benefits
                </h4>
                <p className="text-xs text-neutral-300 leading-relaxed">{selectedScheme.benefits}</p>
              </div>

              {/* Documents */}
              <div className="space-y-2">
                <h4 className="text-[10px] font-bold uppercase text-purple-400 flex items-center gap-1.5">
                  <FileCheck className="w-4 h-4" /> Required Papers / Documents
                </h4>
                <div className="p-3 bg-neutral-950/60 border border-white/5 rounded-xl">
                  <p className="text-xs text-neutral-300 leading-relaxed">{selectedScheme.documents}</p>
                </div>
              </div>

            </div>

            {/* Footer Apply Links */}
            <div className="flex gap-3 border-t border-white/5 pt-4">
              <button
                onClick={() => handleToggleBookmark(selectedScheme.id)}
                className={`px-4 py-3 rounded-xl border font-bold text-xs flex items-center justify-center gap-1.5 transition-all ${
                  isBookmarked(selectedScheme.id)
                    ? 'bg-purple-500/10 border-purple-500/30 text-purple-400'
                    : 'border-white/5 bg-neutral-900 text-neutral-400 hover:text-white'
                }`}
              >
                <Bookmark className="w-4 h-4" />
                <span>{isBookmarked(selectedScheme.id) ? 'Bookmarked' : 'Bookmark'}</span>
              </button>

              <a
                href={selectedScheme.official_link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-black font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 hover:shadow-lg hover:shadow-purple-500/10 transition-all duration-300"
              >
                <span>Visit Official Portal</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>

          </motion.div>
        </div>
      )}

    </div>
  )
}
