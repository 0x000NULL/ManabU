'use client'

import { useEffect, useRef } from 'react'
import { cn } from '@/lib/utils/cn'
import type { GrammarQuizQuestion } from '@/types/grammar-quiz'

interface GrammarQuizFeedbackProps {
  isCorrect: boolean
  question: GrammarQuizQuestion
  onNext: () => void
}

export function GrammarQuizFeedback({
  isCorrect,
  question,
  onNext,
}: GrammarQuizFeedbackProps) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (isCorrect) {
      timerRef.current = setTimeout(onNext, 1200)
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [isCorrect, onNext])

  return (
    <div
      className={cn(
        'rounded-lg border px-4 py-3',
        isCorrect
          ? 'border-green-300 bg-green-50 dark:border-green-700 dark:bg-green-900/20'
          : 'border-red-300 bg-red-50 dark:border-red-700 dark:bg-red-900/20',
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-2">
          {isCorrect ? (
            <svg
              className="mt-0.5 h-5 w-5 shrink-0 text-green-600 dark:text-green-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          ) : (
            <svg
              className="mt-0.5 h-5 w-5 shrink-0 text-red-600 dark:text-red-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          )}
          <div>
            {isCorrect ? (
              <p className="font-medium text-green-700 dark:text-green-300">Correct!</p>
            ) : (
              <div>
                <p className="font-medium text-red-700 dark:text-red-300">Incorrect</p>
                <p className="mt-0.5 text-sm text-red-600 dark:text-red-400">
                  The answer is{' '}
                  <span className="font-semibold">{question.correctAnswer}</span>
                </p>
                <p className="mt-1 text-sm text-red-600/80 dark:text-red-400/80">
                  {question.explanation}
                </p>
              </div>
            )}
          </div>
        </div>

        {!isCorrect && (
          <button
            onClick={onNext}
            className="shrink-0 rounded-md bg-red-100 px-3 py-1.5 text-sm font-medium text-red-700 transition-colors hover:bg-red-200 dark:bg-red-900/30 dark:text-red-300 dark:hover:bg-red-900/50"
          >
            Next
          </button>
        )}
      </div>
    </div>
  )
}
