'use client'

import Link from 'next/link'
import { cn } from '@/lib/utils/cn'
import type { GrammarPatternListItem } from '@/types/grammar'

const difficultyColors: Record<string, string> = {
  beginner: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  intermediate: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  advanced: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
}

interface GrammarPatternCardProps {
  pattern: GrammarPatternListItem
}

export function GrammarPatternCard({ pattern }: GrammarPatternCardProps) {
  return (
    <Link href={`/grammar/${pattern.id}`}>
      <div className="rounded-lg border border-border bg-background p-4 shadow-sm transition-shadow hover:shadow-md">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-xl font-bold text-foreground">{pattern.pattern}</h3>
          {pattern.difficulty && (
            <span
              className={cn(
                'shrink-0 rounded-full px-2 py-0.5 text-xs font-medium',
                difficultyColors[pattern.difficulty] ?? '',
              )}
            >
              {pattern.difficulty}
            </span>
          )}
        </div>
        <p className="mt-1 truncate text-sm text-foreground/80">{pattern.meaning}</p>
        <p className="mt-1 truncate text-xs text-muted-foreground">{pattern.formation}</p>
      </div>
    </Link>
  )
}
