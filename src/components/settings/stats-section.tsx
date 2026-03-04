'use client'

import { useEffect, useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import type { DashboardStatsResponse } from '@/types/dashboard'

function StatItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-muted p-3">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="text-lg font-semibold text-foreground">{value}</p>
    </div>
  )
}

export function StatsSection() {
  const [stats, setStats] = useState<DashboardStatsResponse | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/v1/user/stats/dashboard')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.success) setStats(data.data)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Lifetime Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Loading stats...</p>
        </CardContent>
      </Card>
    )
  }

  if (!stats) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Lifetime Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Unable to load statistics.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Lifetime Statistics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          <StatItem label="Hiragana" value={`${stats.kana.hiraganaPercent}%`} />
          <StatItem label="Katakana" value={`${stats.kana.katakanaPercent}%`} />
          <StatItem label="Vocabulary Learned" value={String(stats.srs.totalLearned)} />
          <StatItem label="Vocabulary Mastered" value={String(stats.srs.totalMastered)} />
          <StatItem label="Retention Rate" value={`${stats.srs.retentionRate}%`} />
          <StatItem label="Grammar Patterns" value={String(stats.grammar.patternsLearned)} />
          <StatItem label="Grammar Accuracy" value={`${stats.grammar.practiceAccuracy}%`} />
          <StatItem
            label="Study Time (This Week)"
            value={`${stats.studyTime.thisWeekMinutes} min`}
          />
          <StatItem
            label="Study Time (This Month)"
            value={`${stats.studyTime.thisMonthMinutes} min`}
          />
        </div>
      </CardContent>
    </Card>
  )
}
