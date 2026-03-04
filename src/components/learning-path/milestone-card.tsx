'use client'

import Link from 'next/link'
import { cn } from '@/lib/utils/cn'
import type { MilestoneProgress } from '@/types/learning-path'

const CATEGORY_BADGES: Record<string, { label: string; className: string }> = {
  hiragana: { label: 'Hiragana', className: 'bg-amber-100 text-amber-800' },
  katakana: { label: 'Katakana', className: 'bg-amber-100 text-amber-800' },
  vocabulary: { label: 'Vocabulary', className: 'bg-blue-100 text-blue-800' },
  grammar: { label: 'Grammar', className: 'bg-purple-100 text-purple-800' },
  kanji: { label: 'Kanji', className: 'bg-rose-100 text-rose-800' },
  reading: { label: 'Reading', className: 'bg-green-100 text-green-800' },
}

const PROGRESS_COLORS: Record<string, string> = {
  hiragana: 'bg-amber-500',
  katakana: 'bg-amber-500',
  vocabulary: 'bg-blue-500',
  grammar: 'bg-purple-500',
  kanji: 'bg-rose-500',
  reading: 'bg-green-500',
}

interface MilestoneCardProps {
  milestone: MilestoneProgress
  isFirst: boolean
  isLast: boolean
}

export function MilestoneCard({ milestone, isFirst, isLast }: MilestoneCardProps) {
  const badge = CATEGORY_BADGES[milestone.category]
  const progressColor = PROGRESS_COLORS[milestone.category] ?? 'bg-gray-500'
  const isCompleted = milestone.status === 'completed'
  const isLocked = milestone.status === 'locked'

  return (
    <div className="relative flex gap-4">
      {/* Timeline line + circle */}
      <div className="flex flex-col items-center">
        {/* Top connector */}
        <div className={cn('w-0.5 flex-1', isFirst ? 'bg-transparent' : 'bg-border')} />

        {/* Status circle */}
        <div
          className={cn(
            'flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2',
            isCompleted && 'border-green-500 bg-green-500 text-white',
            !isCompleted && !isLocked && 'border-primary bg-primary/10 text-primary',
            isLocked && 'border-muted bg-muted text-muted-foreground',
          )}
        >
          {isCompleted && (
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          )}
          {!isCompleted && !isLocked && (
            <div className="h-2.5 w-2.5 rounded-full bg-primary" />
          )}
          {isLocked && (
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          )}
        </div>

        {/* Bottom connector */}
        <div className={cn('w-0.5 flex-1', isLast ? 'bg-transparent' : 'bg-border')} />
      </div>

      {/* Card content */}
      <div
        className={cn(
          'mb-4 flex-1 rounded-lg border p-4',
          isCompleted && 'border-green-200 bg-green-50/50',
          !isCompleted && !isLocked && 'border-border bg-card',
          isLocked && 'border-muted bg-muted/30 opacity-60',
        )}
      >
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h3 className="font-medium text-foreground">{milestone.title}</h3>
              {badge && (
                <span
                  className={cn('rounded-full px-2 py-0.5 text-xs font-medium', badge.className)}
                >
                  {badge.label}
                </span>
              )}
            </div>
            <p className="mt-1 text-sm text-muted-foreground">{milestone.description}</p>
          </div>

          {!isLocked && (
            <span
              className={cn(
                'shrink-0 text-sm font-semibold',
                isCompleted ? 'text-green-600' : 'text-foreground',
              )}
            >
              {milestone.percent}%
            </span>
          )}
        </div>

        {/* Progress bar */}
        {!isLocked && (
          <div className="mt-3">
            <div className="h-2 overflow-hidden rounded-full bg-muted">
              <div
                className={cn('h-full rounded-full transition-all', progressColor)}
                style={{ width: `${milestone.percent}%` }}
              />
            </div>
            <div className="mt-1.5 flex items-center justify-between">
              <p className="text-xs text-muted-foreground">
                {milestone.currentCount} / {milestone.targetCount}
              </p>
              {milestone.linkHref && (
                <Link
                  href={milestone.linkHref}
                  className="text-xs font-medium text-primary hover:underline"
                >
                  {isCompleted ? 'Review' : 'Continue'} &rarr;
                </Link>
              )}
            </div>
          </div>
        )}

        {isLocked && (
          <p className="mt-2 text-xs text-muted-foreground">Coming soon</p>
        )}
      </div>
    </div>
  )
}
