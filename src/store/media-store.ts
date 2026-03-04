import { create } from 'zustand'
import type { MediaContentListItem, MediaType, MediaDifficulty } from '@/types/media'

interface MediaState {
  // Filters
  search: string
  type: MediaType | null
  difficulty: MediaDifficulty | null

  // Results
  items: MediaContentListItem[]
  total: number
  page: number
  pageSize: number

  // Loading
  isLoading: boolean
  error: string | null

  // Actions
  setSearch: (search: string) => void
  setType: (type: MediaType | null) => void
  setDifficulty: (difficulty: MediaDifficulty | null) => void
  setPage: (page: number) => void
  fetchItems: () => Promise<void>
}

const PAGE_SIZE = 12

export const useMediaStore = create<MediaState>()((set, get) => ({
  search: '',
  type: null,
  difficulty: null,
  items: [],
  total: 0,
  page: 1,
  pageSize: PAGE_SIZE,
  isLoading: false,
  error: null,

  setSearch: (search) => {
    set({ search, page: 1 })
    get().fetchItems()
  },

  setType: (type) => {
    set({ type, page: 1 })
    get().fetchItems()
  },

  setDifficulty: (difficulty) => {
    set({ difficulty, page: 1 })
    get().fetchItems()
  },

  setPage: (page) => {
    set({ page })
    get().fetchItems()
  },

  fetchItems: async () => {
    const { search, type, difficulty, page, pageSize } = get()
    set({ isLoading: true, error: null })

    try {
      const params = new URLSearchParams()
      params.set('limit', String(pageSize))
      params.set('offset', String((page - 1) * pageSize))
      if (search) params.set('search', search)
      if (type) params.set('type', type)
      if (difficulty) params.set('difficulty', difficulty)

      const res = await fetch(`/api/v1/media?${params}`)
      if (!res.ok) {
        set({ isLoading: false, error: 'Failed to load media library' })
        return
      }

      const json = await res.json()
      set({
        items: json.data as MediaContentListItem[],
        total: json.meta?.total ?? 0,
        isLoading: false,
      })
    } catch {
      set({ isLoading: false, error: 'Network error — please try again' })
    }
  },
}))
