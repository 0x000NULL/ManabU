'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { useLearnStore } from '@/store/learn-store'

export function LearnCompletion() {
  const wordsLearned = useLearnStore((s) => s.learnedIds.size)
  const dailyTotal = useLearnStore((s) => s.learnedToday)
  const dailyLimit = useLearnStore((s) => s.dailyLimit)
  const startSession = useLearnStore((s) => s.startSession)

  const hasCapacity = dailyTotal < dailyLimit

  return (
    <div className="space-y-8">
      <div className="text-center">
        <svg
          className="mx-auto h-16 w-16 text-primary"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <h2 className="mt-4 text-2xl font-bold text-foreground">Session Complete</h2>
        <p className="mt-2 text-4xl font-bold text-primary">{wordsLearned}</p>
        <p className="text-sm text-muted-foreground">
          {wordsLearned === 1 ? 'word' : 'words'} learned
        </p>
      </div>

      <div className="mx-auto max-w-xs space-y-1.5">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Daily progress</span>
          <span className="font-medium text-foreground">
            {dailyTotal} / {dailyLimit}
          </span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-green-500 transition-all duration-300"
            style={{
              width: `${Math.min((dailyTotal / dailyLimit) * 100, 100)}%`,
            }}
          />
        </div>
      </div>

      <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
        {hasCapacity && <Button onClick={startSession}>Learn More</Button>}
        <Link href="/vocabulary/review">
          <Button variant={hasCapacity ? 'outline' : 'primary'}>Review Words</Button>
        </Link>
        <Link href="/vocabulary">
          <Button variant="ghost">Back to Vocabulary</Button>
        </Link>
      </div>
    </div>
  )
}
