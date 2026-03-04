'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { useMinedSentenceReviewStore } from '@/store/mined-sentence-review-store'
import { MinedSentenceReviewSession } from '@/components/mining/mined-sentence-review-session'
import { MinedSentenceReviewCompletion } from '@/components/mining/mined-sentence-review-completion'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { Button } from '@/components/ui/button'

export default function MinedSentenceReviewPage() {
  const phase = useMinedSentenceReviewStore((s) => s.phase)
  const error = useMinedSentenceReviewStore((s) => s.error)
  const startSession = useMinedSentenceReviewStore((s) => s.startSession)

  useEffect(() => {
    startSession()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link
          href="/immersion/sentences"
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
          Mined Sentences
        </Link>
      </div>

      <div>
        <h1 className="text-2xl font-bold text-foreground">Sentence Review</h1>
        <p className="mt-1 text-muted-foreground">
          Review your mined sentences with spaced repetition.
        </p>
      </div>

      {phase === 'loading' && (
        <div className="flex flex-col items-center gap-3 py-12">
          <LoadingSpinner size="lg" />
          <p className="text-sm text-muted-foreground">Loading reviews...</p>
        </div>
      )}

      {phase === 'reviewing' && <MinedSentenceReviewSession />}
      {phase === 'completed' && <MinedSentenceReviewCompletion />}

      {phase === 'empty' && (
        <div className="flex flex-col items-center gap-4 py-12 text-center">
          <p className="text-lg font-medium text-foreground">No sentences due for review</p>
          <p className="text-sm text-muted-foreground">
            Mine more sentences while watching, or check back later.
          </p>
          <Link href="/immersion/sentences">
            <Button variant="outline">Back to Sentences</Button>
          </Link>
        </div>
      )}

      {phase === 'error' && (
        <div className="flex flex-col items-center gap-4 py-12 text-center">
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          <Button onClick={startSession}>Try Again</Button>
        </div>
      )}
    </div>
  )
}
