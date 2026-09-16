import { api } from '../lib/api'
import { sampleSchemes } from '../data/schemes'
import type { BookmarkItem, Scheme } from '../types'

export async function fetchSchemes(category?: string): Promise<{ data: Scheme[]; fallback: boolean }> {
  try {
    const { data } = await api.get('/schemes', { params: { category: category || undefined } })
    const live = data as Scheme[]
    const extras = sampleSchemes.filter((s) => !live.some((l) => l.id === s.id || l.name === s.name))
    const merged = [...live, ...extras]
    return { data: category ? merged.filter((s) => s.category.toLowerCase().includes(category.toLowerCase())) : merged, fallback: false }
  } catch {
    const data = category
      ? sampleSchemes.filter((s) => s.category.toLowerCase().includes(category.toLowerCase()) || s.region?.toLowerCase() === category.toLowerCase())
      : sampleSchemes
    return { data, fallback: true }
  }
}

export async function fetchBookmarks(): Promise<BookmarkItem[]> {
  try {
    const { data } = await api.get('/schemes/bookmarks')
    return data
  } catch {
    return JSON.parse(localStorage.getItem('agrova.schemeBookmarks') || '[]')
  }
}

export async function toggleBookmark(schemeId: string, existing?: BookmarkItem) {
  try {
    if (existing) {
      await api.delete(`/schemes/bookmarks/${existing.id}`)
      return
    }
    await api.post('/schemes/bookmarks', { scheme_id: schemeId })
  } catch {
    const list: BookmarkItem[] = JSON.parse(localStorage.getItem('agrova.schemeBookmarks') || '[]')
    if (existing) {
      localStorage.setItem('agrova.schemeBookmarks', JSON.stringify(list.filter((b) => b.id !== existing.id)))
    } else {
      list.push({
        id: `local-${schemeId}`,
        user_id: 'local',
        scheme_id: schemeId,
        bookmarked_at: new Date().toISOString(),
      })
      localStorage.setItem('agrova.schemeBookmarks', JSON.stringify(list))
    }
  }
}
