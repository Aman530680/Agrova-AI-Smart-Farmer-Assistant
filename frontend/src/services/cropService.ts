import { api } from '../lib/api'
import type { ActiveCrop, CropScheduleResponse } from '../types'
import { cropGuides } from '../data/crops'

export async function fetchCalendars(): Promise<ActiveCrop[]> {
  try {
    const { data } = await api.get('/crop/calendars')
    return data
  } catch {
    return JSON.parse(localStorage.getItem('agrova.calendars') || '[]')
  }
}

export async function createCalendar(crop_name: string, sowing_date: string, current_stage = 'Sowing') {
  try {
    const { data } = await api.post('/crop/calendars', { crop_name, sowing_date, current_stage })
    return data as ActiveCrop
  } catch {
    const item: ActiveCrop = {
      id: `local-${Date.now()}`,
      crop_name,
      sowing_date,
      current_stage,
      created_at: new Date().toISOString(),
    }
    const list = JSON.parse(localStorage.getItem('agrova.calendars') || '[]')
    list.push(item)
    localStorage.setItem('agrova.calendars', JSON.stringify(list))
    return item
  }
}

export async function deleteCalendar(id: string) {
  try {
    await api.delete(`/crop/calendars/${id}`)
  } catch {
    const list: ActiveCrop[] = JSON.parse(localStorage.getItem('agrova.calendars') || '[]')
    localStorage.setItem('agrova.calendars', JSON.stringify(list.filter((c) => c.id !== id)))
  }
}

export async function updateStage(id: string, current_stage: string) {
  try {
    const { data } = await api.patch(`/crop/calendars/${id}`, { current_stage })
    return data as ActiveCrop
  } catch {
    const list: ActiveCrop[] = JSON.parse(localStorage.getItem('agrova.calendars') || '[]')
    const next = list.map((c) => (c.id === id ? { ...c, current_stage } : c))
    localStorage.setItem('agrova.calendars', JSON.stringify(next))
    return next.find((c) => c.id === id)!
  }
}

export async function fetchSchedule(id: string, cropName?: string, sowingDate?: string): Promise<CropScheduleResponse | null> {
  try {
    const { data } = await api.get(`/crop/calendars/${id}/schedule`)
    return data
  } catch {
    const guide = cropGuides.find((g) => g.id === cropName || g.name.toLowerCase() === cropName?.toLowerCase())
    if (!guide) return null
    const sow = sowingDate ? new Date(sowingDate) : new Date()
    return {
      crop_name: guide.name,
      sowing_date: sowingDate || sow.toISOString().slice(0, 10),
      current_stage: guide.currentStage,
      schedule: guide.stages.map((s) => {
        const start = new Date(sow)
        start.setDate(start.getDate() + s.day)
        const end = new Date(start)
        end.setDate(end.getDate() + 10)
        return {
          stage: s.name,
          start_date: start.toISOString().slice(0, 10),
          end_date: end.toISOString().slice(0, 10),
          task: s.note,
          water_requirement: guide.water,
          fertilizer_recommendation: guide.fertilizer,
        }
      }),
    }
  }
}
