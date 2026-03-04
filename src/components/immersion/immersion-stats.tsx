'use client'

import { Card, CardContent } from '@/components/ui/card'
import type { ImmersionStats } from '@/types/media'

interface ImmersionStatsProps {
  stats: ImmersionStats
}

interface StatItem {
  label: string
  value: string | number
}

function formatImmersionTime(minutes: number): string {
  if (minutes < 60) return `${minutes}m`
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return m > 0 ? `${h}h ${m}m` : `${h}h`
}

export function ImmersionStatsDisplay({ stats }: ImmersionStatsProps) {
  const items: StatItem[] = [
    { label: 'Episodes Watched', value: stats.episodesWatched },
    { label: 'Completed', value: stats.episodesCompleted },
    { label: 'Immersion Time', value: formatImmersionTime(stats.totalImmersionMinutes) },
    { label: 'Sentences Mined', value: stats.sentencesMined },
    { label: 'Due for Review', value: stats.sentencesDueCount },
  ]

  return (
    <Card>
      <CardContent className="pt-2">
        <div className="grid grid-cols-2 gap-4 text-center sm:grid-cols-3">
          {items.map((item) => (
            <div key={item.label}>
              <p className="text-2xl font-bold text-foreground">{item.value}</p>
              <p className="text-xs text-muted-foreground">{item.label}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
