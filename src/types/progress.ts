export type ProgressStatus = 'new' | 'learning' | 'reviewing' | 'mastered'

export interface CharacterProgress {
  character: string
  romaji: string
  group: string
  status: ProgressStatus
  repetitions: number
  totalReviews: number
  correctReviews: number
  accuracy: number
  lastReviewedAt: string | null
  nextReviewAt: string | null
}

export interface HiraganaProgressSummary {
  totalCharacters: number
  learnedCount: number
  masteredCount: number
  reviewingCount: number
  learningCount: number
  newCount: number
  overallAccuracy: number
  completionPercent: number
  dueCount: number
  characters: CharacterProgress[]
}

export type KanaProgressSummary = HiraganaProgressSummary

export interface GroupProgress {
  groupId: string
  totalCharacters: number
  learnedCount: number
  masteredCount: number
  accuracy: number
}

export interface Achievement {
  id: string
  title: string
  description: string
  achieved: boolean
}

export interface SrsState {
  repetitions: number
  interval: number
  nextReviewAt: Date | null
  lastReviewedAt: Date
}

export interface SrsUpdate {
  repetitions: number
  interval: number
  nextReviewAt: Date
  status: ProgressStatus
}

export interface DueReviewsResponse {
  dueCount: number
  characters: { character: string; romaji: string; group: string }[]
}

// --- Modified SM-2 types (vocabulary/kanji/grammar SRS) ---

export type Rating = 'again' | 'hard' | 'good' | 'easy'

export interface SRSCard {
  repetitions: number
  easeFactor: number
  interval: number
}

export interface SrsReviewResult {
  repetitions: number
  easeFactor: number
  interval: number
  status: ProgressStatus
  nextReviewAt: Date
}
