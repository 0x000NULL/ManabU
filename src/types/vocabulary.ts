export type FrequencyTier = 'essential' | 'core' | 'intermediate' | 'expanding' | 'advanced'

export interface VocabularyItem {
  id: string
  word: string
  reading: string
  meaning: string
  part_of_speech: string | null
  jlpt_level: string | null
  frequency_rank: number | null
  tags: string[]
  audio_url: string | null
}

export interface ExampleSentenceItem {
  id: string
  source_id: string | null
  japanese: string
  english: string
  furigana: string | null
  audio_url: string | null
}

export type JlptLevel = 'N5' | 'N4' | 'N3'

/** Browse list item — VocabularyItem + sentences */
export interface VocabularyBrowseItem extends VocabularyItem {
  sentences: {
    id: string
    japanese: string
    english: string
    furigana: string | null
  }[]
}

/** SRS status returned by vocabulary detail endpoint */
export interface VocabularySrsStatus {
  id: string
  repetitions: number
  easeFactor: number
  interval: number
  status: string
  nextReviewAt: string | null
  lastReviewedAt: string | null
  totalReviews: number
  correctReviews: number
  accuracy: number
}

/** Detail item — full word info with sentences + optional SRS */
export interface VocabularyDetailItem extends VocabularyItem {
  sentences: ExampleSentenceItem[]
  srs: VocabularySrsStatus | null
}
