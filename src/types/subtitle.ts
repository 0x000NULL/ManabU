import type { SubtitleCue } from '@/lib/utils/subtitle-parser'

export type SubtitleLanguage = 'ja' | 'en'

export type SubtitleFontSize = 'small' | 'medium' | 'large'

export interface SubtitlePreferences {
  showJapanese: boolean
  showEnglish: boolean
  fontSize: SubtitleFontSize
}

export interface ActiveSubtitles {
  ja: SubtitleCue | null
  en: SubtitleCue | null
}

export interface TokenizedWord {
  surface: string
  baseForm: string
  reading: string
  pos: string
  posDetail: string
  isContentWord: boolean
}

export interface DictionaryEntry {
  surface: string
  baseForm: string
  reading: string
  pos: string
  posDetail: string
  vocabularyId: string | null
  meaning: string | null
  jlptLevel: string | null
  frequencyRank: number | null
  sentences: {
    id: string
    japanese: string
    english: string
    furigana: string | null
  }[]
  srs: {
    status: string
    repetitions: number
    nextReviewAt: string | null
  } | null
}
