'use client'

import { Modal, ModalBody, ModalFooter } from '@/components/ui/modal'
import { Button } from '@/components/ui/button'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { speakVocab } from '@/lib/utils/vocabulary'
import { getFrequencyTier } from '@/lib/utils/vocabulary'
import { isRichTags } from '@/types/vocabulary'
import type { VocabularyDetailItem } from '@/types/vocabulary'

const TIER_LABELS: Record<string, string> = {
  essential: 'Essential',
  core: 'Core',
  intermediate: 'Intermediate',
  expanding: 'Expanding',
  advanced: 'Advanced',
}

const STATUS_LABELS: Record<string, string> = {
  new: 'New',
  learning: 'Learning',
  reviewing: 'Reviewing',
  mastered: 'Mastered',
}

const STATUS_COLORS: Record<string, string> = {
  new: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  learning: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  reviewing: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  mastered: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
}

interface VocabularyDetailModalProps {
  open: boolean
  item: VocabularyDetailItem | null
  isLoading: boolean
  isAddingToSrs: boolean
  onClose: () => void
  onAddToSrs: (itemId: string) => void
}

export function VocabularyDetailModal({
  open,
  item,
  isLoading,
  isAddingToSrs,
  onClose,
  onAddToSrs,
}: VocabularyDetailModalProps) {
  const tier = item ? getFrequencyTier(item.frequency_rank) : null

  return (
    <Modal open={open} onClose={onClose} size="lg" title={isLoading ? 'Loading...' : undefined}>
      {isLoading && (
        <ModalBody>
          <div className="flex items-center justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        </ModalBody>
      )}

      {!isLoading && item && (
        <>
          <ModalBody className="space-y-5">
            {/* Word header */}
            <div className="flex items-start gap-3">
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <span className="text-4xl font-medium text-foreground">{item.word}</span>
                  <button
                    onClick={() => speakVocab(item.word)}
                    className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                    aria-label="Play audio"
                  >
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15.536 8.464a5 5 0 010 7.072M17.95 6.05a8 8 0 010 11.9M6.5 8.788v6.424a.5.5 0 00.757.429l4.964-3.212a.5.5 0 000-.858L7.257 8.36a.5.5 0 00-.757.429z"
                      />
                    </svg>
                  </button>
                </div>
                <p className="mt-1 text-lg text-muted-foreground">{item.reading}</p>
                {isRichTags(item.tags) &&
                item.tags.senses &&
                item.tags.senses.length > 1 ? (
                  <ol className="mt-2 list-inside list-decimal space-y-0.5 text-base text-foreground">
                    {item.tags.senses.map((s, i) => (
                      <li key={i}>
                        {s.meanings.join('; ')}
                        {s.pos !== item.part_of_speech && (
                          <span className="ml-1 text-xs text-muted-foreground">({s.pos})</span>
                        )}
                      </li>
                    ))}
                  </ol>
                ) : (
                  <p className="mt-2 text-base text-foreground">{item.meaning}</p>
                )}
              </div>
            </div>

            {/* Badges */}
            <div className="flex flex-wrap items-center gap-2">
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
              {tier && (
                <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs text-muted-foreground">
                  {TIER_LABELS[tier]}
                </span>
              )}
              {item.frequency_rank && (
                <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs text-muted-foreground">
                  #{item.frequency_rank}
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
              {isRichTags(item.tags) &&
                item.tags.domains?.map((d) => (
                  <span
                    key={d}
                    className="rounded-full bg-teal-100 px-2.5 py-0.5 text-xs text-teal-700 dark:bg-teal-900/30 dark:text-teal-400"
                  >
                    {d}
                  </span>
                ))}
              {isRichTags(item.tags) &&
                item.tags.misc?.map((m) => (
                  <span
                    key={m}
                    className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                  >
                    {m}
                  </span>
                ))}
            </div>

            {/* Example sentences */}
            {item.sentences.length > 0 && (
              <div className="space-y-3 border-t border-border pt-4">
                <h3 className="text-sm font-medium text-foreground">Example Sentences</h3>
                {item.sentences.map((s) => (
                  <div key={s.id} className="space-y-0.5">
                    <p className="text-sm font-medium text-foreground">{s.japanese}</p>
                    <p className="text-sm text-muted-foreground">{s.english}</p>
                  </div>
                ))}
              </div>
            )}

            {/* SRS status */}
            {item.srs && (
              <div className="space-y-2 border-t border-border pt-4">
                <h3 className="text-sm font-medium text-foreground">SRS Status</h3>
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_COLORS[item.srs.status] ?? 'bg-muted text-muted-foreground'}`}
                  >
                    {STATUS_LABELS[item.srs.status] ?? item.srs.status}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {item.srs.totalReviews} reviews &middot; {item.srs.accuracy}% accuracy
                  </span>
                </div>
                {item.srs.nextReviewAt && (
                  <p className="text-xs text-muted-foreground">
                    Next review: {new Date(item.srs.nextReviewAt).toLocaleDateString()}
                  </p>
                )}
              </div>
            )}
          </ModalBody>

          <ModalFooter>
            {!item.srs && (
              <Button
                onClick={() => onAddToSrs(item.id)}
                loading={isAddingToSrs}
                disabled={isAddingToSrs}
              >
                Add to SRS
              </Button>
            )}
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </>
      )}
    </Modal>
  )
}
