'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils/cn'
import { HIRAGANA_GROUPS } from '@/lib/constants/hiragana-groups'
import type { KanaCharacter, KanaGroup } from '@/types/kana'

interface LessonNavigationProps {
  currentIndex: number
  totalCount: number
  onPrevious: () => void
  onNext: () => void
  characters: KanaCharacter[]
  currentGroupId: string
  className?: string
  routePrefix?: string
  groups?: KanaGroup[]
}

export function LessonNavigation({
  currentIndex,
  totalCount,
  onPrevious,
  onNext,
  characters,
  currentGroupId,
  className,
  routePrefix = '/hiragana',
  groups = HIRAGANA_GROUPS,
}: LessonNavigationProps) {
  const isFirst = currentIndex === 0
  const isLast = currentIndex === totalCount - 1
  const prevChar = isFirst ? null : characters[currentIndex - 1]
  const nextChar = isLast ? null : characters[currentIndex + 1]

  const sortedGroups = [...groups].sort((a, b) => a.display_order - b.display_order)
  const currentGroupIndex = sortedGroups.findIndex(g => g.id === currentGroupId)
  const nextGroup = currentGroupIndex < sortedGroups.length - 1 ? sortedGroups[currentGroupIndex + 1] : null

  return (
    <div className={cn('flex items-center justify-between', className)}>
      <Button
        variant="outline"
        size="sm"
        onClick={onPrevious}
        disabled={isFirst}
        className="min-w-[100px]"
      >
        <svg className="mr-1.5 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        {prevChar ? (
          <span>
            {prevChar.character} <span className="text-muted-foreground">{prevChar.romaji}</span>
          </span>
        ) : (
          'Previous'
        )}
      </Button>

      <span className="text-sm text-muted-foreground">
        {currentIndex + 1} of {totalCount}
      </span>

      {isLast ? (
        nextGroup ? (
          <Link href={`${routePrefix}/${nextGroup.id}`}>
            <Button variant="outline" size="sm" className="min-w-[100px]">
              {nextGroup.name}
              <svg className="ml-1.5 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Button>
          </Link>
        ) : (
          <Link href={routePrefix}>
            <Button variant="outline" size="sm" className="min-w-[100px]">
              Overview
              <svg className="ml-1.5 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Button>
          </Link>
        )
      ) : (
        <Button variant="outline" size="sm" onClick={onNext} className="min-w-[100px]">
          {nextChar ? (
            <span>
              {nextChar.character} <span className="text-muted-foreground">{nextChar.romaji}</span>
            </span>
          ) : (
            'Next'
          )}
          <svg className="ml-1.5 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Button>
      )}
    </div>
  )
}
