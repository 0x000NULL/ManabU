'use client'

import { useMemo } from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils/cn'
import { Button } from '@/components/ui/button'
import { useMinedSentenceReviewStore } from '@/store/mined-sentence-review-store'

const ratingDisplay = [
  { key: 'againCount' as const, label: 'Again', color: 'text-red-600 dark:text-red-400' },
  { key: 'hardCount' as const, label: 'Hard', color: 'text-orange-600 dark:text-orange-400' },
  { key: 'goodCount' as const, label: 'Good', color: 'text-green-600 dark:text-green-400' },
  { key: 'easyCount' as const, label: 'Easy', color: 'text-blue-600 dark:text-blue-400' },
]

export function MinedSentenceReviewCompletion() {
  const answers = useMinedSentenceReviewStore((s) => s.answers)
  const totalDueAtStart = useMinedSentenceReviewStore((s) => s.totalDueAtStart)
  const queueLength = useMinedSentenceReviewStore((s) => s.queue.length)
  const startSession = useMinedSentenceReviewStore((s) => s.startSession)

  const stats = useMemo(
    () => ({
      totalReviewed: answers.length,
      againCount: answers.filter((a) => a.rating === 'again').length,
      hardCount: answers.filter((a) => a.rating === 'hard').length,
      goodCount: answers.filter((a) => a.rating === 'good').length,
      easyCount: answers.filter((a) => a.rating === 'easy').length,
      totalDueAtStart,
    }),
    [answers, totalDueAtStart],
  )

  const remaining = stats.totalDueAtStart - queueLength

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-foreground">Session Complete</h2>
        <p className="mt-2 text-4xl font-bold text-primary">{stats.totalReviewed}</p>
        <p className="text-sm text-muted-foreground">sentences reviewed</p>
      </div>

      <div className="mx-auto grid max-w-xs grid-cols-4 gap-3 text-center">
        {ratingDisplay.map(({ key, label, color }) => (
          <div key={key}>
            <p className={cn('text-2xl font-bold', color)}>{stats[key]}</p>
            <p className="text-xs text-muted-foreground">{label}</p>
          </div>
        ))}
      </div>

      {remaining > 0 && (
        <p className="text-center text-sm text-muted-foreground">
          {remaining} more review{remaining !== 1 ? 's' : ''} remaining
        </p>
      )}

      <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
        {remaining > 0 && <Button onClick={startSession}>Review More</Button>}
        <Link href="/immersion/sentences">
          <Button variant={remaining > 0 ? 'outline' : 'primary'}>Back to Sentences</Button>
        </Link>
        <Link href="/dashboard">
          <Button variant="ghost">Dashboard</Button>
        </Link>
      </div>
    </div>
  )
}
