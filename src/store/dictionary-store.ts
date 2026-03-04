import { create } from 'zustand'
import type { TokenizedWord, DictionaryEntry } from '@/types/subtitle'

interface DictionaryState {
  selectedWord: TokenizedWord | null
  anchorRect: DOMRect | null
  entry: DictionaryEntry | null
  isLoading: boolean
  isAddingToSrs: boolean

  openPopup: (token: TokenizedWord, rect: DOMRect) => Promise<void>
  closePopup: () => void
  addToSrs: () => Promise<void>
}

export const useDictionaryStore = create<DictionaryState>()((set, get) => ({
  selectedWord: null,
  anchorRect: null,
  entry: null,
  isLoading: false,
  isAddingToSrs: false,

  openPopup: async (token, rect) => {
    set({ selectedWord: token, anchorRect: rect, entry: null, isLoading: true })

    try {
      const params = new URLSearchParams({ word: token.baseForm })
      if (token.surface) params.set('surface', token.surface)
      if (token.reading) params.set('reading', token.reading)
      if (token.pos) params.set('pos', token.pos)

      const res = await fetch(`/api/v1/dictionary/lookup?${params}`)
      if (!res.ok) {
        set({ isLoading: false })
        return
      }

      const json = await res.json()
      set({ entry: json.data as DictionaryEntry, isLoading: false })
    } catch {
      set({ isLoading: false })
    }
  },

  closePopup: () => {
    set({
      selectedWord: null,
      anchorRect: null,
      entry: null,
      isLoading: false,
      isAddingToSrs: false,
    })
  },

  addToSrs: async () => {
    const { entry } = get()
    if (!entry?.vocabularyId) return

    set({ isAddingToSrs: true })

    try {
      const res = await fetch('/api/v1/srs/learn', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemId: entry.vocabularyId }),
      })

      if (!res.ok) {
        set({ isAddingToSrs: false })
        return
      }

      // Re-fetch entry to get updated SRS status
      const params = new URLSearchParams({ word: entry.baseForm })
      if (entry.surface) params.set('surface', entry.surface)
      if (entry.reading) params.set('reading', entry.reading)
      if (entry.pos) params.set('pos', entry.pos)

      const lookupRes = await fetch(`/api/v1/dictionary/lookup?${params}`)
      if (lookupRes.ok) {
        const json = await lookupRes.json()
        set({ entry: json.data as DictionaryEntry, isAddingToSrs: false })
      } else {
        set({ isAddingToSrs: false })
      }
    } catch {
      set({ isAddingToSrs: false })
    }
  },
}))
