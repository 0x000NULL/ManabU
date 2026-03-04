'use client'

import { useCallback, useEffect, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { StudyHeatmap } from '@/components/dashboard/study-heatmap'
import type { StreakResponse } from '@/types/streak'

export function StreakDisplay({ onUnauthorized }: { onUnauthorized: () => void }) {
  const [data, setData] = useState<StreakResponse | null>(null)
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    try {
      const res = await fetch('/api/v1/user/streak')
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
      // Streak is non-critical; silently fail
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

  const todayItems = data.todayActivity.itemsReviewed + data.todayActivity.itemsLearned

  return (
    <Card>
      <CardContent className="py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <svg
              className="h-5 w-5 text-muted-foreground"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            <div>
              <span className="text-lg font-semibold text-foreground">
                {data.currentStreak} day{data.currentStreak !== 1 ? 's' : ''} active
              </span>
              {todayItems > 0 && (
                <span className="ml-2 text-sm text-muted-foreground">
                  {todayItems} item{todayItems !== 1 ? 's' : ''} today
                </span>
              )}
            </div>
          </div>
          {data.longestStreak > data.currentStreak && (
            <span className="text-sm text-muted-foreground">Best: {data.longestStreak}d</span>
          )}
        </div>
        <div className="mt-3 border-t border-border pt-3">
          <StudyHeatmap heatmap={data.heatmap} />
        </div>
      </CardContent>
    </Card>
  )
}
