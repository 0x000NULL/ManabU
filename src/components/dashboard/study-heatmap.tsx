'use client'

import type { HeatmapDay } from '@/types/streak'

function getIntensity(items: number): string {
  if (items === 0) return 'bg-muted'
  if (items <= 10) return 'bg-primary/20'
  if (items <= 30) return 'bg-primary/40'
  if (items <= 60) return 'bg-primary/60'
  return 'bg-primary/80'
}

export function StudyHeatmap({ heatmap }: { heatmap: HeatmapDay[] }) {
  return (
    <div>
      <div
        className="grid gap-[3px]"
        style={{
          gridTemplateRows: 'repeat(7, 1fr)',
          gridAutoFlow: 'column',
        }}
      >
        {heatmap.map((day) => {
          const total = day.itemsReviewed + day.itemsLearned
          return (
            <div
              key={day.date}
              className={`h-3 w-3 rounded-sm ${getIntensity(total)}`}
              title={`${day.date}: ${total} item${total !== 1 ? 's' : ''}`}
            />
          )
        })}
      </div>
      <div className="mt-2 flex items-center justify-end gap-1 text-xs text-muted-foreground">
        <span>Less</span>
        <div className="h-3 w-3 rounded-sm bg-muted" />
        <div className="h-3 w-3 rounded-sm bg-primary/20" />
        <div className="h-3 w-3 rounded-sm bg-primary/40" />
        <div className="h-3 w-3 rounded-sm bg-primary/60" />
        <div className="h-3 w-3 rounded-sm bg-primary/80" />
        <span>More</span>
      </div>
    </div>
  )
}
