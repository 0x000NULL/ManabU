'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils/cn'
import { useProgressStore } from '@/store/progress-store'
import type { KanaType } from '@/types/kana'

interface ProgressOverviewProps {
  kanaType?: KanaType
  practiceHref?: string
}

export function ProgressOverview({
  kanaType = 'hiragana',
  practiceHref = '/hiragana/practice',
}: ProgressOverviewProps) {
  const progress = useProgressStore((s) => s[kanaType])
  const isLoading = useProgressStore((s) => s.isLoading)
  const fetchProgress = useProgressStore((s) =>
    kanaType === 'katakana' ? s.fetchKatakanaProgress : s.fetchHiraganaProgress,
  )

  useEffect(() => {
    fetchProgress()
  }, [fetchProgress])

  if (isLoading && !progress) {
    return (
      <div className="animate-pulse rounded-lg border border-border bg-background p-5">
        <div className="h-4 w-1/3 rounded bg-muted" />
        <div className="mt-3 h-2 w-full rounded bg-muted" />
        <div className="mt-3 flex gap-4">
          <div className="h-3 w-16 rounded bg-muted" />
          <div className="h-3 w-16 rounded bg-muted" />
          <div className="h-3 w-16 rounded bg-muted" />
        </div>
      </div>
    )
  }

  if (!progress) return null

  const { totalCharacters, learnedCount, completionPercent, dueCount } = progress

  // Don't show if user hasn't started yet
  if (learnedCount === 0) return null

  const barPercent = Math.min(100, completionPercent)

  return (
    <div className="rounded-lg border border-border bg-background p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-foreground">Your Progress</h2>
        <span className="text-sm text-muted-foreground">
          {learnedCount} of {totalCharacters} characters
        </span>
      </div>

      {/* Progress bar */}
      <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-primary transition-all duration-500"
          style={{ width: `${barPercent}%` }}
        />
      </div>

      {/* Status counts */}
      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs">
        {progress.masteredCount > 0 && (
          <span className="text-green-600 dark:text-green-400">
            {progress.masteredCount} mastered
          </span>
        )}
        {progress.reviewingCount > 0 && (
          <span className="text-blue-600 dark:text-blue-400">
            {progress.reviewingCount} reviewing
          </span>
        )}
        {progress.learningCount > 0 && (
          <span className="text-amber-600 dark:text-amber-400">
            {progress.learningCount} learning
          </span>
        )}
        {progress.overallAccuracy > 0 && (
          <span
            className={cn(
              progress.overallAccuracy >= 80
                ? 'text-green-600 dark:text-green-400'
                : 'text-muted-foreground',
            )}
          >
            {progress.overallAccuracy}% accuracy
          </span>
        )}
      </div>

      {/* Due reviews CTA */}
      {dueCount > 0 && (
        <Link href={practiceHref}>
          <div className="mt-3 rounded-md bg-primary/10 px-3 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary/20">
            {dueCount} review{dueCount !== 1 ? 's' : ''} due — Review Now
          </div>
        </Link>
      )}
    </div>
  )
}

interface GroupProgressBadgeProps {
  groupId: string
  totalCharacters: number
  kanaType?: KanaType
}

export function GroupProgressBadge({
  groupId,
  totalCharacters,
  kanaType = 'hiragana',
}: GroupProgressBadgeProps) {
  const progressData = useProgressStore((s) => s[kanaType])

  if (!progressData) return null

  const groupChars = progressData.characters.filter((c) => c.group === groupId)
  const learnedInGroup = groupChars.filter((c) => c.status !== 'new').length

  if (learnedInGroup === 0) return null

  const allMastered = learnedInGroup === totalCharacters
    && groupChars.every((c) => c.status === 'mastered')

  return (
    <span
      className={cn(
        'rounded-full px-2 py-0.5 text-[10px] font-medium',
        allMastered
          ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
          : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
      )}
    >
      {learnedInGroup}/{totalCharacters}
    </span>
  )
}
