'use client'

import { useEffect, useCallback, useRef } from 'react'
import { useLearnStore } from '@/store/learn-store'
import { LearnProgressBar } from '@/components/vocabulary/learn-progress-bar'
import { LearnWordCard } from '@/components/vocabulary/learn-word-card'
import { speakVocab } from '@/lib/utils/vocabulary'

export function LearnSession() {
  const word = useLearnStore((s) => s.queue[s.currentIndex] ?? null)
  const currentIndex = useLearnStore((s) => s.currentIndex)
  const total = useLearnStore((s) => s.queue.length)
  const learnedToday = useLearnStore((s) => s.learnedToday)
  const dailyLimit = useLearnStore((s) => s.dailyLimit)
  const isSubmitting = useLearnStore((s) => s.isSubmitting)
  const markAsLearning = useLearnStore((s) => s.markAsLearning)
  const skip = useLearnStore((s) => s.skip)

  const prevWordRef = useRef<string | null>(null)

  // Auto-play audio when word changes
  useEffect(() => {
    if (word && word.id !== prevWordRef.current) {
      prevWordRef.current = word.id
      speakVocab(word.word)
    }
  }, [word])

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (isSubmitting) return

      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault()
        markAsLearning()
        return
      }

      if (e.key === 'ArrowRight') {
        e.preventDefault()
        skip()
      }
    },
    [isSubmitting, markAsLearning, skip],
  )

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  if (!word) return null

  return (
    <div className="space-y-6">
      <LearnProgressBar
        current={currentIndex + 1}
        total={total}
        learnedToday={learnedToday}
        dailyLimit={dailyLimit}
      />
      <LearnWordCard
        item={word}
        onMarkAsLearning={markAsLearning}
        onSkip={skip}
        isSubmitting={isSubmitting}
      />
    </div>
  )
}
