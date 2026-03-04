import type { Rating, ProgressStatus } from '@/types/progress'
import type { VocabMetadata } from '@/types/vocabulary'

/** Matches the shape returned by GET /api/v1/srs/due → items[] */
export interface DueReviewItem {
  id: string
  word: string
  reading: string
  meaning: string
  part_of_speech: string | null
  jlpt_level: string | null
  frequency_rank: number | null
  tags: VocabMetadata | string[]
  audio_url: string | null
  sentences: {
    id: string
    japanese: string
    english: string
    furigana: string | null
  }[]
  srs: {
    repetitions: number
    easeFactor: number
    interval: number
    status: ProgressStatus
    nextReviewAt: string | null
    lastReviewedAt: string | null
    totalReviews: number
    correctReviews: number
  }
}

export type ReviewPhase = 'loading' | 'reviewing' | 'completed' | 'empty' | 'error'

export interface ReviewAnswer {
  itemId: string
  word: string
  rating: Rating
}

export interface ReviewSessionStats {
  totalReviewed: number
  againCount: number
  hardCount: number
  goodCount: number
  easyCount: number
  totalDueAtStart: number
}
