'use client'

import { Card, CardContent } from '@/components/ui/card'
import type { WeeklyLearningEntry } from '@/types/learn'

interface LearningVelocityChartProps {
  data: WeeklyLearningEntry[]
}

function formatWeekLabel(weekStart: string): string {
  const d = new Date(weekStart + 'T00:00:00')
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
}

export function LearningVelocityChart({ data }: LearningVelocityChartProps) {
  if (data.length === 0) {
    return (
      <Card>
        <CardContent className="pt-4">
          <h3 className="mb-3 text-sm font-medium text-foreground">Weekly Learning</h3>
          <p className="py-6 text-center text-sm text-muted-foreground">
            Start learning words to see your weekly progress here.
          </p>
        </CardContent>
      </Card>
    )
  }

  const maxCount = Math.max(...data.map((d) => d.count), 1)

  return (
    <Card>
      <CardContent className="pt-4">
        <h3 className="mb-4 text-sm font-medium text-foreground">Weekly Learning</h3>
        <div className="flex items-end gap-2" style={{ height: '120px' }}>
          {data.map((entry) => {
            const heightPercent = (entry.count / maxCount) * 100
            return (
              <div key={entry.weekStart} className="flex flex-1 flex-col items-center gap-1">
                <span className="text-xs text-muted-foreground">{entry.count}</span>
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
      </CardContent>
    </Card>
  )
}
