'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import { useGrammarStore } from '@/store/grammar-store'
import { GrammarCategorySection } from '@/components/grammar/grammar-category-section'
import { GrammarPatternCard } from '@/components/grammar/grammar-pattern-card'
import { GrammarProgressOverview } from '@/components/grammar/grammar-progress-overview'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import type { GrammarDifficulty } from '@/types/grammar'

const DIFFICULTY_OPTIONS: { label: string; value: GrammarDifficulty | null }[] = [
  { label: 'All', value: null },
  { label: 'Beginner', value: 'beginner' },
  { label: 'Intermediate', value: 'intermediate' },
  { label: 'Advanced', value: 'advanced' },
]

export default function GrammarOverviewPage() {
  const {
    isLoading,
    error,
    search,
    difficulty,
    fetchPatterns,
    fetchProgress,
    setSearch,
    setDifficulty,
    getFilteredPatterns,
    getPatternsByCategory,
  } = useGrammarStore()

  const [searchInput, setSearchInput] = useState(search)
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(null)

  useEffect(() => {
    fetchPatterns()
    fetchProgress()
  }, [fetchPatterns, fetchProgress])

  function handleSearchChange(value: string) {
    setSearchInput(value)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => setSearch(value), 300)
  }

  const hasFilters = search.length > 0 || difficulty !== null
  const filteredPatterns = useMemo(() => getFilteredPatterns(), [getFilteredPatterns])
  const categoryGroups = useMemo(() => getPatternsByCategory(), [getPatternsByCategory])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-4 py-12 text-center">
        <p className="text-muted-foreground">{error}</p>
        <button
          onClick={() => fetchPatterns()}
          className="text-sm font-medium text-primary hover:underline"
        >
          Try again
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Grammar</h1>
        <p className="mt-1 text-muted-foreground">
          Learn essential Japanese grammar patterns with clear explanations and examples.
        </p>
      </div>

      <GrammarProgressOverview />

      <Link
        href="/grammar/practice"
        className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
      >
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
          />
        </svg>
        Practice Grammar
      </Link>

      {/* Search */}
      <div className="space-y-3">
        <input
          type="text"
          value={searchInput}
          onChange={(e) => handleSearchChange(e.target.value)}
          placeholder="Search patterns..."
          className="w-full rounded-lg border border-border bg-background px-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        />

        {/* Difficulty filter chips */}
        <div className="flex flex-wrap gap-2">
          {DIFFICULTY_OPTIONS.map((opt) => (
            <button
              key={opt.label}
              onClick={() => setDifficulty(opt.value)}
              className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                difficulty === opt.value
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      {hasFilters ? (
        filteredPatterns.length === 0 ? (
          <p className="py-8 text-center text-muted-foreground">
            No patterns match your search.
          </p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {filteredPatterns.map((p) => (
              <GrammarPatternCard key={p.id} pattern={p} />
            ))}
          </div>
        )
      ) : (
        <div className="space-y-10">
          {categoryGroups.map((group) => (
            <GrammarCategorySection
              key={group.categoryId}
              name={group.name}
              description={group.description}
              patterns={group.patterns}
            />
          ))}
        </div>
      )}
    </div>
  )
}
