'use client'

import { cn } from '@/lib/utils/cn'
import type { JlptLevel, FrequencyTier } from '@/types/vocabulary'

interface BrowseFiltersProps {
  jlptLevel: JlptLevel | null
  frequencyTier: FrequencyTier | null
  onJlptChange: (level: JlptLevel | null) => void
  onFrequencyChange: (tier: FrequencyTier | null) => void
}

const JLPT_OPTIONS: { label: string; value: JlptLevel | null }[] = [
  { label: 'All', value: null },
  { label: 'N5', value: 'N5' },
  { label: 'N4', value: 'N4' },
  { label: 'N3', value: 'N3' },
  { label: 'N2', value: 'N2' },
  { label: 'N1', value: 'N1' },
]

const FREQUENCY_OPTIONS: { label: string; value: FrequencyTier | null }[] = [
  { label: 'All', value: null },
  { label: 'Essential', value: 'essential' },
  { label: 'Core', value: 'core' },
  { label: 'Intermediate', value: 'intermediate' },
  { label: 'Expanding', value: 'expanding' },
  { label: 'Advanced', value: 'advanced' },
]

function chipClass(active: boolean): string {
  return cn(
    'rounded-full border px-3 py-1 text-xs font-medium transition-colors',
    active
      ? 'border-primary bg-primary text-primary-foreground'
      : 'border-border bg-background text-muted-foreground hover:bg-muted hover:text-foreground',
  )
}

export function BrowseFilters({
  jlptLevel,
  frequencyTier,
  onJlptChange,
  onFrequencyChange,
}: BrowseFiltersProps) {
  return (
    <div className="flex flex-wrap items-center gap-4">
      <div className="flex items-center gap-2">
        <span className="text-xs font-medium text-muted-foreground">JLPT</span>
        <div className="flex gap-1">
          {JLPT_OPTIONS.map((opt) => (
            <button
              key={opt.label}
              onClick={() => onJlptChange(opt.value)}
              className={chipClass(jlptLevel === opt.value)}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-xs font-medium text-muted-foreground">Frequency</span>
        <div className="flex flex-wrap gap-1">
          {FREQUENCY_OPTIONS.map((opt) => (
            <button
              key={opt.label}
              onClick={() => onFrequencyChange(opt.value)}
              className={chipClass(frequencyTier === opt.value)}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
