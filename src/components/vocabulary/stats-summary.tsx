'use client'

import { Card, CardContent } from '@/components/ui/card'
import type { VocabularyExtendedStats } from '@/types/learn'

interface StatsSummaryProps {
  stats: VocabularyExtendedStats
}

interface StatItem {
  label: string
  value: string | number
}

export function StatsSummary({ stats }: StatsSummaryProps) {
  const items: StatItem[] = [
    { label: 'Total Learned', value: stats.totalLearned },
    { label: 'Mastered', value: stats.masteredCount },
    { label: 'Due for Review', value: stats.dueCount },
    { label: 'Retention Rate', value: `${stats.retentionRate}%` },
    { label: 'Learned Today', value: stats.learnedToday },
    { label: 'Reviewed Today', value: stats.reviewedToday },
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
