import { create } from 'zustand'
import type { KanaCharacter, KanaType } from '@/types/kana'
import type {
  QuizPhase,
  QuizQuestion,
  QuizAnswer,
  QuizSessionConfig,
  QuizSessionStats,
} from '@/types/quiz'
import {
  generateQuizQuestions,
  validateAnswer,
  calculateSessionStats,
} from '@/lib/utils/quiz-engine'
import { HIRAGANA_CHARACTERS } from '@/lib/constants/hiragana-data'
import { KATAKANA_CHARACTERS } from '@/lib/constants/katakana-data'

const KANA_CHARACTERS: Record<KanaType, KanaCharacter[]> = {
  hiragana: HIRAGANA_CHARACTERS,
  katakana: KATAKANA_CHARACTERS,
}

interface QuizState {
  phase: QuizPhase
  config: QuizSessionConfig | null
  kanaType: KanaType
  questions: QuizQuestion[]
  currentIndex: number
  answers: QuizAnswer[]
  questionStartTime: number
  showingFeedback: boolean
  lastAnswerCorrect: boolean | null

  // Actions
  startSession: (config: QuizSessionConfig, kanaType?: KanaType) => void
  submitAnswer: (userAnswer: string) => void
  nextQuestion: () => void
  restartSession: () => void
  practiceMissed: () => void
  resetToSetup: () => void

  // Selectors
  currentQuestion: () => QuizQuestion | null
  progress: () => { current: number; total: number }
  stats: () => QuizSessionStats
  availableCharacters: () => KanaCharacter[]
}

export const useQuizStore = create<QuizState>()((set, get) => ({
  phase: 'setup',
  config: null,
  kanaType: 'hiragana',
  questions: [],
  currentIndex: 0,
  answers: [],
  questionStartTime: 0,
  showingFeedback: false,
  lastAnswerCorrect: null,

  startSession: (config, kanaType = 'hiragana') => {
    const characters = KANA_CHARACTERS[kanaType]
    const questions = generateQuizQuestions(config, characters)
    set({
      phase: 'active',
      config,
      kanaType,
      questions,
      currentIndex: 0,
      answers: [],
      questionStartTime: Date.now(),
      showingFeedback: false,
      lastAnswerCorrect: null,
    })
  },

  submitAnswer: (userAnswer) => {
    const { questions, currentIndex, questionStartTime, answers } = get()
    const question = questions[currentIndex]
    if (!question) return

    const isCorrect = validateAnswer(question, userAnswer)
    const timeMs = Date.now() - questionStartTime

    const answer: QuizAnswer = {
      questionId: question.id,
      userAnswer,
      isCorrect,
      timeMs,
    }

    set({
      answers: [...answers, answer],
      showingFeedback: true,
      lastAnswerCorrect: isCorrect,
    })
  },

  nextQuestion: () => {
    const { currentIndex, questions } = get()
    const nextIndex = currentIndex + 1

    if (nextIndex >= questions.length) {
      set({ phase: 'results', showingFeedback: false })
    } else {
      set({
        currentIndex: nextIndex,
        showingFeedback: false,
        lastAnswerCorrect: null,
        questionStartTime: Date.now(),
      })
    }
  },

  restartSession: () => {
    const { config, kanaType } = get()
    if (config) {
      get().startSession(config, kanaType)
    }
  },

  practiceMissed: () => {
    const { config, kanaType } = get()
    const stats = get().stats()
    if (!config || stats.missedCharacters.length === 0) return

    const missedGroups = [...new Set(stats.missedCharacters.map((c) => c.group))]
    const missedConfig: QuizSessionConfig = {
      ...config,
      groupIds: missedGroups,
      questionCount: stats.missedCharacters.length,
    }

    // Generate questions only from missed characters
    const questions = generateQuizQuestions(missedConfig, stats.missedCharacters)
    set({
      phase: 'active',
      config: missedConfig,
      kanaType,
      questions,
      currentIndex: 0,
      answers: [],
      questionStartTime: Date.now(),
      showingFeedback: false,
      lastAnswerCorrect: null,
    })
  },

  resetToSetup: () => {
    set({
      phase: 'setup',
      config: null,
      kanaType: get().kanaType,
      questions: [],
      currentIndex: 0,
      answers: [],
      questionStartTime: 0,
      showingFeedback: false,
      lastAnswerCorrect: null,
    })
  },

  currentQuestion: () => {
    const { questions, currentIndex } = get()
    return questions[currentIndex] ?? null
  },

  progress: () => {
    const { currentIndex, questions } = get()
    return { current: currentIndex + 1, total: questions.length }
  },

  stats: () => {
    const { answers, questions } = get()
    return calculateSessionStats(answers, questions)
  },

  availableCharacters: () => {
    const { config, kanaType } = get()
    if (!config) return []
    return KANA_CHARACTERS[kanaType].filter((c) => config.groupIds.includes(c.group))
  },
}))
