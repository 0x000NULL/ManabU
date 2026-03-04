'use client'

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import type { VocabularyExtendedStats } from '@/types/learn'
import type { KanaProgressSummary } from '@/types/progress'
import type { GrammarProgressStats } from '@/types/grammar'

interface StudyActivity {
  id: string
  priority: number
  icon: React.ReactNode
  iconBgClass: string
  title: string
  description: string
  timeMinutes: number
  href: string
  buttonLabel: string
  buttonVariant: 'primary' | 'outline'
}

interface FetchedData {
  vocab: VocabularyExtendedStats | null
  hiragana: KanaProgressSummary | null
  katakana: KanaProgressSummary | null
  grammar: GrammarProgressStats | null
}

function buildStudyPlan(data: FetchedData): StudyActivity[] {
  const activities: StudyActivity[] = []

  if (data.vocab && data.vocab.dueCount > 0) {
    activities.push({
      id: 'vocab-review',
      priority: 1,
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
          />
        </svg>
      ),
      iconBgClass: 'bg-primary/10 text-primary',
      title: 'Vocabulary Reviews',
      description: `${data.vocab.dueCount} word${data.vocab.dueCount !== 1 ? 's' : ''} due for review`,
      timeMinutes: Math.ceil((data.vocab.dueCount * 45) / 60),
      href: '/vocabulary/review',
      buttonLabel: 'Start Review',
      buttonVariant: 'primary',
    })
  }

  if (data.hiragana && data.hiragana.dueCount > 0) {
    activities.push({
      id: 'hiragana-review',
      priority: 2,
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"
          />
        </svg>
      ),
      iconBgClass: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
      title: 'Hiragana Reviews',
      description: `${data.hiragana.dueCount} character${data.hiragana.dueCount !== 1 ? 's' : ''} due`,
      timeMinutes: Math.ceil((data.hiragana.dueCount * 45) / 60),
      href: '/hiragana/practice',
      buttonLabel: 'Practice',
      buttonVariant: 'primary',
    })
  }

  if (data.katakana && data.katakana.dueCount > 0) {
    activities.push({
      id: 'katakana-review',
      priority: 3,
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"
          />
        </svg>
      ),
      iconBgClass: 'bg-orange-500/10 text-orange-600 dark:text-orange-400',
      title: 'Katakana Reviews',
      description: `${data.katakana.dueCount} character${data.katakana.dueCount !== 1 ? 's' : ''} due`,
      timeMinutes: Math.ceil((data.katakana.dueCount * 45) / 60),
      href: '/katakana/practice',
      buttonLabel: 'Practice',
      buttonVariant: 'primary',
    })
  }

  if (data.vocab && data.vocab.learnedToday < data.vocab.dailyNewWordLimit) {
    const remaining = data.vocab.dailyNewWordLimit - data.vocab.learnedToday
    activities.push({
      id: 'vocab-learn',
      priority: 4,
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zM12.75 12a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"
          />
        </svg>
      ),
      iconBgClass: 'bg-green-500/10 text-green-600 dark:text-green-400',
      title: 'New Vocabulary',
      description: `${remaining} new word${remaining !== 1 ? 's' : ''} available today`,
      timeMinutes: remaining * 2,
      href: '/vocabulary/learn',
      buttonLabel: 'Learn Words',
      buttonVariant: 'outline',
    })
  }

  if (data.grammar && data.grammar.learned < data.grammar.total) {
    activities.push({
      id: 'grammar-practice',
      priority: 5,
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
          />
        </svg>
      ),
      iconBgClass: 'bg-purple-500/10 text-purple-600 dark:text-purple-400',
      title: 'Grammar Practice',
      description: `${data.grammar.total - data.grammar.learned} pattern${data.grammar.total - data.grammar.learned !== 1 ? 's' : ''} to learn`,
      timeMinutes: 10,
      href: '/grammar/practice',
      buttonLabel: 'Practice',
      buttonVariant: 'outline',
    })
  }

  activities.push({
    id: 'immersion',
    priority: 6,
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
        />
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    iconBgClass: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
    title: 'Immersion',
    description: 'Practice with real Japanese media',
    timeMinutes: 15,
    href: '/immersion',
    buttonLabel: 'Watch',
    buttonVariant: 'outline',
  })

  return activities.sort((a, b) => a.priority - b.priority)
}

function isNewUser(data: FetchedData): boolean {
  const noHiragana = !data.hiragana || data.hiragana.learnedCount === 0
  const noKatakana = !data.katakana || data.katakana.learnedCount === 0
  const noVocab = !data.vocab || data.vocab.totalLearned === 0
  const noGrammar = !data.grammar || data.grammar.learned === 0
  return noHiragana && noKatakana && noVocab && noGrammar
}

function isAllCaughtUp(data: FetchedData): boolean {
  const noVocabDue = !data.vocab || data.vocab.dueCount === 0
  const noHiraganaDue = !data.hiragana || data.hiragana.dueCount === 0
  const noKatakanaDue = !data.katakana || data.katakana.dueCount === 0
  const vocabLimitReached =
    data.vocab != null && data.vocab.learnedToday >= data.vocab.dailyNewWordLimit
  return noVocabDue && noHiraganaDue && noKatakanaDue && vocabLimitReached
}

