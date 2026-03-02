'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { useBrowseStore } from '@/store/browse-store'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { BrowseSearchBar } from '@/components/vocabulary/browse-search-bar'
import { BrowseFilters } from '@/components/vocabulary/browse-filters'
import { BrowseVocabularyGrid } from '@/components/vocabulary/browse-vocabulary-grid'
import { BrowsePagination } from '@/components/vocabulary/browse-pagination'
import { VocabularyDetailModal } from '@/components/vocabulary/vocabulary-detail-modal'

export default function VocabularyBrowsePage() {
  const {
    search,
    jlptLevel,
    frequencyTier,
    items,
    total,
    page,
    pageSize,
    isLoading,
    error,
    selectedItemId,
    detailItem,
    isDetailLoading,
    isAddingToSrs,
    setSearch,
    setJlptLevel,
    setFrequencyTier,
    setPage,
    fetchItems,
    openDetail,
    closeDetail,
    addToSrs,
  } = useBrowseStore()

  useEffect(() => {
    fetchItems()
  }, [fetchItems])

  const totalPages = Math.ceil(total / pageSize)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Link
          href="/vocabulary"
          className="mb-2 inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to Vocabulary
        </Link>
        <h1 className="text-2xl font-bold text-foreground">Browse Vocabulary</h1>
        <p className="mt-1 text-muted-foreground">
          Explore all available vocabulary words and add them to your SRS deck.
        </p>
      </div>

      {/* Search and filters */}
      <div className="space-y-3">
        <BrowseSearchBar value={search} onChange={setSearch} />
        <BrowseFilters
          jlptLevel={jlptLevel}
          frequencyTier={frequencyTier}
          onJlptChange={setJlptLevel}
          onFrequencyChange={setFrequencyTier}
        />
      </div>

      {/* Results count */}
      {!isLoading && !error && (
        <p className="text-sm text-muted-foreground">
          {total} {total === 1 ? 'word' : 'words'} found
        </p>
      )}

      {/* Loading */}
      {isLoading && (
        <div className="flex flex-col items-center gap-3 py-12">
          <LoadingSpinner size="lg" />
          <p className="text-sm text-muted-foreground">Loading vocabulary...</p>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="flex flex-col items-center gap-4 py-12 text-center">
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      {/* Grid */}
      {!isLoading && !error && (
        <>
          <BrowseVocabularyGrid items={items} onCardClick={openDetail} />
          <BrowsePagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </>
      )}

      {/* Detail modal */}
      <VocabularyDetailModal
        open={selectedItemId !== null}
        item={detailItem}
        isLoading={isDetailLoading}
        isAddingToSrs={isAddingToSrs}
        onClose={closeDetail}
        onAddToSrs={addToSrs}
      />
    </div>
  )
}
