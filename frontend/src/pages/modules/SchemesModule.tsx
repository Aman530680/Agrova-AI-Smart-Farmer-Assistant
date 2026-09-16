import { useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Bookmark, Landmark, Search } from 'lucide-react'
import { PageContainer } from '../../components/layout/PageContainer'
import { Card } from '../../components/ui/Card'
import { Input } from '../../components/ui/Input'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { Modal } from '../../components/ui/Modal'
import { Skeleton } from '../../components/ui/Skeleton'
import { fetchBookmarks, fetchSchemes, toggleBookmark } from '../../services/schemeService'
import { useToast } from '../../components/ui/Toast'
import type { BookmarkItem, Scheme } from '../../types'

const filters = ['All', 'Central', 'Tamil Nadu', 'Financial Support', 'Insurance', 'Irrigation', 'Equipment']

export default function SchemesModule() {
  const { t } = useTranslation()
  const { toast } = useToast()
  const [schemes, setSchemes] = useState<Scheme[]>([])
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([])
  const [filter, setFilter] = useState('All')
  const [q, setQ] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selected, setSelected] = useState<Scheme | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const category = ['Financial Support', 'Insurance', 'Irrigation', 'Equipment'].includes(filter) ? filter : undefined
      const res = await fetchSchemes(category)
      setSchemes(res.data)
      setBookmarks(await fetchBookmarks())
    } catch {
      setError(t('modules.schemes.error', "We couldn't load schemes. Please try again."))
    } finally {
      setLoading(false)
    }
  }, [filter, t])

  useEffect(() => {
    load()
  }, [load])

  const visible = useMemo(() => {
    return schemes.filter((s) => {
      const hay = `${s.name} ${s.benefits} ${s.category} ${s.region || ''}`.toLowerCase()
      const okQ = !q || hay.includes(q.toLowerCase())
      const okF =
        filter === 'All' ||
        s.category.toLowerCase().includes(filter.toLowerCase()) ||
        (s.region || '').toLowerCase() === filter.toLowerCase() ||
        (filter === 'Central' && (s.region || s.authority).toLowerCase().includes('central'))
      return okQ && okF
    })
  }, [schemes, q, filter])

  return (
    <PageContainer title={t('modules.schemes.title', 'Government Schemes')} subtitle={t('modules.schemes.desc', 'Find support for crops, insurance, water, and farm equipment.') }>
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input className="pl-9" placeholder={t('modules.schemes.search', 'Search schemes')} value={q} onChange={(e) => setQ(e.target.value)} />
      </div>
      <div className="flex gap-2 overflow-x-auto">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`whitespace-nowrap rounded-full border px-3 py-1.5 text-xs ${filter === f ? 'border-emerald-500 bg-emerald-500/15' : 'border-border'}`}
          >
            {f}
          </button>
        ))}
      </div>
      {loading && <Skeleton className="h-48 w-full" />}
      {error && (
        <Card>
          {error} <Button size="sm" onClick={load}>Retry</Button>
        </Card>
      )}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {visible.map((scheme) => {
          const saved = bookmarks.find((b) => b.scheme_id === scheme.id)
          return (
            <Card key={scheme.id} className="flex flex-col">
              <div className="mb-3 flex items-start justify-between gap-2">
                <Badge>{scheme.category}</Badge>
                <button
                  aria-label={t('modules.schemes.bookmark', 'Save scheme')}
                  onClick={async () => {
                    await toggleBookmark(scheme.id, saved)
                    setBookmarks(await fetchBookmarks())
                    toast(saved ? t('modules.schemes.removed', 'Removed saved scheme') : t('modules.schemes.saved', 'Scheme saved'))
                  }}
                >
                  <Bookmark className={`h-4 w-4 ${saved ? 'fill-emerald-500 text-emerald-500' : ''}`} />
                </button>
              </div>
              <h3 className="font-display font-bold">{scheme.name}</h3>
              <p className="mt-1 text-xs text-muted-foreground">{scheme.authority}</p>
              <p className="mt-3 flex-1 text-sm text-muted-foreground line-clamp-3">{scheme.benefits}</p>
              <Button variant="secondary" className="mt-4" onClick={() => setSelected(scheme)}>
                {t('modules.schemes.viewDetails', 'View details')}
              </Button>
            </Card>
          )
        })}
      </div>
      {!loading && visible.length === 0 && <p className="text-center text-sm text-muted-foreground">{t('modules.schemes.noResults', 'No schemes match that search.')}</p>}

      <Modal open={!!selected} onClose={() => setSelected(null)} title={selected?.name || ''}>
        {selected && (
          <div className="space-y-3 text-sm">
            <p><strong>{t('modules.schemes.eligibility', 'Who can apply')}:</strong> {selected.eligibility}</p>
            <p><strong>{t('modules.schemes.benefits', 'What you can get')}:</strong> {selected.benefits}</p>
            <p><strong>{t('modules.schemes.documents', 'Documents')}:</strong> {selected.documents}</p>
            <a className="inline-flex items-center gap-2 text-emerald-600" href={selected.official_link} target="_blank" rel="noreferrer">
              <Landmark className="h-4 w-4" /> {t('modules.schemes.officialPortal', 'Official portal')}
            </a>
          </div>
        )}
      </Modal>
    </PageContainer>
  )
}
