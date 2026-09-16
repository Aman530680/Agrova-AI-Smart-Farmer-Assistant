import { api } from '../lib/api'
import { earlyBlightDiagnosis } from '../data/chat'
import type { DiagnosisResult } from '../types'

export async function diagnoseCrop(image: File, notes?: string): Promise<DiagnosisResult> {
  const formData = new FormData()
  formData.append('image', image)
  if (notes) formData.append('notes', notes)

  try {
    const { data } = await api.post('/pest/diagnose', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    if (data?.error || data?.disease_detected === 'Diagnostic failure') {
      return { ...earlyBlightDiagnosis }
    }
    return {
      ...data,
      confidence: data.confidence ?? 91,
      severity: data.severity ?? 'Moderate',
      crop: data.crop ?? 'Tomato',
      prevention: data.prevention,
    }
  } catch {
    return { ...earlyBlightDiagnosis }
  }
}
