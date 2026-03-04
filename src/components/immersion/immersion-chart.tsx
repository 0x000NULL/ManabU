'use client'

import { Card, CardContent } from '@/components/ui/card'
import type { WeeklyImmersionEntry } from '@/types/media'

interface ImmersionChartProps {
  data: WeeklyImmersionEntry[]
}

function formatWeekLabel(weekStart: string): string {
  const d = new Date(weekStart + 'T00:00:00')
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
}

export function ImmersionChart({ data }: ImmersionChartProps) {
  if (data.length === 0) {
    return (
      <Card>
        <CardContent className="pt-4">
          <h3 className="mb-3 text-sm font-medium text-foreground">Weekly Immersion</h3>
          <p className="py-6 text-center text-sm text-muted-foreground">
            Start watching content to see your weekly immersion here.
          </p>
        </CardContent>
      </Card>
    )
  }

  const maxMinutes = Math.max(...data.map((d) => d.minutes), 1)

  return (
    <Card>
      <CardContent className="pt-4">
        <h3 className="mb-4 text-sm font-medium text-foreground">Weekly Immersion</h3>
        <div className="flex items-end gap-2" style={{ height: '120px' }}>
          {data.map((entry) => {
            const heightPercent = (entry.minutes / maxMinutes) * 100
            return (
              <div key={entry.weekStart} className="flex flex-1 flex-col items-center gap-1">
                <span className="text-xs text-muted-foreground">{entry.minutes}</span>
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
