import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { PageContainer } from '../components/layout/PageContainer'
import { Card } from '../components/ui/Card'
import { Input } from '../components/ui/Input'
import { Button } from '../components/ui/Button'
import { Tabs } from '../components/ui/Tabs'
import { loadProfile, saveProfile } from '../lib/profile'
import { useToast } from '../components/ui/Toast'
import { cropGuides } from '../data/crops'
import { sampleSchemes } from '../data/schemes'
import type { FarmerProfile } from '../types'

const tabs = ['Farm Overview', 'Active Crops', 'Saved Schemes', 'Price Alerts', 'AI History'] as const

export default function Profile() {
  const { t } = useTranslation()
  const { toast } = useToast()
  const [profile, setProfile] = useState<FarmerProfile>(loadProfile())
  const [tab, setTab] = useState<(typeof tabs)[number]>('Farm Overview')
  const [editing, setEditing] = useState(false)

  const save = () => {
    saveProfile(profile)
    setEditing(false)
    toast(t('profile.saved', 'Profile saved on this device'))
  }

  return (
    <PageContainer title={t('profile.title', 'My Farm')} subtitle={t('profile.subtitle', 'Your farm details, saved on this device.')} actions={<Button onClick={() => (editing ? save() : setEditing(true))}>{editing ? t('common.save', 'Save') : t('common.edit', 'Edit')}</Button>}>
      <Card className="grid gap-4 md:grid-cols-5">
        <Field label={t('profile.name', 'Name')} value={profile.name} editing={editing} onChange={(name) => setProfile({ ...profile, name })} />
        <Field label={t('profile.location', 'Location')} value={profile.location} editing={editing} onChange={(location) => setProfile({ ...profile, location })} />
        <Field label={t('profile.crop', 'Main crop')} value={profile.primaryCrop} editing={editing} onChange={(primaryCrop) => setProfile({ ...profile, primaryCrop })} />
        <Field label={t('profile.farmSize', 'Farm size')} value={profile.farmSize} editing={editing} onChange={(farmSize) => setProfile({ ...profile, farmSize })} />
        <Field label={t('profile.experience', 'Experience')} value={profile.experience} editing={editing} onChange={(experience) => setProfile({ ...profile, experience })} />
      </Card>
      <Tabs tabs={[...tabs]} value={tab} onChange={(t) => setTab(t as typeof tab)} />
      {tab === 'Farm Overview' && (
        <Card>
          <p className="text-sm leading-relaxed">
            {profile.name} manages {profile.farmSize} in {profile.location}, with {profile.experience} of experience. Primary crop is {profile.primaryCrop}, currently in fruiting on day 42 of 90.
          </p>
        </Card>
      )}
      {tab === 'Active Crops' && (
        <div className="grid gap-3 md:grid-cols-2">
          {cropGuides.slice(0, 4).map((c) => (
            <Card key={c.id}>
              <p className="font-semibold">{c.name}</p>
              <p className="text-sm text-muted-foreground">{c.currentStage} · day {c.currentDay}/{c.durationDays}</p>
            </Card>
          ))}
        </div>
      )}
      {tab === 'Saved Schemes' && (
        <ul className="space-y-2">
          {sampleSchemes.slice(0, 3).map((s) => (
            <Card key={s.id}>{s.name}</Card>
          ))}
        </ul>
      )}
      {tab === 'Price Alerts' && (
        <Card>Tomato ≥ ₹{localStorage.getItem('agrova.priceAlert') || '3,000'} / quintal at Mettupalayam.</Card>
      )}
      {tab === 'AI History' && (
        <Card>
          <p className="text-sm">“Why are my tomato leaves yellow?” — Kisan Mitra advised checking moisture and early blight.</p>
        </Card>
      )}
    </PageContainer>
  )
}

function Field({ label, value, editing, onChange }: { label: string; value: string; editing: boolean; onChange: (v: string) => void }) {
  return (
    <label className="text-sm">
      <span className="text-xs uppercase text-muted-foreground">{label}</span>
      {editing ? <Input className="mt-1" value={value} onChange={(e) => onChange(e.target.value)} /> : <p className="mt-1 font-semibold">{value}</p>}
    </label>
  )
}
