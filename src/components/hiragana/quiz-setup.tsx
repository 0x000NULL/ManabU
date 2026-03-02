'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils/cn'
import { Button } from '@/components/ui/button'
import { HIRAGANA_GROUPS } from '@/lib/constants/hiragana-groups'
import type { KanaGroup } from '@/types/kana'
import type { QuizMode, QuizSessionConfig } from '@/types/quiz'

interface QuizSetupProps {
  onStart: (config: QuizSessionConfig) => void
  groups?: KanaGroup[]
}

function computeGroupSections(groups: KanaGroup[]) {
  const sorted = [...groups].sort((a, b) => a.display_order - b.display_order)
  return {
    sortedGroups: sorted,
    basicGroups: sorted.filter((g) => !g.is_dakuten && !g.is_combination),
    voicedGroups: sorted.filter((g) => g.is_dakuten),
    combinationGroups: sorted.filter((g) => g.is_combination),
  }
}

const modeOptions: { value: QuizMode; label: string; description: string }[] = [
  {
    value: 'recognition',
    label: 'Recognition',
    description: 'See a character, pick the romaji',
  },
  {
    value: 'typing',
    label: 'Character Select',
    description: 'See the romaji, pick the character',
  },
  {
    value: 'audio',
    label: 'Listening',
    description: 'Hear the sound, pick the character',
  },
  {
    value: 'mixed',
    label: 'Mixed',
    description: 'All question types combined',
  },
]

const countOptions = [5, 10, 15, 20, 0] as const
const countLabels: Record<number, string> = { 0: 'All', 5: '5', 10: '10', 15: '15', 20: '20' }

export function QuizSetup({ onStart, groups = HIRAGANA_GROUPS }: QuizSetupProps) {
  const { sortedGroups, basicGroups, voicedGroups, combinationGroups } = computeGroupSections(groups)
  const [mode, setMode] = useState<QuizMode>('recognition')
  const [selectedGroups, setSelectedGroups] = useState<Set<string>>(new Set(['vowel']))
  const [questionCount, setQuestionCount] = useState<number>(10)

  const allGroupIds = sortedGroups.map((g) => g.id)
  const allSelected = allGroupIds.every((id) => selectedGroups.has(id))

  function toggleGroup(groupId: string) {
    setSelectedGroups((prev) => {
      const next = new Set(prev)
      if (next.has(groupId)) {
        next.delete(groupId)
      } else {
        next.add(groupId)
      }
      return next
    })
  }

  function toggleAll() {
    if (allSelected) {
      setSelectedGroups(new Set())
    } else {
      setSelectedGroups(new Set(allGroupIds))
    }
  }

  function handleStart() {
    if (selectedGroups.size === 0) return
    onStart({
      mode,
      groupIds: [...selectedGroups],
      questionCount,
    })
  }

  return (
    <div className="space-y-8">
      {/* Mode selection */}
      <section>
        <h2 className="mb-3 text-lg font-semibold text-foreground">Quiz Mode</h2>
        <div className="grid gap-3 sm:grid-cols-2">
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

      {/* Group selection */}
      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">Characters</h2>
          <button
            onClick={toggleAll}
            className="text-sm font-medium text-primary hover:underline"
          >
            {allSelected ? 'Deselect All' : 'Select All'}
          </button>
        </div>

        <div className="space-y-4">
          <GroupSection title="Basic" groups={basicGroups} selected={selectedGroups} onToggle={toggleGroup} />
          <GroupSection title="Voiced" groups={voicedGroups} selected={selectedGroups} onToggle={toggleGroup} />
          <GroupSection title="Combinations" groups={combinationGroups} selected={selectedGroups} onToggle={toggleGroup} />
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
        disabled={selectedGroups.size === 0}
        className="w-full sm:w-auto"
      >
        Start Practice
      </Button>
    </div>
  )
}

function GroupSection({
  title,
  groups,
  selected,
  onToggle,
}: {
  title: string
  groups: KanaGroup[]
  selected: Set<string>
  onToggle: (id: string) => void
}) {
  return (
    <div>
      <p className="mb-2 text-sm font-medium text-muted-foreground">{title}</p>
      <div className="flex flex-wrap gap-2">
        {groups.map((group) => (
          <button
            key={group.id}
            onClick={() => onToggle(group.id)}
            className={cn(
              'rounded-md border px-3 py-1.5 text-sm transition-colors',
              selected.has(group.id)
                ? 'border-primary bg-primary/10 text-primary'
                : 'border-border text-muted-foreground hover:border-primary/40 hover:text-foreground',
            )}
          >
            {group.name}
          </button>
        ))}
      </div>
    </div>
  )
}
