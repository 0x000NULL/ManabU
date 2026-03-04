'use client'

import { useEffect, useCallback } from 'react'
import { useMinedSentenceReviewStore } from '@/store/mined-sentence-review-store'
import { MinedSentenceReviewCard } from '@/components/mining/mined-sentence-review-card'
import type { Rating } from '@/types/progress'

const ratingKeys: Record<string, Rating> = {
  '1': 'again',
  '2': 'hard',
  '3': 'good',
  '4': 'easy',
}

export function MinedSentenceReviewSession() {
  const card = useMinedSentenceReviewStore((s) => s.queue[s.currentIndex] ?? null)
  const currentIndex = useMinedSentenceReviewStore((s) => s.currentIndex)
  const total = useMinedSentenceReviewStore((s) => s.queue.length)
  const isRevealed = useMinedSentenceReviewStore((s) => s.isRevealed)
  const isSubmitting = useMinedSentenceReviewStore((s) => s.isSubmitting)
  const answers = useMinedSentenceReviewStore((s) => s.answers)
  const reveal = useMinedSentenceReviewStore((s) => s.reveal)
  const submitRating = useMinedSentenceReviewStore((s) => s.submitRating)

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (isSubmitting) return

      if (e.key === ' ' && !isRevealed) {
        e.preventDefault()
        reveal()
        return
      }

      if (isRevealed) {
        const rating = ratingKeys[e.key]
        if (rating) {
          submitRating(rating)
        }
      }
    },
    [isRevealed, isSubmitting, reveal, submitRating],
  )

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  if (!card) return null

  return (
    <div className="space-y-6">
      {/* Progress bar */}
      <div className="mx-auto max-w-lg">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>
            {currentIndex + 1} / {total}
          </span>
          <span>
            {answers.length} reviewed
          </span>
        </div>
        <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-primary transition-[width] duration-300"
            style={{ width: `${((currentIndex + 1) / total) * 100}%` }}
          />
        </div>
      </div>

      <MinedSentenceReviewCard
        item={card}
        isRevealed={isRevealed}
        onReveal={reveal}
        onRate={submitRating}
        isSubmitting={isSubmitting}
      />
    </div>
  )
}
