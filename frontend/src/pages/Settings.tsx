import { PageContainer } from '../components/layout/PageContainer'
import { Card } from '../components/ui/Card'
import { Input } from '../components/ui/Input'
import { Switch } from '../components/ui/Switch'
import { Button } from '../components/ui/Button'
import { loadExtraSettings, saveExtraSettings } from '../lib/profile'
import { useToast } from '../components/ui/Toast'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAppDispatch, useAppSelector } from '../store'
import { setLanguage } from '../store/slices/settingsSlice'
import { loadProfile } from '../lib/profile'

export default function SettingsPage() {
  const { toast } = useToast()
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const language = useAppSelector((state) => state.settings.language)
  const profile = loadProfile()
  const [extra, setExtra] = useState(loadExtraSettings())

  const persist = (next = extra) => {
    saveExtraSettings(next)
    toast(t('settings.saved', 'Settings saved'))
  }

  return (
    <PageContainer title={t('settings.title', 'Settings')} subtitle={t('settings.subtitle', 'Keep your farm preferences on this device.')}>
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <h3 className="mb-3 font-display font-bold">{t('settings.account', 'Your profile')}</h3>
          <p className="text-sm text-[#53665a]">{profile.name}</p>
          <p className="mt-1 text-sm text-[#53665a]">{profile.location}</p>
        </Card>

        <Card className="flex items-center justify-between">
          <div>
            <h3 className="font-display font-bold">{t('settings.notifications', 'Notifications')}</h3>
            <p className="text-sm text-[#53665a]">{t('settings.notificationsDetail', 'Weather and crop reminders')}</p>
          </div>
          <Switch
            checked={extra.notifications}
            label={t('settings.notifications', 'Notifications')}
            onChange={(notifications) => {
              const n = { ...extra, notifications }
              setExtra(n)
              persist(n)
            }}
          />
        </Card>

        <Card>
          <h3 className="mb-3 font-display font-bold">{t('settings.weatherLocation', 'Weather location')}</h3>
          <Input value={extra.weatherLocation} onChange={(e) => setExtra({ ...extra, weatherLocation: e.target.value })} />
          <Button className="mt-3" size="sm" onClick={() => persist()}>
            {t('settings.saveLocation', 'Save location')}
          </Button>
        </Card>

        <Card className="flex items-center justify-between">
          <div>
            <h3 className="font-display font-bold">{t('settings.marketAlerts', 'Market alerts')}</h3>
            <p className="text-sm text-[#53665a]">{t('settings.marketAlertsDetail', 'Tomato mandi movements')}</p>
          </div>
          <Switch
            checked={extra.marketAlerts}
            label={t('settings.marketAlerts', 'Market alerts')}
            onChange={(marketAlerts) => {
              const n = { ...extra, marketAlerts }
              setExtra(n)
              persist(n)
            }}
          />
        </Card>

        <Card className="flex items-center justify-between lg:col-span-2">
          <div>
            <h3 className="font-display font-bold">{t('settings.aiVoice', 'Voice replies')}</h3>
            <p className="text-sm text-[#53665a]">{t('settings.aiVoiceDetail', 'Read Kisan Mitra replies aloud when available')}</p>
          </div>
          <Switch
            checked={extra.aiVoice}
            label={t('settings.aiVoice', 'Voice replies')}
            onChange={(aiVoice) => {
              const n = { ...extra, aiVoice }
              setExtra(n)
              persist(n)
            }}
          />
        </Card>

        <Card className="lg:col-span-2">
          <h3 className="mb-1 font-display font-bold">{t('settings.language', 'App language')}</h3>
          <p className="mb-3 text-sm text-[#53665a]">{t('settings.languageDetail', 'All labels and advice will use this language.')}</p>
          <select
            value={language}
            onChange={(event) => {
              dispatch(setLanguage(event.target.value))
              toast(t('settings.languageSaved', 'Language updated'))
            }}
            className="w-full max-w-sm rounded-lg border border-[#cbdcca] bg-white px-3.5 py-2.5 text-sm text-[#183122]"
          >
            <option value="en">English</option>
            <option value="hi">हिन्दी</option>
            <option value="ta">தமிழ்</option>
            <option value="ml">മലയാളം</option>
            <option value="te">తెలుగు</option>
            <option value="fr">Français</option>
          </select>
        </Card>
      </div>
    </PageContainer>
  )
}
