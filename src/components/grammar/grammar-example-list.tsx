'use client'

interface Example {
  id: string
  japanese: string
  english: string
  furigana: string | null
}

interface GrammarExampleListProps {
  examples: Example[]
}

export function GrammarExampleList({ examples }: GrammarExampleListProps) {
  if (examples.length === 0) return null

  return (
    <div>
      <h2 className="mb-3 text-lg font-semibold text-foreground">Examples</h2>
      <div className="divide-y divide-border rounded-lg border border-border">
        {examples.map((ex) => (
          <div key={ex.id} className="p-4">
            <p className="text-lg text-foreground">{ex.japanese}</p>
            {ex.furigana && (
              <p className="mt-0.5 text-sm text-muted-foreground">{ex.furigana}</p>
            )}
            <p className="mt-1 text-sm text-muted-foreground">{ex.english}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
