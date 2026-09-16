import { DEFAULT_FARMER } from '../data/dashboard'
import type { FarmerProfile } from '../types'

const KEY = 'agrova.profile'
const SETTINGS_KEY = 'agrova.appSettings'

export function loadProfile(): FarmerProfile {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? { ...DEFAULT_FARMER, ...JSON.parse(raw) } : { ...DEFAULT_FARMER }
  } catch {
    return { ...DEFAULT_FARMER }
  }
}

export function saveProfile(profile: FarmerProfile) {
  localStorage.setItem(KEY, JSON.stringify(profile))
}

export interface ExtraSettings {
  notifications: boolean
  weatherLocation: string
  marketAlerts: boolean
  aiVoice: boolean
  compactMode: boolean
}

export const defaultExtraSettings: ExtraSettings = {
  notifications: true,
  weatherLocation: 'Coimbatore, Tamil Nadu',
  marketAlerts: true,
  aiVoice: false,
  compactMode: false,
}

export function loadExtraSettings(): ExtraSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY)
    return raw ? { ...defaultExtraSettings, ...JSON.parse(raw) } : { ...defaultExtraSettings }
  } catch {
    return { ...defaultExtraSettings }
  }
}

export function saveExtraSettings(settings: ExtraSettings) {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings))
}
