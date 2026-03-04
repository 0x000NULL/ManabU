'use client'

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import type { LearningPathProgressResponse } from '@/types/learning-path'

export function LearningPathProgress({ onUnauthorized }: { onUnauthorized: () => void }) {
  const [data, setData] = useState<LearningPathProgressResponse | null>(null)
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    try {
      const res = await fetch('/api/v1/learning-path/progress')
      if (res.status === 401) {
        onUnauthorized()
        return
      }
      if (!res.ok) {
        setLoading(false)
        return
      }
      const json = await res.json()
      if (json?.data) setData(json.data)
    } catch {
      // Non-critical; silently fail
    } finally {
      setLoading(false)
    }
  }, [onUnauthorized])

  useEffect(() => {
    load()
  }, [load])

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <LoadingSpinner size="sm" className="text-muted-foreground" />
        </CardContent>
      </Card>
    )
  }

  if (!data) return null

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>{data.pathName}</CardTitle>
          <p className="mt-1 text-sm text-muted-foreground">{data.jlptLevel} Level</p>
        </div>
        <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-semibold text-primary">
          {data.overallPercent}%
        </span>
      </CardHeader>

      <CardContent className="space-y-5">
        {/* Current milestone */}
        {data.currentMilestone && (
          <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">
                  {data.currentMilestone.title}
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {data.currentMilestone.description}
                </p>
              </div>
              {data.currentMilestone.percent >= 100 ? (
                <span className="flex items-center gap-1.5 animate-in fade-in zoom-in duration-500">
                  <svg
                    className="h-5 w-5 text-emerald-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                    Milestone complete!
                  </span>
                </span>
              ) : (
                <span className="text-sm font-semibold text-primary">
                  {data.currentMilestone.percent}%
                </span>
              )}
            </div>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted">
              <div
                className={`h-full rounded-full transition-all ${data.currentMilestone.percent >= 100 ? 'bg-emerald-500' : 'bg-primary'}`}
                style={{ width: `${Math.min(data.currentMilestone.percent, 100)}%` }}
              />
            </div>
            <p className="mt-1.5 text-xs text-muted-foreground">
              {data.currentMilestone.currentCount} / {data.currentMilestone.targetCount}
            </p>
          </div>
        )}

        {/* Section progress bars */}
        <div className="space-y-3">
          {data.sections.map((section) => (
            <div key={section.key}>
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-foreground">{section.label}</span>
                <span className="text-xs text-muted-foreground">
                  {section.currentCount}/{section.targetCount}
                </span>
              </div>
              <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-muted">
                <div
                  className={`h-full rounded-full transition-all ${section.colorClass}`}
                  style={{ width: `${section.percent}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Next milestone + time estimate */}
        {data.nextMilestone && (
          <div className="border-t border-border pt-3">
            <p className="text-xs text-muted-foreground">
              Next: <span className="font-medium text-foreground">{data.nextMilestone.title}</span>
              {data.estimatedDaysRemaining != null && (
                <span>
                  {' '}
                  &middot; ~{data.estimatedDaysRemaining} day
                  {data.estimatedDaysRemaining !== 1 ? 's' : ''} at current pace
                </span>
              )}
            </p>
          </div>
        )}

        <Link
          href="/learning-path"
          className="inline-block text-xs font-medium text-primary hover:underline"
        >
          View full learning path &rarr;
        </Link>
      </CardContent>
    </Card>
  )
}