async function fetchJson<T>(url: string): Promise<{ data: T | null; status: number }> {
  const res = await fetch(url)
  if (!res.ok) return { data: null, status: res.status }
  const json = await res.json()
  return { data: json.data as T, status: res.status }
}

export function DailyLessonCard({ onUnauthorized }: { onUnauthorized: () => void }) {
  const [activities, setActivities] = useState<StudyActivity[]>([])
  const [totalTime, setTotalTime] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [newUser, setNewUser] = useState(false)
  const [allCaughtUp, setAllCaughtUp] = useState(false)

  const loadData = useCallback(async () => {
    setLoading(true)
    setError(false)

    try {
      const [vocabResult, hiraganaResult, katakanaResult, grammarResult] =
        await Promise.allSettled([
          fetchJson<VocabularyExtendedStats>('/api/v1/srs/stats'),
          fetchJson<KanaProgressSummary>('/api/v1/hiragana/progress'),
          fetchJson<KanaProgressSummary>('/api/v1/katakana/progress'),
          fetchJson<GrammarProgressStats>('/api/v1/grammar/progress'),
        ])

      // Check for 401 on any successful fetch
      const results = [vocabResult, hiraganaResult, katakanaResult, grammarResult]
      const anyUnauthorized = results.some(
        (r) => r.status === 'fulfilled' && r.value.status === 401
      )
      if (anyUnauthorized) {
        onUnauthorized()
        return
      }

      // Check if all failed
      const allFailed = results.every(
        (r) => r.status === 'rejected' || (r.status === 'fulfilled' && r.value.data === null)
      )
      if (allFailed) {
        setError(true)
        setLoading(false)
        return
      }

      const data: FetchedData = {
        vocab: vocabResult.status === 'fulfilled' ? vocabResult.value.data : null,
        hiragana: hiraganaResult.status === 'fulfilled' ? hiraganaResult.value.data : null,
        katakana: katakanaResult.status === 'fulfilled' ? katakanaResult.value.data : null,
        grammar: grammarResult.status === 'fulfilled' ? grammarResult.value.data : null,
      }

      if (isNewUser(data)) {
        setNewUser(true)
        setLoading(false)
        return
      }

      if (isAllCaughtUp(data)) {
        setAllCaughtUp(true)
        setLoading(false)
        return
      }

      const plan = buildStudyPlan(data)
      setActivities(plan)
      setTotalTime(plan.reduce((sum, a) => sum + a.timeMinutes, 0))
    } catch {
      setError(true)
    } finally {
      setLoading(false)
    }
  }, [onUnauthorized])

  useEffect(() => {
    loadData()
  }, [loadData])

  if (loading) {
    return (
      <Card className="border-primary/20">
        <CardContent className="flex items-center justify-center py-12">
          <LoadingSpinner size="md" className="mr-3 text-primary" />
          <span className="text-sm text-muted-foreground">Building your study plan...</span>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="border-primary/20">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <p className="text-sm text-muted-foreground">Unable to load study plan</p>
          <Button variant="outline" size="sm" className="mt-3" onClick={loadData}>
            Retry
          </Button>
        </CardContent>
      </Card>
    )
  }

  if (newUser) {
    return (
      <Card className="border-primary/20">
        <CardHeader>
          <CardTitle>Start Your Journey</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Begin by learning Hiragana — the foundation of Japanese reading.
          </p>
          <Link href="/hiragana">
            <Button className="mt-4" size="sm">
              Begin with Hiragana
            </Button>
          </Link>
        </CardContent>
      </Card>
    )
  }

  if (allCaughtUp) {
    return (
      <Card className="border-primary/20">
        <CardContent className="flex items-center gap-3 py-8">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green-500/10">
            <svg
              className="h-5 w-5 text-green-600 dark:text-green-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div>
            <p className="font-medium text-foreground">All caught up for today!</p>
            <p className="text-sm text-muted-foreground">
              Great work. Come back tomorrow for more reviews.
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-primary/20">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Today&apos;s Study Plan</CardTitle>
        <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
          ~{totalTime} min total
        </span>
      </CardHeader>
      <CardContent>
        <div className="divide-y divide-border">
          {activities.map((activity) => (
            <div
              key={activity.id}
              className="flex flex-col gap-3 py-3 first:pt-0 last:pb-0 sm:flex-row sm:items-center"
            >
              <div className="flex flex-1 items-center gap-3">
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${activity.iconBgClass}`}
                >
                  {activity.icon}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-foreground">{activity.title}</p>
                  <p className="text-xs text-muted-foreground">{activity.description}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 pl-13 sm:pl-0">
                <span className="text-xs text-muted-foreground">~{activity.timeMinutes} min</span>
                <Link href={activity.href}>
                  <Button variant={activity.buttonVariant} size="sm">
                    {activity.buttonLabel}
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
