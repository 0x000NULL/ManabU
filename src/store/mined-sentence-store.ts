import { create } from 'zustand'
import type { MinedSentence } from '@/types/mined-sentence'

interface MinedSentenceState {
  sentences: MinedSentence[]
  total: number
  isLoading: boolean
  error: string | null
  search: string
  offset: number

  fetch: () => Promise<void>
  setSearch: (search: string) => void
  loadMore: () => Promise<void>
  deleteSentence: (id: string) => Promise<boolean>
  updateNotes: (id: string, notes: string) => Promise<boolean>
  updateEnglish: (id: string, english: string) => Promise<boolean>
}

const PAGE_SIZE = 20

export const useMinedSentenceStore = create<MinedSentenceState>()((set, get) => ({
  sentences: [],
  total: 0,
  isLoading: false,
  error: null,
  search: '',
  offset: 0,

  fetch: async () => {
    const { search } = get()
    set({ isLoading: true, error: null, offset: 0 })

    try {
      const params = new URLSearchParams({
        limit: String(PAGE_SIZE),
        offset: '0',
      })
      if (search) params.set('search', search)

      const res = await fetch(`/api/v1/sentences/mine?${params}`)
      if (!res.ok) {
        set({ isLoading: false, error: 'Failed to load sentences' })
        return
      }

      const json = await res.json()
      set({
        sentences: json.data as MinedSentence[],
        total: json.meta?.total ?? 0,
        isLoading: false,
        offset: PAGE_SIZE,
      })
    } catch {
      set({ isLoading: false, error: 'Network error' })
    }
  },

  setSearch: (search) => {
    set({ search })
    get().fetch()
  },

  loadMore: async () => {
    const { offset, total, isLoading, search, sentences } = get()
    if (isLoading || offset >= total) return

    set({ isLoading: true })

    try {
      const params = new URLSearchParams({
        limit: String(PAGE_SIZE),
        offset: String(offset),
      })
      if (search) params.set('search', search)

      const res = await fetch(`/api/v1/sentences/mine?${params}`)
      if (!res.ok) {
        set({ isLoading: false })
        return
      }

      const json = await res.json()
      set({
        sentences: [...sentences, ...(json.data as MinedSentence[])],
        total: json.meta?.total ?? total,
        isLoading: false,
        offset: offset + PAGE_SIZE,
      })
    } catch {
      set({ isLoading: false })
    }
  },

  deleteSentence: async (id) => {
    try {
      const res = await fetch(`/api/v1/sentences/mine/${id}`, { method: 'DELETE' })
      if (!res.ok) return false

      set((s) => ({
        sentences: s.sentences.filter((sent) => sent.id !== id),
        total: s.total - 1,
      }))
      return true
    } catch {
      return false
    }
  },

  updateNotes: async (id, notes) => {
    try {
      const res = await fetch(`/api/v1/sentences/mine/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notes }),
      })
      if (!res.ok) return false

      const json = await res.json()
      set((s) => ({
        sentences: s.sentences.map((sent) =>
          sent.id === id ? { ...sent, notes: json.data.notes } : sent,
        ),
      }))
      return true
    } catch {
      return false
    }
  },

  updateEnglish: async (id, english) => {
    try {
      const res = await fetch(`/api/v1/sentences/mine/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ english }),
      })
      if (!res.ok) return false

      const json = await res.json()
      set((s) => ({
        sentences: s.sentences.map((sent) =>
          sent.id === id ? { ...sent, english: json.data.english } : sent,
        ),
      }))
      return true
    } catch {
      return false
    }
  },
}))
