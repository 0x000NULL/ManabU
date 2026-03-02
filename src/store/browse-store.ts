import { create } from 'zustand'
import type { VocabularyBrowseItem, VocabularyDetailItem, FrequencyTier, JlptLevel } from '@/types/vocabulary'

interface BrowseState {
  // Filters
  search: string
  jlptLevel: JlptLevel | null
  frequencyTier: FrequencyTier | null

  // Results
  items: VocabularyBrowseItem[]
  total: number
  page: number
  pageSize: number

  // Loading
  isLoading: boolean
  error: string | null

  // Detail modal
  selectedItemId: string | null
  detailItem: VocabularyDetailItem | null
  isDetailLoading: boolean
  isAddingToSrs: boolean

  // Actions
  setSearch: (search: string) => void
  setJlptLevel: (level: JlptLevel | null) => void
  setFrequencyTier: (tier: FrequencyTier | null) => void
  setPage: (page: number) => void
  fetchItems: () => Promise<void>
  openDetail: (id: string) => Promise<void>
  closeDetail: () => void
  addToSrs: (itemId: string) => Promise<void>
}

const PAGE_SIZE = 24

export const useBrowseStore = create<BrowseState>()((set, get) => ({
  search: '',
  jlptLevel: null,
  frequencyTier: null,
  items: [],
  total: 0,
  page: 1,
  pageSize: PAGE_SIZE,
  isLoading: false,
  error: null,
  selectedItemId: null,
  detailItem: null,
  isDetailLoading: false,
  isAddingToSrs: false,

  setSearch: (search) => {
    set({ search, page: 1 })
    get().fetchItems()
  },

  setJlptLevel: (level) => {
    set({ jlptLevel: level, page: 1 })
    get().fetchItems()
  },

  setFrequencyTier: (tier) => {
    set({ frequencyTier: tier, page: 1 })
    get().fetchItems()
  },

  setPage: (page) => {
    set({ page })
    get().fetchItems()
  },

  fetchItems: async () => {
    const { search, jlptLevel, frequencyTier, page, pageSize } = get()
    set({ isLoading: true, error: null })

    try {
      const params = new URLSearchParams()
      params.set('limit', String(pageSize))
      params.set('offset', String((page - 1) * pageSize))
      if (search) params.set('search', search)
      if (jlptLevel) params.set('jlptLevel', jlptLevel)
      if (frequencyTier) params.set('frequencyTier', frequencyTier)

      const res = await fetch(`/api/v1/vocabulary?${params}`)
      if (!res.ok) {
        set({ isLoading: false, error: 'Failed to load vocabulary' })
        return
      }

      const json = await res.json()
      set({
        items: json.data as VocabularyBrowseItem[],
        total: json.meta?.total ?? 0,
        isLoading: false,
      })
    } catch {
      set({ isLoading: false, error: 'Network error — please try again' })
    }
  },

  openDetail: async (id) => {
    set({ selectedItemId: id, detailItem: null, isDetailLoading: true })

    try {
      const res = await fetch(`/api/v1/vocabulary/${id}`)
      if (!res.ok) {
        set({ isDetailLoading: false })
        return
      }

      const json = await res.json()
      set({ detailItem: json.data as VocabularyDetailItem, isDetailLoading: false })
    } catch {
      set({ isDetailLoading: false })
    }
  },

  closeDetail: () => {
    set({ selectedItemId: null, detailItem: null, isDetailLoading: false, isAddingToSrs: false })
  },

  addToSrs: async (itemId) => {
    set({ isAddingToSrs: true })

    try {
      const res = await fetch('/api/v1/srs/learn', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemId }),
      })

      if (!res.ok) {
        set({ isAddingToSrs: false })
        return
      }

      // Re-fetch detail to get updated SRS status
      const detailRes = await fetch(`/api/v1/vocabulary/${itemId}`)
      if (detailRes.ok) {
        const json = await detailRes.json()
        set({ detailItem: json.data as VocabularyDetailItem, isAddingToSrs: false })
      } else {
        set({ isAddingToSrs: false })
      }
    } catch {
      set({ isAddingToSrs: false })
    }
  },
}))
