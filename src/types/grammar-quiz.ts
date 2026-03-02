export type GrammarExerciseType = 'fill_in_blank' | 'multiple_choice'
export type GrammarQuizMode = 'fill_in_blank' | 'multiple_choice' | 'mixed'
export type GrammarQuizPhase = 'setup' | 'active' | 'results'

export interface GrammarExercise {
  id: string
  pattern: string
  type: GrammarExerciseType
  sentence: string
  english: string
  correctAnswer: string
  options: string[]
  explanation: string
}

export interface GrammarQuizQuestion {
  id: string
  type: GrammarExerciseType
  patternId: string
  pattern: string
  sentence: string
  english: string
  correctAnswer: string
  options: string[]
  explanation: string
}

export interface GrammarQuizAnswer {
  questionId: string
  patternId: string
  userAnswer: string
  isCorrect: boolean
  timeMs: number
}

export interface GrammarQuizSessionConfig {
  mode: GrammarQuizMode
  categoryIds: string[]
  jlptLevels: string[]
  questionCount: number
}

export interface GrammarQuizSessionStats {
  totalQuestions: number
  correctCount: number
  incorrectCount: number
  accuracy: number
  averageTimeMs: number
  totalTimeMs: number
  missedPatterns: { pattern: string; patternId: string }[]
}
