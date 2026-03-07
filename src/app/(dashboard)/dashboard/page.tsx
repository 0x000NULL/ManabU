'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuthStore } from '@/store/auth-store'
import { useProgressStore } from '@/store/progress-store'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { WelcomeBanner } from '@/components/dashboard/welcome-banner'
import { DailyLessonCard } from '@/components/dashboard/daily-lesson-card'
import { LearningPathProgress } from '@/components/dashboard/learning-path-progress'
import { StreakDisplay } from '@/components/dashboard/streak-display'
import { WeeklyStatsCard } from '@/components/dashboard/weekly-stats-card'
import { FeatureTour } from '@/components/dashboard/feature-tour'
import { hasImmersionAccess } from '@/lib/utils/immersion-access'
import type { GrammarProgressStats } from '@/types/grammar'

function HiraganaStatus({ onUnauthorized }: { onUnauthorized: () => void }) {
  const hiragana = useProgressStore((s) => s.hiragana)
  const error = useProgressStore((s) => s.error)
  const fetchHiraganaProgress = useProgressStore((s) => s.fetchHiraganaProgress)

  useEffect(() => {
    fetchHiraganaProgress()
  }, [fetchHiraganaProgress])

  useEffect(() => {
    if (error === 'unauthorized') onUnauthorized()
  }, [error, onUnauthorized])

  if (!hiragana || hiragana.learnedCount === 0) {
    return <p className="mt-3 text-xs font-medium text-primary">Start Learning</p>
  }

  if (hiragana.dueCount > 0) {
    return (
      <p className="mt-3 text-xs font-medium text-amber-600 dark:text-amber-400">
        {hiragana.dueCount} review{hiragana.dueCount !== 1 ? 's' : ''} due
      </p>
    )
  }

  return (
    <p className="mt-3 text-xs font-medium text-primary">
      Continue ({hiragana.completionPercent}% complete)
    </p>
  )
}

function KanjiStatus({ onUnauthorized }: { onUnauthorized: () => void }) {
  const [dueCount, setDueCount] = useState<number | null>(null)

  useEffect(() => {
    fetch('/api/v1/srs/stats?category=kanji')
      .then((res) => {
        if (res.status === 401) {
          onUnauthorized()
          return null
        }
        return res.ok ? res.json() : null
      })
      .then((json) => {
        if (json?.data) setDueCount(json.data.dueCount ?? 0)
      })
      .catch(() => {})
  }, [onUnauthorized])

  if (dueCount === null) {
    return <p className="mt-3 text-xs font-medium text-primary">Start Learning</p>
  }

  if (dueCount > 0) {
    return (
      <p className="mt-3 text-xs font-medium text-amber-600 dark:text-amber-400">
        {dueCount} review{dueCount !== 1 ? 's' : ''} due
      </p>
    )
  }

  return <p className="mt-3 text-xs font-medium text-primary">Browse Kanji</p>
}

function GrammarStatus({ onUnauthorized }: { onUnauthorized: () => void }) {
  const [progress, setProgress] = useState<GrammarProgressStats | null>(null)

  useEffect(() => {
    fetch('/api/v1/grammar/progress')
      .then((res) => {
        if (res.status === 401) {
          onUnauthorized()
          return null
        }
        return res.ok ? res.json() : null
      })
      .then((json) => {
        if (json?.data) setProgress(json.data)
      })
      .catch(() => {})
  }, [onUnauthorized])

  if (!progress || progress.learned === 0) {
    return <p className="mt-3 text-xs font-medium text-primary">Start Learning</p>
  }

  return (
    <p className="mt-3 text-xs font-medium text-primary">
      Continue ({progress.learned} pattern{progress.learned !== 1 ? 's' : ''} learned)
    </p>
  )
}

export default function DashboardPage() {
  const { user } = useAuthStore()
  const router = useRouter()
  const redirectingRef = useRef(false)
  const canAccessImmersion = user?.email ? hasImmersionAccess(user.email) : false

  const handleUnauthorized = useCallback(async () => {
    if (redirectingRef.current) return
    redirectingRef.current = true
    await useAuthStore.getState().logout()
    router.push('/login')
  }, [router])

  return (
    <div className="space-y-6">
      <WelcomeBanner />
      <div>
        <h1 className="text-2xl font-bold text-foreground">
          Welcome{user?.displayName ? `, ${user.displayName}` : ''}
        </h1>
        <p className="mt-1 text-muted-foreground">Your Japanese learning journey starts here.</p>
      </div>

      <div data-tooltip-target="streak-display">
        <StreakDisplay onUnauthorized={handleUnauthorized} />
      </div>
      <div data-tooltip-target="daily-lesson">
        <DailyLessonCard onUnauthorized={handleUnauthorized} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div data-tooltip-target="learning-path">
          <LearningPathProgress onUnauthorized={handleUnauthorized} />
        </div>
        <div data-tooltip-target="weekly-stats">
          <WeeklyStatsCard onUnauthorized={handleUnauthorized} />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Link href="/hiragana" className="transition-opacity hover:opacity-80" data-tooltip-target="kana-section">
          <Card>
            <CardHeader>
              <CardTitle>Hiragana & Katakana</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Master the Japanese writing systems — your first step to reading Japanese.
              </p>
              <HiraganaStatus onUnauthorized={handleUnauthorized} />
            </CardContent>
          </Card>
        </Link>

        <Link href="/vocabulary" className="transition-opacity hover:opacity-80" data-tooltip-target="vocabulary-card">
          <Card>
            <CardHeader>
              <CardTitle>Vocabulary</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Build your word bank with 3000+ essential words using spaced repetition.
              </p>
              <p className="mt-3 text-xs font-medium text-primary">Browse Words</p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/grammar" className="transition-opacity hover:opacity-80" data-tooltip-target="grammar-card">
          <Card>
            <CardHeader>
              <CardTitle>Grammar</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Learn grammar patterns from N5 to N1 with clear explanations and examples.
              </p>
              <GrammarStatus onUnauthorized={handleUnauthorized} />
            </CardContent>
          </Card>
        </Link>

        <Link href="/kanji" className="transition-opacity hover:opacity-80">
          <Card>
            <CardHeader>
              <CardTitle>Kanji</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Learn kanji characters with stroke order, readings, and vocabulary connections.
              </p>
              <KanjiStatus onUnauthorized={handleUnauthorized} />
            </CardContent>
          </Card>
        </Link>

        {canAccessImmersion && (
          <Link href="/immersion" className="transition-opacity hover:opacity-80">
            <Card>
              <CardHeader>
                <CardTitle>Immersion</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Practice with real Japanese media, interactive subtitles, and sentence mining.
                </p>
                <p className="mt-3 text-xs font-medium text-primary">Start Watching</p>
              </CardContent>
            </Card>
          </Link>
        )}
      </div>

      <FeatureTour />
    </div>
  )
}
