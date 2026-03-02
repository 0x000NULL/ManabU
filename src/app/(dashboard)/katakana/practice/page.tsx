'use client'

import Link from 'next/link'
import { useQuizStore } from '@/store/quiz-store'
import { QuizSetup } from '@/components/hiragana/quiz-setup'
import { QuizSession } from '@/components/hiragana/quiz-session'
import { QuizResults } from '@/components/hiragana/quiz-results'
import { KATAKANA_GROUPS } from '@/lib/constants/katakana-groups'

export default function KatakanaPracticePage() {
  const phase = useQuizStore((s) => s.phase)
  const startSession = useQuizStore((s) => s.startSession)

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link
          href="/katakana"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Katakana
        </Link>
      </div>

      <div>
        <h1 className="text-2xl font-bold text-foreground">Practice</h1>
        <p className="mt-1 text-muted-foreground">
          Test your katakana knowledge with different quiz modes.
        </p>
      </div>

      {phase === 'setup' && (
        <QuizSetup
          onStart={(config) => startSession(config, 'katakana')}
          groups={KATAKANA_GROUPS}
        />
      )}
      {phase === 'active' && (
        <QuizSession kanaLabel="katakana" groups={KATAKANA_GROUPS} />
      )}
      {phase === 'results' && (
        <QuizResults kanaType="katakana" overviewHref="/katakana" />
      )}
    </div>
  )
}
