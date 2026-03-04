'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { ImmersionStatsDisplay } from '@/components/immersion/immersion-stats'
import { ImmersionChart } from '@/components/immersion/immersion-chart'
import { MediaCard } from '@/components/immersion/media-card'
import { useMediaStore } from '@/store/media-store'
import type { ImmersionStats, MediaType, MediaDifficulty } from '@/types/media'

const typeFilters: { label: string; value: MediaType | null }[] = [
  { label: 'All', value: null },
  { label: 'Anime', value: 'anime' },
  { label: 'Drama', value: 'drama' },
  { label: 'Movie', value: 'movie' },
  { label: 'YouTube', value: 'youtube' },
]

const difficultyFilters: { label: string; value: MediaDifficulty | null }[] = [
  { label: 'All', value: null },
  { label: 'Beginner', value: 'beginner' },
  { label: 'Intermediate', value: 'intermediate' },
  { label: 'Advanced', value: 'advanced' },
]

export default function ImmersionPage() {
  const [stats, setStats] = useState<ImmersionStats | null>(null)
  const [statsError, setStatsError] = useState<string | null>(null)

  const {
    search,
    type,
    difficulty,
    items,
    total,
    page,
    pageSize,
    isLoading: mediaLoading,
    error: mediaError,
    setSearch,
    setType,
    setDifficulty,
    setPage,
    fetchItems,
  } = useMediaStore()

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch('/api/v1/immersion/stats')
        if (!res.ok) {
          setStatsError('Failed to load immersion stats')
          return
        }
        const json = await res.json()
        setStats(json.data as ImmersionStats)
      } catch {
        setStatsError('Network error — please try again')
      }
    }
    fetchStats()
    fetchItems()
  }, [fetchItems])

  const totalPages = Math.ceil(total / pageSize)

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearch(e.target.value)
    },
    [setSearch]
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Immersion</h1>
        <p className="mt-1 text-muted-foreground">
          Watch Japanese content with interactive subtitles and mine sentences for review.
        </p>
      </div>

      {!stats && !statsError && (
        <div className="flex flex-col items-center gap-3 py-12">
          <LoadingSpinner size="lg" />
          <p className="text-sm text-muted-foreground">Loading stats...</p>
        </div>
      )}

      {statsError && (
        <div className="flex flex-col items-center gap-4 py-12 text-center">
          <p className="text-sm text-red-600 dark:text-red-400">{statsError}</p>
        </div>
      )}

      {stats && (
        <div className="space-y-6">
          {/* Action cards */}
          <div className="grid gap-4 sm:grid-cols-3">
            {/* Browse Library */}
            <Card>
              <CardContent className="flex flex-col gap-4">
                <div className="flex items-center gap-3 pt-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <svg
                      className="h-5 w-5 text-primary"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-foreground">Browse Library</h2>
                    <p className="text-sm text-muted-foreground">Find content to watch</p>
                  </div>
                </div>
                <a href="#library">
                  <Button className="w-full" variant="outline">
                    Browse Content
                  </Button>
                </a>
              </CardContent>
            </Card>

            {/* Mined Sentences */}
            <Card>
              <CardContent className="flex flex-col gap-4">
                <div className="flex items-center gap-3 pt-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/10">
                    <svg
                      className="h-5 w-5 text-green-600 dark:text-green-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                      />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-foreground">Mined Sentences</h2>
                    <p className="text-sm text-muted-foreground">
                      {stats.sentencesMined} {stats.sentencesMined === 1 ? 'sentence' : 'sentences'}{' '}
                      collected
                    </p>
                  </div>
                </div>
                <Link href="/immersion/sentences">
                  <Button className="w-full" variant="outline">
                    View Sentences
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Review Sentences */}
            <Card>
              <CardContent className="flex flex-col gap-4">
                <div className="flex items-center gap-3 pt-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/10">
                    <svg
                      className="h-5 w-5 text-purple-600 dark:text-purple-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                      />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-foreground">Review Sentences</h2>
                    <p className="text-sm text-muted-foreground">
                      {stats.sentencesDueCount} due for review
                    </p>
                  </div>
                </div>
                <Link href="/immersion/sentences/review">
                  <Button className="w-full" disabled={stats.sentencesDueCount === 0}>
                    {stats.sentencesDueCount > 0 ? 'Start Review' : 'No Reviews Due'}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          {/* Stats summary */}
          <ImmersionStatsDisplay stats={stats} />

          {/* Weekly immersion chart */}
          <ImmersionChart data={stats.weeklyImmersion} />
        </div>
      )}

      {/* Media Library */}
      <div id="library" className="space-y-4">
        <h2 className="text-xl font-semibold text-foreground">Media Library</h2>

        {/* Search */}
        <input
          type="text"
          placeholder="Search by title or description..."
          value={search}
          onChange={handleSearchChange}
          className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
        />

        {/* Filter chips */}
        <div className="flex flex-wrap gap-4">
          <div className="flex flex-wrap gap-1.5">
            {typeFilters.map((f) => (
              <button
                key={f.label}
                onClick={() => setType(f.value)}
                className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                  type === f.value
                    ? 'bg-primary text-white'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-1.5">
            {difficultyFilters.map((f) => (
              <button
                key={f.label}
                onClick={() => setDifficulty(f.value)}
                className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                  difficulty === f.value
                    ? 'bg-primary text-white'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Results count */}
        <p className="text-sm text-muted-foreground">
          {total} {total === 1 ? 'result' : 'results'}
        </p>

        {/* Loading */}
        {mediaLoading && (
          <div className="flex justify-center py-8">
            <LoadingSpinner size="lg" />
          </div>
        )}

        {/* Error */}
        {mediaError && (
          <div className="flex flex-col items-center gap-4 py-8 text-center">
            <p className="text-sm text-red-600 dark:text-red-400">{mediaError}</p>
          </div>
        )}

        {/* Grid */}
        {!mediaLoading && !mediaError && (
          <>
            {items.length === 0 ? (
              <p className="py-8 text-center text-sm text-muted-foreground">
                No media found. Try adjusting your filters.
              </p>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((item) => (
                  <MediaCard key={item.id} item={item} />
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 pt-4">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page <= 1}
                  onClick={() => setPage(page - 1)}
                >
                  Previous
                </Button>
                <span className="text-sm text-muted-foreground">
                  Page {page} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page >= totalPages}
                  onClick={() => setPage(page + 1)}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
