'use client'

import { formatTime } from '@/lib/utils/format-time'
import { Card, CardContent } from '@/components/ui/card'
import type { MinedSentence } from '@/types/mined-sentence'

interface MinedSentenceCardProps {
  sentence: MinedSentence
  onEdit: (sentence: MinedSentence) => void
  onDelete: (id: string) => void
  onPlayInContext?: (sentence: MinedSentence) => void
}

export function MinedSentenceCard({
  sentence,
  onEdit,
  onDelete,
  onPlayInContext,
}: MinedSentenceCardProps) {
  const dateStr = new Date(sentence.createdAt).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
  })

  return (
    <Card className="overflow-hidden">
      {/* Screenshot thumbnail */}
      {sentence.screenshotUrl && (
        <div className="aspect-video overflow-hidden border-b border-border bg-black">
          {/* eslint-disable-next-line @next/next/no-img-element -- data URL, not optimizable */}
          <img
            src={sentence.screenshotUrl}
            alt=""
            className="h-full w-full object-cover"
          />
        </div>
      )}

      <CardContent className="space-y-2 p-4">
        {/* Japanese text */}
        <p className="text-lg font-medium leading-relaxed text-foreground">
          {sentence.japanese}
        </p>

        {/* English text */}
        {sentence.english && (
          <p className="text-sm text-muted-foreground">{sentence.english}</p>
        )}

        {/* Notes */}
        {sentence.notes && (
          <p className="text-xs italic text-muted-foreground">{sentence.notes}</p>
        )}

        {/* Source + date */}
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>
            {sentence.sourceTimestamp !== null && sentence.sourceTimestamp !== undefined
              ? `at ${formatTime(sentence.sourceTimestamp)}`
              : ''}
          </span>
          <span>{dateStr}</span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 border-t border-border pt-2">
          <button
            type="button"
            onClick={() => onEdit(sentence)}
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            Edit
          </button>
          {onPlayInContext && sentence.sourceMediaId && sentence.sourceTimestamp !== null && (
            <button
              type="button"
              onClick={() => onPlayInContext(sentence)}
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              Play in context
            </button>
          )}
          <button
            type="button"
            onClick={() => onDelete(sentence.id)}
            className="ml-auto text-xs text-red-500/70 hover:text-red-500"
          >
            Delete
          </button>
        </div>
      </CardContent>
    </Card>
  )
}
