'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import type { Rating } from '@/types/progress'
import type { MinedSentenceReviewItem } from '@/types/mined-sentence'

const RATING_BUTTONS: { rating: Rating; label: string; key: string; color: string }[] = [
  { rating: 'again', label: 'Again', key: '1', color: 'bg-red-600 hover:bg-red-700' },
  { rating: 'hard', label: 'Hard', key: '2', color: 'bg-orange-600 hover:bg-orange-700' },
  { rating: 'good', label: 'Good', key: '3', color: 'bg-green-600 hover:bg-green-700' },
  { rating: 'easy', label: 'Easy', key: '4', color: 'bg-blue-600 hover:bg-blue-700' },
]

interface MinedSentenceReviewCardProps {
  item: MinedSentenceReviewItem
  isRevealed: boolean
  onReveal: () => void
  onRate: (rating: Rating) => void
  isSubmitting: boolean
}

export function MinedSentenceReviewCard({
  item,
  isRevealed,
  onReveal,
  onRate,
  isSubmitting,
}: MinedSentenceReviewCardProps) {
  return (
    <Card className="mx-auto max-w-lg">
      <CardContent className="space-y-6">
        {/* Front: screenshot + japanese */}
        <div className="flex flex-col items-center gap-4 pt-4">
          {item.screenshotUrl && (
            <div className="w-full overflow-hidden rounded-lg border border-border bg-black">
              {/* eslint-disable-next-line @next/next/no-img-element -- data URL, not optimizable */}
              <img
                src={item.screenshotUrl}
                alt=""
                className="w-full object-cover"
              />
            </div>
          )}
          <p className="text-2xl font-medium text-center leading-relaxed">{item.japanese}</p>
        </div>

        {/* Reveal prompt */}
        {!isRevealed && (
          <div className="flex flex-col items-center gap-2">
            <Button onClick={onReveal} size="lg" className="w-full">
              Show Answer
            </Button>
            <span className="text-xs text-muted-foreground">Press Space</span>
          </div>
        )}

        {/* Back: visible after reveal */}
        {isRevealed && (
          <div className="space-y-4">
            {/* English translation */}
            {item.english && (
              <p className="text-center text-lg text-muted-foreground">{item.english}</p>
            )}

            {/* Notes */}
            {item.notes && (
              <p className="text-center text-sm italic text-muted-foreground">{item.notes}</p>
            )}

            {/* Source */}
            {item.mediaTitle && (
              <div className="text-center">
                <span className="text-xs text-muted-foreground">
                  From: {item.mediaTitleEnglish ?? item.mediaTitle}
                  {item.sourceEpisode !== null ? ` Ep. ${item.sourceEpisode}` : ''}
                </span>
                {item.sourceMediaId && item.sourceEpisode !== null && item.sourceTimestamp !== null && (
                  <a
                    href={`/immersion/watch/${item.sourceMediaId}/${item.sourceEpisode}`}
                    className="ml-2 text-xs text-primary hover:underline"
                  >
                    Play in context
                  </a>
                )}
              </div>
            )}

            {/* Rating buttons */}
            <div className="space-y-2 border-t border-border pt-4">
              <div className="grid grid-cols-4 gap-2">
                {RATING_BUTTONS.map(({ rating, label, key, color }) => (
                  <button
                    key={rating}
                    type="button"
                    onClick={() => onRate(rating)}
                    disabled={isSubmitting}
                    className={`rounded px-3 py-2 text-sm font-medium text-white transition-colors disabled:opacity-50 ${color}`}
                  >
                    {label}
                    <span className="block text-xs opacity-60">{key}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
