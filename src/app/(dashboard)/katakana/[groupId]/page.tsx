'use client'

import { useCallback, useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { KATAKANA_CHARACTERS } from '@/lib/constants/katakana-data'
import { KATAKANA_GROUPS } from '@/lib/constants/katakana-groups'
import { getGroupById, getCharactersByGroup } from '@/lib/utils/kana'
import { CharacterDisplay } from '@/components/hiragana/character-display'
import { StrokeOrderViewer } from '@/components/hiragana/stroke-order-viewer'
import { MnemonicCard } from '@/components/hiragana/mnemonic-card'
import { ExampleWordsList } from '@/components/hiragana/example-words-list'
import { LessonNavigation } from '@/components/hiragana/lesson-navigation'
import { GroupProgressBar } from '@/components/hiragana/group-progress-bar'
import { LessonComplete } from '@/components/hiragana/lesson-complete'
import { useProgressStore } from '@/store/progress-store'

export default function KatakanaGroupLessonPage() {
  const params = useParams<{ groupId: string }>()
  const [currentIndex, setCurrentIndex] = useState(0)
  const { fetchKatakanaProgress } = useProgressStore()

  const group = getGroupById(params.groupId, KATAKANA_GROUPS)
  const characters = getCharactersByGroup(KATAKANA_CHARACTERS, params.groupId)

  useEffect(() => {
    fetchKatakanaProgress()
  }, [fetchKatakanaProgress])

  const goToPrevious = useCallback(() => {
    setCurrentIndex((i) => Math.max(0, i - 1))
  }, [])

  const goToNext = useCallback(() => {
    setCurrentIndex((i) => Math.min(characters.length - 1, i + 1))
  }, [characters.length])

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'ArrowLeft') goToPrevious()
      if (e.key === 'ArrowRight') goToNext()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [goToPrevious, goToNext])

  if (!group || characters.length === 0) {
    return (
      <div className="space-y-4 py-12 text-center">
        <h1 className="text-2xl font-bold text-foreground">Group not found</h1>
        <p className="text-muted-foreground">
          The group &ldquo;{params.groupId}&rdquo; doesn&apos;t exist.
        </p>
        <Link href="/katakana" className="text-sm font-medium text-primary hover:underline">
          Back to Katakana Overview
        </Link>
      </div>
    )
  }

  const current = characters[currentIndex]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link
          href="/katakana"
          className="text-muted-foreground transition-colors hover:text-foreground"
          aria-label="Back to overview"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </Link>
        <div>
          <h1 className="text-xl font-bold text-foreground">{group.name}</h1>
          <p className="text-sm text-muted-foreground">{group.description}</p>
        </div>
      </div>

      {/* Progress bar */}
      <GroupProgressBar
        currentIndex={currentIndex}
        totalCount={characters.length}
        characters={characters}
        onCharacterClick={setCurrentIndex}
      />

      {/* Lesson complete section on last character */}
      {currentIndex === characters.length - 1 && (
        <LessonComplete
          characters={characters}
          groupName={group.name}
          groupId={params.groupId}
          kanaType="katakana"
          routePrefix="/katakana"
          groups={KATAKANA_GROUPS}
        />
      )}

      {/* Main content */}
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Left column: Character + Stroke order */}
        <div className="flex flex-col items-center gap-6">
          <CharacterDisplay character={current} />
          <StrokeOrderViewer character={current.character} />
        </div>

        {/* Right column: Mnemonic + Examples */}
        <div className="space-y-6">
          <MnemonicCard
            mnemonic={current.mnemonic}
            character={current.character}
            romaji={current.romaji}
          />
          <ExampleWordsList
            words={current.example_words}
            highlightCharacter={current.character}
          />
        </div>
      </div>

      {/* Navigation */}
      <LessonNavigation
        currentIndex={currentIndex}
        totalCount={characters.length}
        onPrevious={goToPrevious}
        onNext={goToNext}
        characters={characters}
        currentGroupId={params.groupId}
        routePrefix="/katakana"
        groups={KATAKANA_GROUPS}
        className="border-t border-border pt-4"
      />

    </div>
  )
}
