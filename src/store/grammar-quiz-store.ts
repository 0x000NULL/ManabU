import { create } from 'zustand'
import type {
  GrammarQuizPhase,
  GrammarQuizQuestion,
  GrammarQuizAnswer,
  GrammarQuizSessionConfig,
  GrammarQuizSessionStats,
} from '@/types/grammar-quiz'
import { GRAMMAR_EXERCISES, getExercisesByPatterns } from '@/lib/constants/grammar-exercises'
import {
  generateGrammarQuizQuestions,
  validateGrammarAnswer,
  calculateGrammarSessionStats,
} from '@/lib/utils/grammar-quiz-engine'

interface GrammarQuizState {
  phase: GrammarQuizPhase
  config: GrammarQuizSessionConfig | null
  questions: GrammarQuizQuestion[]
  currentIndex: number
  answers: GrammarQuizAnswer[]
  questionStartTime: number
  showingFeedback: boolean
  lastAnswerCorrect: boolean | null

  // Actions
  startSession: (
    config: GrammarQuizSessionConfig,
    patternIdMap: Map<string, string>,
  ) => void
  submitAnswer: (userAnswer: string) => void
  nextQuestion: () => void
  restartSession: (patternIdMap: Map<string, string>) => void
  practiceMissed: () => void
  resetToSetup: () => void

  // Selectors
  currentQuestion: () => GrammarQuizQuestion | null
  progress: () => { current: number; total: number }
  stats: () => GrammarQuizSessionStats
}

export const useGrammarQuizStore = create<GrammarQuizState>()((set, get) => ({
  phase: 'setup',
  config: null,
  questions: [],
  currentIndex: 0,
  answers: [],
  questionStartTime: 0,
  showingFeedback: false,
  lastAnswerCorrect: null,

  startSession: (config, patternIdMap) => {
    const questions = generateGrammarQuizQuestions(config, GRAMMAR_EXERCISES, patternIdMap)
    set({
      phase: questions.length > 0 ? 'active' : 'setup',
      config,
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

    const isCorrect = validateGrammarAnswer(question, userAnswer)
    const timeMs = Date.now() - questionStartTime

    const answer: GrammarQuizAnswer = {
      questionId: question.id,
      patternId: question.patternId,
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

  restartSession: (patternIdMap) => {
    const { config } = get()
    if (config) {
      get().startSession(config, patternIdMap)
    }
  },

  practiceMissed: () => {
    const { config } = get()
    const stats = get().stats()
    if (!config || stats.missedPatterns.length === 0) return

    // Build a filtered patternIdMap with only missed patterns
    const missedMap = new Map<string, string>()
    for (const missed of stats.missedPatterns) {
      missedMap.set(missed.pattern, missed.patternId)
    }

    // Get exercises only for missed patterns
    const missedExercises = getExercisesByPatterns(
      stats.missedPatterns.map((m) => m.pattern),
    )

    const missedConfig: GrammarQuizSessionConfig = {
      ...config,
      questionCount: Math.min(config.questionCount || 10, missedExercises.length),
    }

    const questions = generateGrammarQuizQuestions(
      missedConfig,
      missedExercises,
      missedMap,
    )

    set({
      phase: questions.length > 0 ? 'active' : 'results',
      config: missedConfig,
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
    return calculateGrammarSessionStats(answers, questions)
  },
}))
