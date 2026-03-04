'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { speakVocab } from '@/lib/utils/vocabulary'
import { isRichTags } from '@/types/vocabulary'
import type { NewWordItem } from '@/types/learn'

interface LearnWordCardProps {
  item: NewWordItem
  onMarkAsLearning: () => void
  onSkip: () => void
  isSubmitting: boolean
}

export function LearnWordCard({ item, onMarkAsLearning, onSkip, isSubmitting }: LearnWordCardProps) {
  return (
    <Card className="mx-auto max-w-lg">
      <CardContent className="space-y-6">
        {/* Word display */}
        <div className="flex flex-col items-center gap-3 pt-4">
          <span className="text-5xl font-medium">{item.word}</span>
          <button
            onClick={() => speakVocab(item.word)}
            className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            aria-label="Play audio"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15.536 8.464a5 5 0 010 7.072M17.95 6.05a8 8 0 010 11.9M6.5 8.788v6.424a.5.5 0 00.757.429l4.964-3.212a.5.5 0 000-.858L7.257 8.36a.5.5 0 00-.757.429z"
              />
            </svg>
          </button>
        </div>

        {/* Reading and meaning */}
        <div className="space-y-1 text-center">
          <p className="text-xl font-medium text-foreground">{item.reading}</p>
          {isRichTags(item.tags) &&
          item.tags.senses &&
          item.tags.senses.length > 1 ? (
            <ol className="list-inside list-decimal space-y-0.5 text-left text-base text-muted-foreground">
              {item.tags.senses.map((s, i) => (
                <li key={i}>{s.meanings.join('; ')}</li>
              ))}
            </ol>
          ) : (
            <p className="text-lg text-muted-foreground">{item.meaning}</p>
          )}
          <div className="flex items-center justify-center gap-2">
            {item.part_of_speech && (
              <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs text-muted-foreground">
                {item.part_of_speech}
              </span>
            )}
            {item.jlpt_level && (
              <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                {item.jlpt_level}
              </span>
            )}
            {isRichTags(item.tags) && item.tags.transitivity && (
              <span className="rounded-full bg-orange-100 px-2.5 py-0.5 text-xs font-medium text-orange-700 dark:bg-orange-900/30 dark:text-orange-400">
                {item.tags.transitivity === 'both'
                  ? 'Trans. & Intrans.'
                  : item.tags.transitivity === 'transitive'
                    ? 'Transitive'
                    : 'Intransitive'}
              </span>
            )}
          </div>
        </div>

        {/* Example sentences */}
        {item.sentences.length > 0 && (
          <div className="space-y-2 border-t border-border pt-4">
            {item.sentences.map((s) => (
              <div key={s.id} className="space-y-0.5">
                <p className="text-sm font-medium text-foreground">{s.japanese}</p>
                <p className="text-sm text-muted-foreground">{s.english}</p>
              </div>
            ))}
          </div>
        )}

        {/* Action buttons */}
        <div className="space-y-2 border-t border-border pt-4">
          <Button
            onClick={onMarkAsLearning}
            size="lg"
            className="w-full"
            loading={isSubmitting}
            disabled={isSubmitting}
          >
            Mark as Learning
          </Button>
          <Button
            onClick={onSkip}
            variant="ghost"
            size="lg"
            className="w-full"
            disabled={isSubmitting}
          >
            Skip
          </Button>
          <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
            <span>Space / Enter to learn</span>
            <span>&rarr; to skip</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
