import type {
  GrammarExercise,
  GrammarQuizQuestion,
  GrammarQuizAnswer,
  GrammarQuizSessionConfig,
  GrammarQuizSessionStats,
} from '@/types/grammar-quiz'
import { PATTERN_CATEGORY_MAP } from '@/types/grammar'

/**
 * Fisher-Yates shuffle. Returns a new array.
 */
export function shuffleArray<T>(arr: T[]): T[] {
  const result = [...arr]
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[result[i], result[j]] = [result[j], result[i]]
  }
  return result
}

/**
 * Generate a quiz question from a static exercise definition.
 */
export function generateQuestionFromExercise(
  exercise: GrammarExercise,
  patternId: string,
): GrammarQuizQuestion {
  return {
    id: `${exercise.id}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    type: exercise.type,
    patternId,
    pattern: exercise.pattern,
    sentence: exercise.sentence,
    english: exercise.english,
    correctAnswer: exercise.correctAnswer,
    options: shuffleArray(exercise.options),
    explanation: exercise.explanation,
  }
}

/**
 * Generate grammar quiz questions based on config.
 * Filters exercises by category, JLPT level, and mode, then shuffles and limits.
 */
export function generateGrammarQuizQuestions(
  config: GrammarQuizSessionConfig,
  exercises: GrammarExercise[],
  patternIdMap: Map<string, string>,
): GrammarQuizQuestion[] {
  // Filter by category
  let filtered = exercises
  if (config.categoryIds.length > 0) {
    filtered = filtered.filter((ex) => {
      const category = PATTERN_CATEGORY_MAP[ex.pattern]
      return category && config.categoryIds.includes(category)
    })
  }

  // Filter by mode
  if (config.mode !== 'mixed') {
    filtered = filtered.filter((ex) => ex.type === config.mode)
  }

  // Only include exercises whose pattern is in the patternIdMap
  filtered = filtered.filter((ex) => patternIdMap.has(ex.pattern))

  if (filtered.length === 0) return []

  // Shuffle
  let pool = shuffleArray(filtered)

  // Limit to question count (0 = all)
  const count = config.questionCount > 0 ? config.questionCount : pool.length
  if (pool.length < count) {
    // Cycle through exercises to fill the count
    const cycled: GrammarExercise[] = []
    while (cycled.length < count) {
      const remaining = count - cycled.length
      cycled.push(...shuffleArray(filtered).slice(0, remaining))
    }
    pool = cycled
  } else {
    pool = pool.slice(0, count)
  }

  return pool.map((exercise) => {
    const patternId = patternIdMap.get(exercise.pattern) ?? ''
    return generateQuestionFromExercise(exercise, patternId)
  })
}

/**
 * Validate user's answer against the question's correct answer.
 */
export function validateGrammarAnswer(
  question: GrammarQuizQuestion,
  userAnswer: string,
): boolean {
  return question.correctAnswer.trim() === userAnswer.trim()
}

/**
 * Calculate session stats from answers and questions.
 */
export function calculateGrammarSessionStats(
  answers: GrammarQuizAnswer[],
  questions: GrammarQuizQuestion[],
): GrammarQuizSessionStats {
  const totalQuestions = questions.length
  const correctCount = answers.filter((a) => a.isCorrect).length
  const incorrectCount = answers.filter((a) => !a.isCorrect).length
  const totalTimeMs = answers.reduce((sum, a) => sum + a.timeMs, 0)
  const averageTimeMs = answers.length > 0 ? Math.round(totalTimeMs / answers.length) : 0

  const missedIds = new Set(answers.filter((a) => !a.isCorrect).map((a) => a.questionId))
  const missedPatterns = questions
    .filter((q) => missedIds.has(q.id))
    .map((q) => ({ pattern: q.pattern, patternId: q.patternId }))
    .filter(
      (item, i, arr) => arr.findIndex((x) => x.patternId === item.patternId) === i,
    )

  return {
    totalQuestions,
    correctCount,
    incorrectCount,
    accuracy: totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0,
    averageTimeMs,
    totalTimeMs,
    missedPatterns,
  }
}
