'use client'

import { useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { useGrammarStore } from '@/store/grammar-store'
import { GrammarPatternDetail } from '@/components/grammar/grammar-pattern-detail'
import { GrammarNavigation } from '@/components/grammar/grammar-navigation'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { cn } from '@/lib/utils/cn'

const difficultyColors: Record<string, string> = {
  beginner: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  intermediate: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  advanced: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
}

export default function GrammarDetailPage() {
  const params = useParams<{ id: string }>()
  const {
    currentPattern,
    isDetailLoading,
    patterns,
    fetchPatternDetail,
    fetchPatterns,
  } = useGrammarStore()

  useEffect(() => {
    fetchPatternDetail(params.id)
    fetchPatterns()
  }, [params.id, fetchPatternDetail, fetchPatterns])

  if (isDetailLoading || !currentPattern) {
    return (
      <div className="flex items-center justify-center py-20">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start gap-3">
        <Link
          href="/grammar"
          className="mt-1 text-muted-foreground transition-colors hover:text-foreground"
          aria-label="Back to grammar overview"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-foreground">{currentPattern.pattern}</h1>
          <p className="mt-1 text-muted-foreground">{currentPattern.meaning}</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {currentPattern.difficulty && (
              <span
                className={cn(
                  'rounded-full px-2 py-0.5 text-xs font-medium',
                  difficultyColors[currentPattern.difficulty] ?? '',
                )}
              >
                {currentPattern.difficulty}
              </span>
            )}
            {currentPattern.jlpt_level && (
              <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                {currentPattern.jlpt_level}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Detail content */}
      <GrammarPatternDetail pattern={currentPattern} />

      {/* Navigation */}
      {patterns.length > 0 && (
        <GrammarNavigation
          currentId={params.id}
          patterns={patterns}
          className="border-t border-border pt-4"
        />
      )}
    </div>
  )
}
