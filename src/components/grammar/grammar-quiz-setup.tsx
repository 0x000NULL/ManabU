'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils/cn'
import { Button } from '@/components/ui/button'
import { GRAMMAR_CATEGORIES } from '@/types/grammar'
import type { GrammarQuizMode, GrammarQuizSessionConfig } from '@/types/grammar-quiz'

interface GrammarQuizSetupProps {
  onStart: (config: GrammarQuizSessionConfig) => void
}

const modeOptions: { value: GrammarQuizMode; label: string; description: string }[] = [
  {
    value: 'fill_in_blank',
    label: 'Fill in the Blank',
    description: 'Complete the sentence with the correct grammar',
  },
  {
    value: 'multiple_choice',
    label: 'Multiple Choice',
    description: 'Answer conceptual questions about grammar',
  },
  {
    value: 'mixed',
    label: 'Mixed',
    description: 'Both question types combined',
  },
]

const jlptOptions: { value: string; label: string }[] = [
  { value: 'all', label: 'All Levels' },
  { value: 'N5', label: 'N5' },
  { value: 'N4', label: 'N4' },
]

const countOptions = [5, 10, 15, 20, 0] as const
const countLabels: Record<number, string> = {
  0: 'All',
  5: '5',
  10: '10',
  15: '15',
  20: '20',
}

export function GrammarQuizSetup({ onStart }: GrammarQuizSetupProps) {
  const [mode, setMode] = useState<GrammarQuizMode>('mixed')
  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(
    new Set(GRAMMAR_CATEGORIES.map((c) => c.id)),
  )
  const [jlptLevel, setJlptLevel] = useState('all')
  const [questionCount, setQuestionCount] = useState<number>(10)

  const allSelected = GRAMMAR_CATEGORIES.every((c) => selectedCategories.has(c.id))

  function toggleCategory(categoryId: string) {
    setSelectedCategories((prev) => {
      const next = new Set(prev)
      if (next.has(categoryId)) {
        next.delete(categoryId)
      } else {
        next.add(categoryId)
      }
      return next
    })
  }

  function toggleAll() {
    if (allSelected) {
      setSelectedCategories(new Set())
    } else {
      setSelectedCategories(new Set(GRAMMAR_CATEGORIES.map((c) => c.id)))
    }
  }

  function handleStart() {
    if (selectedCategories.size === 0) return
    const jlptLevels = jlptLevel === 'all' ? ['N5', 'N4'] : [jlptLevel]
    onStart({
      mode,
      categoryIds: [...selectedCategories],
      jlptLevels,
      questionCount,
    })
  }

  return (
    <div className="space-y-8">
      {/* Mode selection */}
      <section>
        <h2 className="mb-3 text-lg font-semibold text-foreground">Quiz Mode</h2>
        <div className="grid gap-3 sm:grid-cols-3">
          {modeOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setMode(opt.value)}
              className={cn(
                'rounded-lg border px-4 py-3 text-left transition-colors',
                mode === opt.value
                  ? 'border-primary bg-primary/5 ring-1 ring-primary/20'
                  : 'border-border hover:border-primary/40 hover:bg-muted/30',
              )}
            >
              <p className="font-medium text-foreground">{opt.label}</p>
              <p className="mt-0.5 text-sm text-muted-foreground">{opt.description}</p>
            </button>
          ))}
        </div>
      </section>

      {/* JLPT Level filter */}
      <section>
        <h2 className="mb-3 text-lg font-semibold text-foreground">JLPT Level</h2>
        <div className="flex gap-2">
          {jlptOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setJlptLevel(opt.value)}
              className={cn(
                'rounded-md border px-4 py-2 text-sm font-medium transition-colors',
                jlptLevel === opt.value
                  ? 'border-primary bg-primary/5 text-primary ring-1 ring-primary/20'
                  : 'border-border text-foreground hover:border-primary/40 hover:bg-muted/30',
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </section>

      {/* Category selection */}
      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">Categories</h2>
          <button
            onClick={toggleAll}
            className="text-sm font-medium text-primary hover:underline"
          >
            {allSelected ? 'Deselect All' : 'Select All'}
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {GRAMMAR_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => toggleCategory(cat.id)}
              className={cn(
                'rounded-md border px-3 py-1.5 text-sm transition-colors',
                selectedCategories.has(cat.id)
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-border text-muted-foreground hover:border-primary/40 hover:text-foreground',
              )}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </section>

      {/* Question count */}
      <section>
        <h2 className="mb-3 text-lg font-semibold text-foreground">Questions</h2>
        <div className="flex gap-2">
          {countOptions.map((count) => (
            <button
              key={count}
              onClick={() => setQuestionCount(count)}
              className={cn(
                'rounded-md border px-4 py-2 text-sm font-medium transition-colors',
                questionCount === count
                  ? 'border-primary bg-primary/5 text-primary ring-1 ring-primary/20'
                  : 'border-border text-foreground hover:border-primary/40 hover:bg-muted/30',
              )}
            >
              {countLabels[count]}
            </button>
          ))}
        </div>
      </section>

      {/* Start button */}
      <Button
        size="lg"
        onClick={handleStart}
        disabled={selectedCategories.size === 0}
        className="w-full sm:w-auto"
      >
        Start Practice
      </Button>
    </div>
  )
}
