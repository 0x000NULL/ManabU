import { create } from 'zustand'
import type { Rating } from '@/types/progress'
import type {
  MinedSentenceReviewItem,
  MinedSentenceReviewPhase,
  MinedSentenceReviewAnswer,
} from '@/types/mined-sentence'

interface MinedSentenceReviewState {
  phase: MinedSentenceReviewPhase
  queue: MinedSentenceReviewItem[]
  currentIndex: number
  isRevealed: boolean
  answers: MinedSentenceReviewAnswer[]
  totalDueAtStart: number
  isSubmitting: boolean
  error: string | null

  startSession: () => Promise<void>
  reveal: () => void
  submitRating: (rating: Rating) => Promise<void>
  reset: () => void

  currentCard: () => MinedSentenceReviewItem | null
  progress: () => { current: number; total: number }
  stats: () => {
    totalReviewed: number
    againCount: number
    hardCount: number
    goodCount: number
    easyCount: number
    totalDueAtStart: number
  }
}

const initialState = {
  phase: 'loading' as MinedSentenceReviewPhase,
  queue: [] as MinedSentenceReviewItem[],
  currentIndex: 0,
  isRevealed: false,
  answers: [] as MinedSentenceReviewAnswer[],
  totalDueAtStart: 0,
  isSubmitting: false,
  error: null as string | null,
}

export const useMinedSentenceReviewStore = create<MinedSentenceReviewState>()((set, get) => ({
  ...initialState,

  startSession: async () => {
    set({ ...initialState, phase: 'loading' })

    try {
      const res = await fetch('/api/v1/sentences/mine/due?limit=50')
      if (!res.ok) {
        set({ phase: 'error', error: 'Failed to load reviews' })
        return
      }

      const json = await res.json()
      const { dueCount, items } = json.data as {
        dueCount: number
        items: MinedSentenceReviewItem[]
      }

      if (items.length === 0) {
        set({ phase: 'empty', totalDueAtStart: 0 })
        return
      }

      set({
        phase: 'reviewing',
        queue: items,
        currentIndex: 0,
        isRevealed: false,
        answers: [],
        totalDueAtStart: dueCount,
        isSubmitting: false,
        error: null,
      })
    } catch {
      set({ phase: 'error', error: 'Network error — please try again' })
    }
  },

  reveal: () => {
    set({ isRevealed: true })
  },

  submitRating: async (rating) => {
    const { queue, currentIndex, answers, isSubmitting } = get()
    if (isSubmitting) return

    const card = queue[currentIndex]
    if (!card) return

    set({ isSubmitting: true })

    try {
      const res = await fetch('/api/v1/sentences/mine/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemId: card.id, rating }),
      })

      if (!res.ok) {
        set({ isSubmitting: false })
        return
      }

      const answer: MinedSentenceReviewAnswer = {
        itemId: card.id,
        japanese: card.japanese,
        rating,
      }

      const newAnswers = [...answers, answer]
      const nextIndex = currentIndex + 1

      if (nextIndex >= queue.length) {
        set({
          answers: newAnswers,
          phase: 'completed',
          isSubmitting: false,
        })
      } else {
        set({
          answers: newAnswers,
          currentIndex: nextIndex,
          isRevealed: false,
          isSubmitting: false,
        })
      }
    } catch {
      set({ isSubmitting: false })
    }
  },

  reset: () => {
    set(initialState)
  },

  currentCard: () => {
    const { queue, currentIndex } = get()
    return queue[currentIndex] ?? null
  },

  progress: () => {
    const { currentIndex, queue } = get()
    return { current: currentIndex + 1, total: queue.length }
  },

  stats: () => {
    const { answers, totalDueAtStart } = get()
    return {
      totalReviewed: answers.length,
      againCount: answers.filter((a) => a.rating === 'again').length,
      hardCount: answers.filter((a) => a.rating === 'hard').length,
      goodCount: answers.filter((a) => a.rating === 'good').length,
      easyCount: answers.filter((a) => a.rating === 'easy').length,
      totalDueAtStart,
    }
  },
}))
