'use client'

import { cn } from '@/lib/utils/cn'
import type { KanaCharacter, KanaGroup } from '@/types/kana'
import { HIRAGANA_GROUPS } from '@/lib/constants/hiragana-groups'

interface CharacterPickerProps {
  characters: KanaCharacter[]
  onSelect: (character: string) => void
  disabled?: boolean
  selectedCharacter?: string
  correctCharacter?: string
  className?: string
  groups?: KanaGroup[]
}

export function CharacterPicker({
  characters,
  onSelect,
  disabled,
  selectedCharacter,
  correctCharacter,
  className,
  groups = HIRAGANA_GROUPS,
}: CharacterPickerProps) {
  // Group characters by their group for organized display
  const sortedGroups = [...groups].sort((a, b) => a.display_order - b.display_order)
  const groupedChars = sortedGroups
    .map((group) => ({
      group,
      chars: characters
        .filter((c) => c.group === group.id)
        .sort((a, b) => a.display_order - b.display_order),
    }))
    .filter((g) => g.chars.length > 0)

  return (
    <div className={cn('space-y-3', className)}>
      {groupedChars.map(({ group, chars }) => (
        <div key={group.id}>
          <p className="mb-1.5 text-xs font-medium text-muted-foreground">{group.name}</p>
          <div className="grid grid-cols-5 gap-1.5 sm:gap-2">
            {chars.map((char) => {
              const isSelected = selectedCharacter === char.character
              const isCorrect = correctCharacter === char.character
              const isWrong = isSelected && correctCharacter && !isCorrect

              return (
                <button
                  key={char.character}
                  onClick={() => onSelect(char.character)}
                  disabled={disabled}
                  className={cn(
                    'flex flex-col items-center rounded-md border px-1 py-2 text-center transition-colors',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50',
                    'disabled:pointer-events-none disabled:opacity-50',
                    isCorrect &&
                      'border-green-500 bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400',
                    isWrong &&
                      'border-red-500 bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400',
                    isSelected &&
                      !correctCharacter &&
                      'border-primary bg-primary/10 text-primary',
                    !isSelected &&
                      !isCorrect &&
                      'border-border bg-muted/50 text-foreground hover:border-primary/40 hover:bg-muted',
                  )}
                >
                  <span className="text-lg font-medium leading-tight">{char.character}</span>
                  <span className="text-[10px] leading-tight opacity-60">{char.romaji}</span>
                </button>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}
