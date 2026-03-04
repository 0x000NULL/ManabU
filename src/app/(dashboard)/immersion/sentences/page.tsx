'use client'

import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useMinedSentenceStore } from '@/store/mined-sentence-store'
import { MinedSentenceCard } from '@/components/mining/mined-sentence-card'
import { MinedSentenceEditModal } from '@/components/mining/mined-sentence-edit-modal'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { Button } from '@/components/ui/button'
import type { MinedSentence } from '@/types/mined-sentence'

export default function MinedSentencesPage() {
  const router = useRouter()
  const {
    sentences,
    total,
    isLoading,
    error,
    search,
    offset,
    fetch: fetchSentences,
    setSearch,
    loadMore,
    deleteSentence,
    updateNotes,
    updateEnglish,
  } = useMinedSentenceStore()

  const [editingSentence, setEditingSentence] = useState<MinedSentence | null>(null)
  const [searchInput, setSearchInput] = useState(search)

  useEffect(() => {
    fetchSentences()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const handleSearch = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault()
      setSearch(searchInput)
    },
    [searchInput, setSearch],
  )

  async function handleDelete(id: string) {
    if (!confirm('Delete this sentence? This cannot be undone.')) return
    await deleteSentence(id)
  }

  async function handleEditSave(
    id: string,
    updates: { notes?: string; english?: string },
  ): Promise<boolean> {
    let success = true
    if (updates.notes !== undefined) {
      success = await updateNotes(id, updates.notes)
    }
    if (success && updates.english !== undefined) {
      success = await updateEnglish(id, updates.english)
    }
    return success
  }

  function handlePlayInContext(sentence: MinedSentence) {
    if (sentence.sourceMediaId && sentence.sourceEpisode !== null) {
      router.push(
        `/immersion/watch/${sentence.sourceMediaId}/${sentence.sourceEpisode}`,
      )
    }
  }

  const hasMore = offset < total

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link
          href="/immersion"
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
          Immersion
        </Link>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Mined Sentences</h1>
          <p className="mt-1 text-muted-foreground">
            {total} sentence{total !== 1 ? 's' : ''} in your deck
          </p>
        </div>
        <Link href="/immersion/sentences/review">
          <Button>Review Due</Button>
        </Link>
      </div>

      {/* Search */}
      <form onSubmit={handleSearch} className="flex gap-2">
        <input
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Search sentences..."
          className="flex-1 rounded border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        />
        <Button type="submit" variant="outline" size="sm">
          Search
        </Button>
      </form>

      {/* Error */}
      {error && (
        <div className="rounded border border-red-200 bg-red-50 p-3 text-sm text-red-600 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400">
          {error}
        </div>
      )}

      {/* Sentence grid */}
      {sentences.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sentences.map((sentence) => (
            <MinedSentenceCard
              key={sentence.id}
              sentence={sentence}
              onEdit={setEditingSentence}
              onDelete={handleDelete}
              onPlayInContext={handlePlayInContext}
            />
          ))}
        </div>
      ) : (
        !isLoading && (
          <div className="flex flex-col items-center gap-3 py-12 text-center">
            <p className="text-muted-foreground">No mined sentences yet.</p>
            <p className="text-sm text-muted-foreground">
              Press <kbd className="rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-xs">S</kbd> while
              watching to mine sentences.
            </p>
          </div>
        )
      )}

      {/* Loading spinner */}
      {isLoading && (
        <div className="flex justify-center py-8">
          <LoadingSpinner />
        </div>
      )}

      {/* Load more */}
      {hasMore && !isLoading && (
        <div className="flex justify-center">
          <Button variant="outline" onClick={loadMore}>
            Load More
          </Button>
        </div>
      )}

      {/* Edit modal */}
      {editingSentence && (
        <MinedSentenceEditModal
          open={!!editingSentence}
          onClose={() => setEditingSentence(null)}
          sentence={editingSentence}
          onSave={handleEditSave}
        />
      )}
    </div>
  )
}
