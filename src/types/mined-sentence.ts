import type { ProgressStatus, Rating } from '@/types/progress'

export interface MinedSentence {
  id: string
  japanese: string
  english: string | null
  sourceMediaId: string | null
  sourceEpisode: number | null
  sourceTimestamp: number | null
  screenshotUrl: string | null
  notes: string | null
  createdAt: string
}

export interface MinedSentenceWithSource extends MinedSentence {
  mediaTitle: string | null
  mediaTitleEnglish: string | null
}

export interface MinedSentenceReviewItem {
  id: string
  japanese: string
  english: string | null
  screenshotUrl: string | null
  notes: string | null
  sourceMediaId: string | null
  sourceEpisode: number | null
  sourceTimestamp: number | null
  mediaTitle: string | null
  mediaTitleEnglish: string | null
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

export type MinedSentenceReviewPhase = 'loading' | 'reviewing' | 'completed' | 'empty' | 'error'

export interface MinedSentenceReviewAnswer {
  itemId: string
  japanese: string
  rating: Rating
}
