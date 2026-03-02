import { create } from 'zustand'
import type { HiraganaProgressSummary } from '@/types/progress'
import type { KanaType } from '@/types/kana'

interface ProgressState {
  hiragana: HiraganaProgressSummary | null
  katakana: HiraganaProgressSummary | null
  isLoading: boolean
  error: string | null

  fetchHiraganaProgress: () => Promise<void>
  fetchKatakanaProgress: () => Promise<void>
  submitQuizResults: (
    answers: { character: string; isCorrect: boolean }[],
    kanaType?: KanaType,
  ) => Promise<void>
}

export const useProgressStore = create<ProgressState>()((set) => ({
  hiragana: null,
  katakana: null,
  isLoading: false,
  error: null,

  fetchHiraganaProgress: async () => {
    set({ isLoading: true, error: null })
    try {
      const res = await fetch('/api/v1/hiragana/progress')
      const data = await res.json()
      if (data.success) {
        set({ hiragana: data.data })
      } else {
        set({ error: data.error?.message ?? 'Failed to fetch progress' })
      }
    } catch {
      set({ error: 'Failed to fetch progress' })
    } finally {
      set({ isLoading: false })
    }
  },

  fetchKatakanaProgress: async () => {
    set({ isLoading: true, error: null })
    try {
      const res = await fetch('/api/v1/katakana/progress')
      const data = await res.json()
      if (data.success) {
        set({ katakana: data.data })
      } else {
        set({ error: data.error?.message ?? 'Failed to fetch progress' })
      }
    } catch {
      set({ error: 'Failed to fetch progress' })
    } finally {
      set({ isLoading: false })
    }
  },

  submitQuizResults: async (answers, kanaType = 'hiragana') => {
    set({ isLoading: true, error: null })
    try {
      const res = await fetch(`/api/v1/${kanaType}/progress`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers }),
      })
      const data = await res.json()
      if (data.success) {
        set({ [kanaType]: data.data })
      } else {
        set({ error: data.error?.message ?? 'Failed to submit results' })
      }
    } catch {
      set({ error: 'Failed to submit results' })
    } finally {
      set({ isLoading: false })
    }
  },
}))
