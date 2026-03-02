'use client'

import type { GrammarPatternListItem } from '@/types/grammar'
import { GrammarPatternCard } from '@/components/grammar/grammar-pattern-card'

interface GrammarCategorySectionProps {
  name: string
  description: string
  patterns: GrammarPatternListItem[]
}

export function GrammarCategorySection({ name, description, patterns }: GrammarCategorySectionProps) {
  return (
    <section>
      <h2 className="text-lg font-semibold text-foreground">{name}</h2>
      <p className="mb-4 mt-1 text-sm text-muted-foreground">{description}</p>
      <div className="grid gap-4 sm:grid-cols-2">
        {patterns.map((p) => (
          <GrammarPatternCard key={p.id} pattern={p} />
        ))}
      </div>
    </section>
  )
}
