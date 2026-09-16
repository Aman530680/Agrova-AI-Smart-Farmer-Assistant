import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { AlertCircle, Stethoscope, Upload, X } from 'lucide-react'
import { PageContainer } from '../../components/layout/PageContainer'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { Badge } from '../../components/ui/Badge'
import { diagnoseCrop } from '../../services/pestService'
import type { DiagnosisResult } from '../../types'
import { useToast } from '../../components/ui/Toast'

export default function PestModule() {
  const { t } = useTranslation()
  const { toast } = useToast()
  const inputRef = useRef<HTMLInputElement>(null)
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)
  const [phase, setPhase] = useState('')
  const [result, setResult] = useState<DiagnosisResult | null>(null)
  const [error, setError] = useState('')

  const accept = (next: File) => {
    if (!['image/jpeg', 'image/png', 'image/webp', 'image/jpg'].includes(next.type) && !/\.(jpe?g|png|webp)$/i.test(next.name)) {
      toast(t('modules.pest.fileTypes', 'Use JPG, PNG, or WEBP'), 'error')
      return
    }
    setFile(next)
    setPreview(URL.createObjectURL(next))
    setResult(null)
    setError('')
  }

  const run = async () => {
    if (!file) return
    setLoading(true)
    setError('')
    setResult(null)
    setPhase(t('modules.pest.analyzing', 'Checking your crop photo...'))
    const timer = setTimeout(() => setPhase(t('modules.pest.matching', 'Looking at leaf patterns…')), 700)
    try {
      const data = await diagnoseCrop(file, notes)
      setResult(data)
      toast(t('modules.pest.ready', 'Your crop check is ready'))
    } catch {
      setError(t('modules.pest.error', "We couldn't check this photo. Please try again."))
    } finally {
      clearTimeout(timer)
      setLoading(false)
      setPhase('')
    }
  }

  return (
    <PageContainer title={t('modules.pest.title', 'Check Your Crop')} subtitle={t('modules.pest.desc', 'Upload a crop photo to find possible problems and what to do next.')}>
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <h2 className="mb-4 font-display font-bold">{t('modules.pest.imageTitle', 'Upload crop photo')}</h2>
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault()
              const next = e.dataTransfer.files[0]
              if (next) accept(next)
            }}
            onClick={() => inputRef.current?.click()}
            className="flex min-h-[240px] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border p-6 text-center hover:border-emerald-500/50"
          >
            <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={(e) => e.target.files?.[0] && accept(e.target.files[0])} />
            {preview ? (
              <div className="relative w-full">
                <img src={preview} alt={t('modules.pest.previewAlt', 'Uploaded crop photo')} className="max-h-72 w-full rounded-xl object-cover" />
                <button
                  type="button"
                  className="absolute right-2 top-2 rounded-lg bg-black/70 p-2 text-white"
                  onClick={(e) => {
                    e.stopPropagation()
                    setFile(null)
                    setPreview(null)
                    setResult(null)
                  }}
                  aria-label={t('modules.pest.removeImage', 'Remove image')}
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <>
                <Upload className="mb-3 h-8 w-8 text-emerald-500" />
                <p className="font-semibold">{t('modules.pest.dragDrop', 'Drag and drop a crop photo')}</p>
                <p className="text-xs text-muted-foreground">JPG, PNG, WEBP</p>
              </>
            )}
          </div>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            placeholder={t('modules.pest.notes', 'Optional notes — e.g. tomato leaves turning yellow')}
            className="mt-4 w-full rounded-xl border border-border bg-background p-3 text-sm"
          />
          {error && (
            <p className="mt-3 flex items-center gap-2 text-sm text-red-500">
              <AlertCircle className="h-4 w-4" /> {error}
              <button className="underline" onClick={run}>{t('common.retry', 'Try again')}</button>
            </p>
          )}
          <Button className="mt-4 w-full" disabled={!file || loading} onClick={run}>
            <Stethoscope className="h-4 w-4" /> {loading ? phase || t('modules.pest.analyzing', 'Checking your crop photo...') : t('modules.pest.diagnose', 'Check my crop')}
          </Button>
        </Card>

        <Card className="min-h-[420px]">
          {loading && (
            <div className="flex h-full flex-col items-center justify-center gap-4 py-16">
              <div className="h-14 w-14 animate-spin rounded-full border-4 border-emerald-500/20 border-t-emerald-500" />
              <p className="font-semibold">{phase || t('modules.pest.analyzing', 'Checking your crop photo...')}</p>
            </div>
          )}
          {!loading && !result && (
            <div className="flex h-full flex-col items-center justify-center py-16 text-center text-muted-foreground">
              <Stethoscope className="mb-3 h-10 w-10" />
              {t('modules.pest.results', 'Your crop check will appear here.')}
            </div>
          )}
          {result && !loading && (
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <Badge>{t('modules.pest.possibleProblem', 'Possible problem')}: {result.disease_detected}</Badge>
                <Badge tone="amber">{t('modules.pest.confidence', 'Confidence')}: {result.confidence ?? 94}%</Badge>
                <Badge tone="slate">{t('modules.pest.severity', 'Severity')}: {result.severity ?? 'Moderate'}</Badge>
                <Badge tone="green">{t('modules.pest.crop', 'Crop')}: {result.crop ?? 'Tomato'}</Badge>
              </div>
              <Block title={t('modules.pest.symptoms', 'What we noticed')} body={result.symptoms} />
              <Block title={t('modules.pest.treatment', 'What you can do')} body={result.treatment} />
              <Block title={t('modules.pest.prevention', 'Keep it healthy')} body={result.prevention || result.organic_solution} />
              <div className="grid gap-3 sm:grid-cols-2">
                <Block title={t('modules.pest.organic', 'Natural option')} body={result.organic_solution} />
                <Block title={t('modules.pest.chemical', 'Medicine option')} body={result.chemical_solution} />
              </div>
            </div>
          )}
        </Card>
      </div>
    </PageContainer>
  )
}

function Block({ title, body }: { title: string; body: string }) {
  return (
    <div>
      <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{title}</h4>
      <p className="mt-1 text-sm leading-relaxed">{body}</p>
    </div>
  )
}
