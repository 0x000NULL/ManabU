export type GrammarDifficulty = 'beginner' | 'intermediate' | 'advanced'

export type GrammarCategoryId =
  | 'particles'
  | 'copula-existence'
  | 'verbs'
  | 'adjectives'
  | 'sentence-patterns'
  | 'connectors'
  | 'giving-receiving'

export interface GrammarCategory {
  id: GrammarCategoryId
  name: string
  description: string
}

export const GRAMMAR_CATEGORIES: GrammarCategory[] = [
  {
    id: 'particles',
    name: 'Particles',
    description: 'Small words that mark grammatical relationships between words in a sentence.',
  },
  {
    id: 'copula-existence',
    name: 'Copula & Existence',
    description: 'Patterns for stating what things are and expressing existence.',
  },
  {
    id: 'verbs',
    name: 'Verbs',
    description: 'Verb conjugation forms for tense, politeness, and aspect.',
  },
  {
    id: 'adjectives',
    name: 'Adjectives',
    description: 'How to use and conjugate い-adjectives and な-adjectives.',
  },
  {
    id: 'sentence-patterns',
    name: 'Sentence Patterns',
    description: 'Sentence-ending particles and structural patterns.',
  },
  {
    id: 'connectors',
    name: 'Connectors',
    description: 'Words and forms that connect clauses and express reasons, desires, and suggestions.',
  },
  {
    id: 'giving-receiving',
    name: 'Giving & Receiving',
    description: 'Expressions for doing favors and receiving help from others.',
  },
]

export const PATTERN_CATEGORY_MAP: Record<string, GrammarCategoryId> = {
  // Particles
  'は': 'particles',
  'が': 'particles',
  'を': 'particles',
  'に': 'particles',
  'で': 'particles',
  'へ': 'particles',
  'と': 'particles',
  'も': 'particles',
  // Copula & Existence
  'です': 'copula-existence',
  'じゃないです': 'copula-existence',
  'があります': 'copula-existence',
  'がいます': 'copula-existence',
  // Verbs
  'ます': 'verbs',
  'ません': 'verbs',
  'ました': 'verbs',
  'ませんでした': 'verbs',
  'て-form': 'verbs',
  'ている': 'verbs',
  // Adjectives
  'い-adjective': 'adjectives',
  'な-adjective': 'adjectives',
  'くない': 'adjectives',
  'じゃない': 'adjectives',
  // Sentence Patterns
  'か': 'sentence-patterns',
  'の': 'sentence-patterns',
  'ね': 'sentence-patterns',
  'よ': 'sentence-patterns',
  // Connectors
  'から': 'connectors',
  'けど / が': 'connectors',
  'たい': 'connectors',
  'ましょう': 'connectors',
  // N4 — Verbs
  '辞書形': 'verbs',
  'ない-form': 'verbs',
  'た-form': 'verbs',
  'たことがある': 'verbs',
  'たり〜たりする': 'verbs',
  'てある': 'verbs',
  'てしまう': 'verbs',
  '受身形': 'verbs',
  '使役形': 'verbs',
  // N4 — Connectors
  'なければならない': 'connectors',
  'なくてもいい': 'connectors',
  'たら': 'connectors',
  'ば-form': 'connectors',
  'のに': 'connectors',
  // N4 — Sentence Patterns
  'ことができる': 'sentence-patterns',
  'と思う': 'sentence-patterns',
  'そうだ': 'sentence-patterns',
  '方がいい': 'sentence-patterns',
  // N4 — Giving & Receiving
  'てあげる・てくれる・てもらう': 'giving-receiving',
  // N4 — Adjectives
  'すぎる': 'adjectives',
}

export interface GrammarProgressStats {
  total: number
  learned: number
  mastered: number
}

export interface GrammarExampleItem {
  japanese: string
  english: string
  furigana?: string
}

/** Shape used in the constants file for seeding */
export interface GrammarPatternData {
  pattern: string
  meaning: string
  formation: string
  jlpt_level: string
  difficulty: GrammarDifficulty
  explanation: string
  notes?: string
  common_mistakes?: string
  examples: GrammarExampleItem[]
}

/** API list response item — pattern with limited examples */
export interface GrammarPatternListItem {
  id: string
  pattern: string
  meaning: string
  formation: string
  jlpt_level: string | null
  difficulty: string | null
  explanation: string
  notes: string | null
  common_mistakes: string | null
  examples: {
    id: string
    japanese: string
    english: string
    furigana: string | null
  }[]
}

/** SRS status returned by grammar detail endpoint */
export interface GrammarSrsStatus {
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

/** Detail item — full pattern with all examples + optional SRS */
export interface GrammarPatternDetailItem extends GrammarPatternListItem {
  srs: GrammarSrsStatus | null
}
