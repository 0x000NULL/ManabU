'use client'

import { useEffect, useCallback } from 'react'
import { useReviewStore } from '@/store/review-store'
import { ReviewProgressBar } from '@/components/vocabulary/review-progress-bar'
import { ReviewCard } from '@/components/vocabulary/review-card'
import type { Rating } from '@/types/progress'

const ratingKeys: Record<string, Rating> = {
  '1': 'again',
  '2': 'hard',
  '3': 'good',
  '4': 'easy',
}

export function ReviewSession() {
  const card = useReviewStore((s) => s.queue[s.currentIndex] ?? null)
  const currentIndex = useReviewStore((s) => s.currentIndex)
  const total = useReviewStore((s) => s.queue.length)
  const isRevealed = useReviewStore((s) => s.isRevealed)
  const isSubmitting = useReviewStore((s) => s.isSubmitting)
  const answers = useReviewStore((s) => s.answers)
  const reveal = useReviewStore((s) => s.reveal)
  const submitRating = useReviewStore((s) => s.submitRating)

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
      <ReviewProgressBar current={currentIndex + 1} total={total} answers={answers} />
      <ReviewCard
        item={card}
        isRevealed={isRevealed}
        onReveal={reveal}
        onRate={submitRating}
        isSubmitting={isSubmitting}
      />
    </div>
  )
}
