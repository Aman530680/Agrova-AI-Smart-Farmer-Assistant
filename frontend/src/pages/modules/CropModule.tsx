import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Droplets, Leaf, Shield, Tractor } from 'lucide-react'
import { PageContainer } from '../../components/layout/PageContainer'
import { Card } from '../../components/ui/Card'
import { Progress } from '../../components/ui/Progress'
import { Badge } from '../../components/ui/Badge'
import { cropGuides } from '../../data/crops'
import { cn } from '../../lib/utils'

export default function CropModule() {
  const { t } = useTranslation()
  const [id, setId] = useState('tomato')
  const crop = useMemo(() => cropGuides.find((c) => c.id === id) || cropGuides[0], [id])
  const progress = Math.round((crop.currentDay / crop.durationDays) * 100)

  return (
    <PageContainer title={t('modules.crop.title', 'My Crop')} subtitle={t('modules.crop.desc', 'See where your crop is today and what comes next.')}>
      <div className="flex gap-2 overflow-x-auto pb-2">
        {cropGuides.map((c) => (
          <button
            key={c.id}
            onClick={() => setId(c.id)}
            className={cn(
              'whitespace-nowrap rounded-full border px-4 py-2 text-sm',
              id === c.id ? 'border-emerald-500 bg-emerald-500/15 font-semibold' : 'border-border hover:border-emerald-500/40',
            )}
          >
            {c.name}
          </button>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card><Meta k={t('modules.crop.duration', 'Duration')} v={`${crop.durationDays} days`} /></Card>
        <Card><Meta k={t('modules.crop.currentStage', 'Current stage')} v={crop.currentStage} /></Card>
        <Card>
          <p className="text-xs uppercase text-muted-foreground">{t('modules.crop.progress', 'Progress')}</p>
          <p className="mb-2 font-display text-2xl font-extrabold">{progress}%</p>
          <Progress value={progress} />
        </Card>
        <Card><Meta k={t('modules.crop.expectedHarvest', 'Expected harvest')} v={crop.harvestWindow} /></Card>
      </div>

      <Card>
        <h3 className="mb-6 font-display font-bold">{t('modules.crop.timeline', 'Crop timeline')}</h3>
        <ol className="relative space-y-4 border-l border-border pl-6">
          {crop.stages.map((s) => {
            const active = s.name === crop.currentStage || (crop.currentStage === 'Fruiting' && s.name === 'Fruiting')
            return (
              <li key={s.name} className="relative">
                <span className={cn('absolute -left-[31px] h-3.5 w-3.5 rounded-full border-2', active ? 'border-emerald-500 bg-emerald-500' : 'border-border bg-card')} />
                <div className={cn('rounded-2xl border p-4', active && 'border-emerald-500/40 bg-emerald-500/10')}>
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-semibold">{s.name}</p>
                    <Badge tone={active ? 'green' : 'slate'}>Day {s.day}</Badge>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">{s.note}</p>
                </div>
              </li>
            )
          })}
        </ol>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Tip icon={Droplets} title={t('modules.crop.irrigation', 'Water')} body={crop.water} />
        <Tip icon={Leaf} title={t('modules.crop.fertilizer', 'Fertilizer')} body={crop.fertilizer} />
        <Tip icon={Shield} title={t('modules.crop.pestMonitoring', 'Check for pests')} body={crop.pest} />
        <Tip icon={Tractor} title={t('modules.crop.harvestPlanning', 'Harvest plan')} body={crop.harvest} />
      </div>
    </PageContainer>
  )
}

function Meta({ k, v }: { k: string; v: string }) {
  return (
    <>
      <p className="text-xs uppercase text-muted-foreground">{k}</p>
      <p className="font-display text-xl font-extrabold">{v}</p>
    </>
  )
}

function Tip({ icon: Icon, title, body }: { icon: typeof Leaf; title: string; body: string }) {
  return (
    <Card>
      <Icon className="mb-2 h-5 w-5 text-emerald-500" />
      <h4 className="font-semibold">{title}</h4>
      <p className="mt-1 text-sm text-muted-foreground">{body}</p>
    </Card>
  )
}
