'use client'

import { CharacterPicker } from '@/components/hiragana/character-picker'
import type { QuizQuestion } from '@/types/quiz'
import type { KanaCharacter, KanaGroup } from '@/types/kana'

interface TypingQuestionProps {
  question: QuizQuestion
  onAnswer: (answer: string) => void
  showingFeedback: boolean
  userAnswer?: string
  availableCharacters: KanaCharacter[]
  kanaLabel?: string
  groups?: KanaGroup[]
}

export function TypingQuestion({
  question,
  onAnswer,
  showingFeedback,
  userAnswer,
  availableCharacters,
  kanaLabel = 'hiragana',
  groups,
}: TypingQuestionProps) {
  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex flex-col items-center gap-2">
        <span className="text-5xl font-medium text-primary sm:text-6xl">{question.prompt}</span>
      </div>

      <p className="text-sm text-muted-foreground">Select the {kanaLabel} character for this romaji</p>

      <CharacterPicker
        characters={availableCharacters}
        onSelect={(char) => !showingFeedback && onAnswer(char)}
        disabled={showingFeedback}
        selectedCharacter={userAnswer}
        correctCharacter={showingFeedback ? question.correctAnswer : undefined}
        className="w-full max-w-md"
        groups={groups}
      />
    </div>
  )
}
