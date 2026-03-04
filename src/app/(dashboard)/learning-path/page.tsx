'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { MilestoneCard } from '@/components/learning-path/milestone-card'
import { cn } from '@/lib/utils/cn'
import { SECTION_COLORS } from '@/lib/constants/learning-paths'
import type { LearningPathProgressResponse } from '@/types/learning-path'

export default function LearningPathPage() {
  const [data, setData] = useState<LearningPathProgressResponse | null>(null)
  const [error, setError] = useState<string | null>(null)
  const enrolledRef = useRef(false)

  const load = useCallback(async () => {
    try {
      const res = await fetch('/api/v1/learning-paths/n5/progress')
      if (!res.ok) {
        setError('Failed to load learning path')
        return
      }
      const json = await res.json()
      if (json?.data) setData(json.data as LearningPathProgressResponse)
    } catch {
      setError('Network error — please try again')
    }
  }, [])

  // Auto-enroll on first load if not enrolled
  useEffect(() => {
    async function init() {
      await load()
    }
    init()
  }, [load])

  useEffect(() => {
    if (!data || data.isEnrolled || enrolledRef.current) return
    enrolledRef.current = true

    fetch('/api/v1/learning-paths/enroll', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pathSlug: 'n5' }),
    })
      .then(() => load())
      .catch(() => {})
  }, [data, load])

  if (!data && !error) {
    return (
      <div className="flex flex-col items-center gap-3 py-12">
        <LoadingSpinner size="lg" />
        <p className="text-sm text-muted-foreground">Loading learning path...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center gap-4 py-12 text-center">
        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
      </div>
    )
  }

  if (!data) return null

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{data.pathName}</h1>
          <p className="mt-1 text-muted-foreground">
            {data.jlptLevel} Level — {data.milestones.length} milestones
          </p>
        </div>
        <span className="rounded-full bg-primary/10 px-4 py-1.5 text-lg font-semibold text-primary">
          {data.overallPercent}%
        </span>
      </div>

      {/* Overall progress */}
      <Card>
        <CardHeader>
          <CardTitle>Overall Progress</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="h-3 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-primary transition-all"
              style={{ width: `${data.overallPercent}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>
              {data.milestones.filter((m) => m.status === 'completed').length} of{' '}
              {data.milestones.filter((m) => m.status !== 'locked').length} milestones completed
            </span>
            {data.estimatedDaysRemaining != null && (
              <span>
                ~{data.estimatedDaysRemaining} day{data.estimatedDaysRemaining !== 1 ? 's' : ''}{' '}
                remaining at current pace
              </span>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Section progress */}
      <Card>
        <CardHeader>
          <CardTitle>Section Progress</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
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
                  className={cn(
                    'h-full rounded-full transition-all',
                    SECTION_COLORS[section.key] ?? 'bg-gray-500',
                  )}
                  style={{ width: `${section.percent}%` }}
                />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Milestone timeline */}
      <div>
        <h2 className="mb-4 text-lg font-semibold text-foreground">Milestones</h2>
        <div>
          {data.milestones.map((milestone, idx) => (
            <MilestoneCard
              key={milestone.id}
              milestone={milestone}
              isFirst={idx === 0}
              isLast={idx === data.milestones.length - 1}
            />
          ))}
        </div>
      </div>

      {/* Coming soon: N4 and N3 */}
      <div>
        <h2 className="mb-4 text-lg font-semibold text-foreground">Coming Soon</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <Card className="opacity-60">
            <CardContent className="py-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-sm font-bold text-muted-foreground">
                  N4
                </div>
                <div>
                  <h3 className="font-medium text-foreground">JLPT N4 Path</h3>
                  <p className="text-sm text-muted-foreground">
                    Intermediate vocabulary, grammar, and kanji
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="opacity-60">
            <CardContent className="py-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-sm font-bold text-muted-foreground">
                  N3
                </div>
                <div>
                  <h3 className="font-medium text-foreground">JLPT N3 Path</h3>
                  <p className="text-sm text-muted-foreground">
                    Advanced grammar and reading comprehension
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
