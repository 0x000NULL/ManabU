'use client'

import { Card, CardContent } from '@/components/ui/card'
import { speakVocab } from '@/lib/utils/vocabulary'
import { getFrequencyTier } from '@/lib/utils/vocabulary'
import type { VocabularyBrowseItem } from '@/types/vocabulary'

const TIER_LABELS: Record<string, string> = {
  essential: 'Essential',
  core: 'Core',
  intermediate: 'Intermediate',
  expanding: 'Expanding',
  advanced: 'Advanced',
}

interface BrowseVocabularyCardProps {
  item: VocabularyBrowseItem
  onClick: () => void
}

export function BrowseVocabularyCard({ item, onClick }: BrowseVocabularyCardProps) {
  const tier = getFrequencyTier(item.frequency_rank)

  return (
    <Card
      className="cursor-pointer transition-shadow hover:shadow-md"
      onClick={onClick}
    >
      <CardContent className="space-y-2 pt-4">
        <div className="flex items-start justify-between gap-2">
          <span className="text-2xl font-medium text-foreground">{item.word}</span>
          <button
            onClick={(e) => {
              e.stopPropagation()
              speakVocab(item.word)
            }}
            className="shrink-0 rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            aria-label={`Play audio for ${item.word}`}
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15.536 8.464a5 5 0 010 7.072M17.95 6.05a8 8 0 010 11.9M6.5 8.788v6.424a.5.5 0 00.757.429l4.964-3.212a.5.5 0 000-.858L7.257 8.36a.5.5 0 00-.757.429z"
              />
            </svg>
          </button>
        </div>
        <p className="text-sm text-muted-foreground">{item.reading}</p>
        <p className="line-clamp-2 text-sm text-foreground">{item.meaning}</p>
        <div className="flex flex-wrap items-center gap-1.5">
          {item.jlpt_level && (
            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
              {item.jlpt_level}
            </span>
          )}
          {tier && (
            <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
              {TIER_LABELS[tier]}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
