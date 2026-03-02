export interface KanaExampleWord {
  word: string
  reading: string
  meaning: string
}

export interface KanaCharacter {
  character: string
  romaji: string
  type: 'hiragana' | 'katakana'
  group: string
  display_order: number
  is_combination: boolean
  stroke_count: number
  mnemonic: string
  stroke_order_svg: string | null
  audio_url: string | null
  example_words: KanaExampleWord[]
}

export interface KanaGroup {
  id: string
  name: string
  display_order: number
  description: string
  character_count: number
  is_dakuten: boolean
  is_combination: boolean
}

export type KanaType = 'hiragana' | 'katakana'

export interface KanaRule {
  id: string
  title: string
  description: string
  examples: {
    japanese: string
    romaji: string
    meaning: string
    explanation: string
  }[]
}

export type HiraganaRule = KanaRule
