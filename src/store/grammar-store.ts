import { create } from 'zustand'
import type {
  GrammarDifficulty,
  GrammarPatternListItem,
  GrammarPatternDetailItem,
  GrammarProgressStats,
  GrammarCategoryId,
} from '@/types/grammar'
import { PATTERN_CATEGORY_MAP, GRAMMAR_CATEGORIES } from '@/types/grammar'

interface GrammarState {
  // Pattern list
  patterns: GrammarPatternListItem[]
  isLoading: boolean
  error: string | null

  // Filters (client-side)
  search: string
  difficulty: GrammarDifficulty | null

  // Progress
  progress: GrammarProgressStats | null

  // Detail
  currentPattern: GrammarPatternDetailItem | null
  isDetailLoading: boolean

  // Actions
  fetchPatterns: () => Promise<void>
  fetchPatternDetail: (id: string) => Promise<void>
  fetchProgress: () => Promise<void>
  setSearch: (search: string) => void
  setDifficulty: (difficulty: GrammarDifficulty | null) => void
  getFilteredPatterns: () => GrammarPatternListItem[]
  getPatternsByCategory: () => {
    categoryId: GrammarCategoryId
    name: string
    description: string
    patterns: GrammarPatternListItem[]
  }[]
}

export const useGrammarStore = create<GrammarState>()((set, get) => ({
  patterns: [],
  isLoading: false,
  error: null,
  search: '',
  difficulty: null,
  progress: null,
  currentPattern: null,
  isDetailLoading: false,

  fetchPatterns: async () => {
    if (get().patterns.length > 0) return
    set({ isLoading: true, error: null })

    try {
      const res = await fetch('/api/v1/grammar?limit=100')
      if (!res.ok) {
        set({ isLoading: false, error: 'Failed to load grammar patterns' })
        return
      }

      const json = await res.json()
      set({ patterns: json.data as GrammarPatternListItem[], isLoading: false })
    } catch {
      set({ isLoading: false, error: 'Network error — please try again' })
    }
  },

  fetchPatternDetail: async (id) => {
    set({ currentPattern: null, isDetailLoading: true })

    try {
      const res = await fetch(`/api/v1/grammar/${id}`)
      if (!res.ok) {
        set({ isDetailLoading: false })
        return
      }

      const json = await res.json()
      set({ currentPattern: json.data as GrammarPatternDetailItem, isDetailLoading: false })
    } catch {
      set({ isDetailLoading: false })
    }
  },

  fetchProgress: async () => {
    try {
      const res = await fetch('/api/v1/grammar/progress')
      if (!res.ok) return

      const json = await res.json()
      set({ progress: json.data as GrammarProgressStats })
    } catch {
      // Silently fail — progress is non-critical
    }
  },

  setSearch: (search) => set({ search }),
  setDifficulty: (difficulty) => set({ difficulty }),

  getFilteredPatterns: () => {
    const { patterns, search, difficulty } = get()
    let filtered = patterns

    if (search) {
      const q = search.toLowerCase()
      filtered = filtered.filter(
        (p) =>
          p.pattern.toLowerCase().includes(q) ||
          p.meaning.toLowerCase().includes(q) ||
          p.explanation.toLowerCase().includes(q),
      )
    }

    if (difficulty) {
      filtered = filtered.filter((p) => p.difficulty === difficulty)
    }

    return filtered
  },

  getPatternsByCategory: () => {
    const filtered = get().getFilteredPatterns()

    return GRAMMAR_CATEGORIES.map((cat) => ({
      categoryId: cat.id,
      name: cat.name,
      description: cat.description,
      patterns: filtered.filter(
        (p) => PATTERN_CATEGORY_MAP[p.pattern] === cat.id,
      ),
    })).filter((group) => group.patterns.length > 0)
  },
}))
