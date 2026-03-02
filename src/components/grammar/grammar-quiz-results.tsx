'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils/cn'
import { Button } from '@/components/ui/button'
import { useGrammarQuizStore } from '@/store/grammar-quiz-store'
import { useGrammarStore } from '@/store/grammar-store'
import { calculateGrammarSessionStats } from '@/lib/utils/grammar-quiz-engine'

export function GrammarQuizResults() {
  const answers = useGrammarQuizStore((s) => s.answers)
  const questions = useGrammarQuizStore((s) => s.questions)
  const stats = useMemo(
    () => calculateGrammarSessionStats(answers, questions),
    [answers, questions],
  )
  const restartSession = useGrammarQuizStore((s) => s.restartSession)
  const practiceMissed = useGrammarQuizStore((s) => s.practiceMissed)
  const resetToSetup = useGrammarQuizStore((s) => s.resetToSetup)
  const patterns = useGrammarStore((s) => s.patterns)
  const fetchProgress = useGrammarStore((s) => s.fetchProgress)
  const [progressSaved, setProgressSaved] = useState<boolean | null>(null)

  // Build patternIdMap for restartSession / practiceMissed
  const patternIdMap = useMemo(() => {
    const map = new Map<string, string>()
    for (const p of patterns) {
      map.set(p.pattern, p.id)
    }
    return map
  }, [patterns])

  // Submit progress to API
  useEffect(() => {
    if (answers.length === 0) return

    const progressAnswers = answers.map((a) => ({
      patternId: a.patternId,
      isCorrect: a.isCorrect,
    }))

    fetch('/api/v1/grammar/progress', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ answers: progressAnswers }),
    })
      .then((res) => {
        if (res.ok) {
          setProgressSaved(true)
          fetchProgress()
        } else {
          setProgressSaved(false)
        }
      })
      .catch(() => setProgressSaved(false))
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const accuracyColor =
    stats.accuracy >= 80
      ? 'text-green-600 dark:text-green-400'
      : stats.accuracy >= 60
        ? 'text-yellow-600 dark:text-yellow-400'
        : 'text-red-600 dark:text-red-400'

  const totalSeconds = Math.round(stats.totalTimeMs / 1000)
  const avgSeconds = (stats.averageTimeMs / 1000).toFixed(1)

  return (
    <div className="space-y-8">
      {/* Score */}
      <div className="text-center">
        <p className={cn('text-5xl font-bold', accuracyColor)}>
          {stats.correctCount}/{stats.totalQuestions}
        </p>
        <p className={cn('mt-1 text-2xl font-semibold', accuracyColor)}>{stats.accuracy}%</p>
        <p className="mt-2 text-sm text-muted-foreground">
          {totalSeconds}s total &middot; {avgSeconds}s per question
        </p>
        {progressSaved === true && (
          <p className="mt-2 text-xs text-green-600 dark:text-green-400">Progress saved</p>
        )}
        {progressSaved === false && (
          <p className="mt-2 text-xs text-muted-foreground">Could not save progress</p>
        )}
      </div>

      {/* Missed patterns */}
      {stats.missedPatterns.length > 0 && (
        <section>
          <h3 className="mb-3 text-lg font-semibold text-foreground">Patterns to Review</h3>
          <div className="flex flex-wrap gap-2">
            {stats.missedPatterns.map((item) => (
              <Link
                key={item.patternId}
                href={`/grammar/${item.patternId}`}
                className="rounded-lg border border-red-200 bg-red-50/50 px-3 py-2 text-sm font-medium text-red-700 transition-colors hover:bg-red-100 dark:border-red-800 dark:bg-red-900/10 dark:text-red-400 dark:hover:bg-red-900/20"
              >
                {item.pattern}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Actions */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <Button onClick={() => restartSession(patternIdMap)}>Practice Again</Button>
        {stats.missedPatterns.length > 0 && (
          <Button variant="outline" onClick={() => practiceMissed()}>
            Practice Missed ({stats.missedPatterns.length})
          </Button>
        )}
        <Button variant="ghost" onClick={resetToSetup}>
          Change Settings
        </Button>
        <Link href="/grammar">
          <Button variant="ghost" className="w-full sm:w-auto">
            View Grammar
          </Button>
        </Link>
      </div>
    </div>
  )
}
