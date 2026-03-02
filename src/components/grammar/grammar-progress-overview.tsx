'use client'

import { useGrammarStore } from '@/store/grammar-store'

export function GrammarProgressOverview() {
  const progress = useGrammarStore((s) => s.progress)

  if (!progress || progress.total === 0) return null

  const percent = Math.round((progress.learned / progress.total) * 100)

  return (
    <div className="rounded-lg border border-border bg-background p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-foreground">
          {progress.learned} of {progress.total} patterns studied
        </p>
        {progress.mastered > 0 && (
          <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700 dark:bg-green-900/30 dark:text-green-400">
            {progress.mastered} mastered
          </span>
        )}
      </div>
      <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-primary transition-all"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  )
}
