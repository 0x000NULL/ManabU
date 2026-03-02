'use client'

import { useCallback, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils/cn'
import type { GrammarPatternListItem } from '@/types/grammar'

interface GrammarNavigationProps {
  currentId: string
  patterns: GrammarPatternListItem[]
  className?: string
}

export function GrammarNavigation({ currentId, patterns, className }: GrammarNavigationProps) {
  const router = useRouter()

  const currentIndex = patterns.findIndex((p) => p.id === currentId)
  const prev = currentIndex > 0 ? patterns[currentIndex - 1] : null
  const next = currentIndex < patterns.length - 1 ? patterns[currentIndex + 1] : null

  const goToPrev = useCallback(() => {
    if (prev) router.push(`/grammar/${prev.id}`)
  }, [prev, router])

  const goToNext = useCallback(() => {
    if (next) router.push(`/grammar/${next.id}`)
    else router.push('/grammar')
  }, [next, router])

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return
      if (e.key === 'ArrowLeft') goToPrev()
      if (e.key === 'ArrowRight') goToNext()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [goToPrev, goToNext])

  if (currentIndex === -1) return null

  return (
    <nav className={cn('flex items-center justify-between gap-4', className)}>
      {prev ? (
        <Link
          href={`/grammar/${prev.id}`}
          className="flex min-w-0 items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <svg className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span className="truncate">{prev.pattern}</span>
        </Link>
      ) : (
        <div />
      )}

      <span className="shrink-0 text-xs text-muted-foreground">
        {currentIndex + 1} of {patterns.length}
      </span>

      {next ? (
        <Link
          href={`/grammar/${next.id}`}
          className="flex min-w-0 items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <span className="truncate">{next.pattern}</span>
          <svg className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      ) : (
        <Link
          href="/grammar"
          className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <span>Back to Overview</span>
          <svg className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      )}
    </nav>
  )
}
