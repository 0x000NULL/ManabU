'use client'

import { useEffect, useMemo, useState } from 'react'
import { cn } from '@/lib/utils/cn'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { AudioPlayButton } from '@/components/hiragana/audio-play-button'
import { useQuizStore } from '@/store/quiz-store'
import { useProgressStore } from '@/store/progress-store'
import { calculateSessionStats } from '@/lib/utils/quiz-engine'
import Link from 'next/link'
import type { KanaType } from '@/types/kana'

interface QuizResultsProps {
  kanaType?: KanaType
  overviewHref?: string
}

export function QuizResults({
  kanaType = 'hiragana',
  overviewHref = '/hiragana',
}: QuizResultsProps) {
  const questions = useQuizStore((s) => s.questions)
  const answers = useQuizStore((s) => s.answers)
  const stats = useMemo(() => calculateSessionStats(answers, questions), [answers, questions])
  const restartSession = useQuizStore((s) => s.restartSession)
  const practiceMissed = useQuizStore((s) => s.practiceMissed)
  const resetToSetup = useQuizStore((s) => s.resetToSetup)
  const submitQuizResults = useProgressStore((s) => s.submitQuizResults)
  const [progressSaved, setProgressSaved] = useState<boolean | null>(null)

  useEffect(() => {
    if (answers.length === 0) return

    const progressAnswers = answers.map((answer, index) => ({
      character: questions[index].character.character,
      isCorrect: answer.isCorrect,
    }))

    submitQuizResults(progressAnswers, kanaType)
      .then(() => setProgressSaved(true))
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
        <p className={cn('mt-1 text-2xl font-semibold', accuracyColor)}>
          {stats.accuracy}%
        </p>
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

      {/* Missed characters */}
      {stats.missedCharacters.length > 0 && (
        <section>
          <h3 className="mb-3 text-lg font-semibold text-foreground">Characters to Review</h3>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {stats.missedCharacters.map((char) => (
              <Card key={char.character} className="border-red-200 dark:border-red-800">
                <CardContent className="flex items-center gap-3 py-3">
                  <span className="text-2xl font-medium">{char.character}</span>
                  <span className="text-sm text-muted-foreground">{char.romaji}</span>
                  <AudioPlayButton text={char.character} size="sm" className="ml-auto" />
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* Actions */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <Button onClick={restartSession}>Practice Again</Button>
        {stats.missedCharacters.length > 0 && (
          <Button variant="outline" onClick={practiceMissed}>
            Practice Missed ({stats.missedCharacters.length})
          </Button>
        )}
        <Button variant="ghost" onClick={resetToSetup}>
          Change Settings
        </Button>
        <Link href={overviewHref}>
          <Button variant="ghost" className="w-full sm:w-auto">View Progress</Button>
        </Link>
      </div>
    </div>
  )
}
