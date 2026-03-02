'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { useGrammarQuizStore } from '@/store/grammar-quiz-store'
import { useGrammarStore } from '@/store/grammar-store'
import { GrammarQuizSetup } from '@/components/grammar/grammar-quiz-setup'
import { GrammarQuizSession } from '@/components/grammar/grammar-quiz-session'
import { GrammarQuizResults } from '@/components/grammar/grammar-quiz-results'
import type { GrammarQuizSessionConfig } from '@/types/grammar-quiz'

export default function GrammarPracticePage() {
  const phase = useGrammarQuizStore((s) => s.phase)
  const startSession = useGrammarQuizStore((s) => s.startSession)
  const patterns = useGrammarStore((s) => s.patterns)
  const fetchPatterns = useGrammarStore((s) => s.fetchPatterns)

  useEffect(() => {
    fetchPatterns()
  }, [fetchPatterns])

  function handleStart(config: GrammarQuizSessionConfig) {
    // Filter patternIdMap by JLPT levels
    const filteredMap = new Map<string, string>()
    for (const p of patterns) {
      if (
        config.jlptLevels.length === 0 ||
        (p.jlpt_level && config.jlptLevels.includes(p.jlpt_level))
      ) {
        filteredMap.set(p.pattern, p.id)
      }
    }
    startSession(config, filteredMap)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link
          href="/grammar"
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
          Grammar
        </Link>
      </div>

      <div>
        <h1 className="text-2xl font-bold text-foreground">Grammar Practice</h1>
        <p className="mt-1 text-muted-foreground">
          Test your grammar knowledge with fill-in-the-blank and multiple choice exercises.
        </p>
      </div>

      {phase === 'setup' && <GrammarQuizSetup onStart={handleStart} />}
      {phase === 'active' && <GrammarQuizSession />}
      {phase === 'results' && <GrammarQuizResults />}
    </div>
  )
}
