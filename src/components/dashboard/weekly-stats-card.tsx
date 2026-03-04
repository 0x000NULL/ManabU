'use client'

import { useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { useDashboardStore } from '@/store/dashboard-store'

function formatMinutes(m: number): string {
  if (m < 60) return `${m}m`
  const h = Math.floor(m / 60)
  const rem = m % 60
  return rem > 0 ? `${h}h ${rem}m` : `${h}h`
}

function ComparisonBadge({ current, previous }: { current: number; previous: number }) {
  const diff = current - previous
  if (diff === 0) return <span className="text-xs text-muted-foreground">same as last week</span>

  const isPositive = diff > 0
  return (
    <span
      className={`text-xs font-medium ${isPositive ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}`}
    >
      {isPositive ? '+' : ''}
      {diff} vs last week
    </span>
  )
}

function formatWeekLabel(weekStart: string): string {
  const d = new Date(weekStart + 'T00:00:00')
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
}

export function WeeklyStatsCard({ onUnauthorized }: { onUnauthorized: () => void }) {
  const stats = useDashboardStore((s) => s.stats)
  const isLoading = useDashboardStore((s) => s.isLoading)
  const error = useDashboardStore((s) => s.error)
  const fetchStats = useDashboardStore((s) => s.fetchStats)

  useEffect(() => {
    fetchStats()
  }, [fetchStats])

  useEffect(() => {
    if (error === 'unauthorized') onUnauthorized()
  }, [error, onUnauthorized])

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <LoadingSpinner size="sm" className="text-muted-foreground" />
        </CardContent>
      </Card>
    )
  }

  if (!stats) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Weekly Stats</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="py-4 text-center text-sm text-muted-foreground">
            Start studying to see your weekly stats here.
          </p>
        </CardContent>
      </Card>
    )
  }

  const maxVelocity = Math.max(...stats.weeklyVelocity.map((w) => w.itemsLearned + w.itemsReviewed), 1)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Weekly Stats</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        {/* Summary tiles */}
        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-lg bg-muted/50 p-3">
            <p className="text-xs text-muted-foreground">Items Learned</p>
            <p className="mt-1 text-lg font-semibold text-foreground">
              {stats.items.learnedThisWeek}
            </p>
            <ComparisonBadge
              current={stats.items.learnedThisWeek}
              previous={stats.items.learnedLastWeek}
            />
          </div>
          <div className="rounded-lg bg-muted/50 p-3">
            <p className="text-xs text-muted-foreground">Study Time</p>
            <p className="mt-1 text-lg font-semibold text-foreground">
              {formatMinutes(stats.studyTime.thisWeekMinutes)}
            </p>
            <ComparisonBadge
              current={stats.studyTime.thisWeekMinutes}
              previous={stats.studyTime.lastWeekMinutes}
            />
          </div>
          <div className="rounded-lg bg-muted/50 p-3">
            <p className="text-xs text-muted-foreground">Retention</p>
            <p className="mt-1 text-lg font-semibold text-foreground">{stats.srs.retentionRate}%</p>
            <span className="text-xs text-muted-foreground">cumulative</span>
          </div>
        </div>

        {/* Bar chart */}
        <div>
          <h4 className="mb-3 text-sm font-medium text-foreground">Weekly Activity</h4>
          {maxVelocity <= 1 && stats.weeklyVelocity.every((w) => w.itemsLearned + w.itemsReviewed === 0) ? (
            <p className="py-4 text-center text-sm text-muted-foreground">
              No activity data yet.
            </p>
          ) : (
            <div className="flex items-end gap-2" style={{ height: '120px' }}>
              {stats.weeklyVelocity.map((entry) => {
                const total = entry.itemsLearned + entry.itemsReviewed
                const heightPercent = (total / maxVelocity) * 100
                return (
                  <div key={entry.weekStart} className="flex flex-1 flex-col items-center gap-1">
                    <span className="text-xs text-muted-foreground">{total}</span>
                    <div
                      className="w-full rounded-t bg-primary/80 transition-all"
                      style={{ height: `${Math.max(heightPercent, 4)}%` }}
                    />
                    <span className="text-[10px] text-muted-foreground">
                      {formatWeekLabel(entry.weekStart)}
                    </span>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
