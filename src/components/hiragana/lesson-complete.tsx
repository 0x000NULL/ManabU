'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useProgressStore } from '@/store/progress-store'
import type { KanaCharacter, KanaGroup, KanaType } from '@/types/kana'

interface LessonCompleteProps {
  characters: KanaCharacter[]
  groupName: string
  groupId: string
  kanaType: KanaType
  routePrefix?: string
  groups?: KanaGroup[]
}

export function LessonComplete({
  characters,
  groupName,
  groupId,
  kanaType,
  routePrefix = '/hiragana',
  groups = [],
}: LessonCompleteProps) {
  const { submitQuizResults } = useProgressStore()
  const progress = useProgressStore((s) => s[kanaType])

  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const allHaveProgress = useMemo(() => {
    if (!progress) return false
    return characters.every((char) => {
      const cp = progress.characters.find((c) => c.character === char.character)
      return cp && cp.status !== 'new'
    })
  }, [progress, characters])

  const sortedGroups = useMemo(() => [...groups].sort((a, b) => a.display_order - b.display_order), [groups])
  const currentGroupIndex = sortedGroups.findIndex((g) => g.id === groupId)
  const nextGroup =
    currentGroupIndex < sortedGroups.length - 1 ? sortedGroups[currentGroupIndex + 1] : null

  async function handleComplete() {
    setStatus('submitting')
    setErrorMessage('')
    try {
      const answers = characters.map((c) => ({ character: c.character, isCorrect: true }))
      await submitQuizResults(answers, kanaType)
      const storeError = useProgressStore.getState().error
      if (storeError === 'unauthorized') {
        setStatus('error')
        setErrorMessage('Sign in to save progress')
        return
      }
      if (storeError) {
        setStatus('error')
        setErrorMessage(storeError)
        return
      }
      setStatus('success')
    } catch {
      setStatus('error')
      setErrorMessage('Something went wrong. Please try again.')
    }
  }

  if (status === 'success') {
    return (
      <div>
        <Card className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950/30">
          <CardContent className="space-y-4 text-center">
            <div className="text-2xl">&#10003;</div>
            <p className="font-semibold text-foreground">Progress saved!</p>
            <p className="text-sm text-muted-foreground">
              {characters.length} characters from {groupName} are now in your review queue.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link href={`${routePrefix}/practice`}>
                <Button variant="primary" size="sm">
                  Practice Quiz
                </Button>
              </Link>
              {nextGroup ? (
                <Link href={`${routePrefix}/${nextGroup.id}`}>
                  <Button variant="outline" size="sm">
                    Next: {nextGroup.name}
                  </Button>
                </Link>
              ) : (
                <Link href={routePrefix}>
                  <Button variant="outline" size="sm">
                    Back to Overview
                  </Button>
                </Link>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div>
      <Card>
        <CardContent className="space-y-4 text-center">
          <p className="text-lg font-semibold text-foreground">Lesson Complete</p>
          <p className="text-sm text-muted-foreground">
            You&apos;ve reviewed all {characters.length} characters in {groupName}.
          </p>

          {allHaveProgress && status === 'idle' && (
            <p className="inline-block rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
              Already in your progress
            </p>
          )}

          {status === 'error' && (
            <p className="text-sm text-red-600 dark:text-red-400">{errorMessage}</p>
          )}

          <Button
            variant="primary"
            onClick={handleComplete}
            loading={status === 'submitting'}
            disabled={status === 'submitting'}
          >
            {allHaveProgress ? 'Review Again' : 'Complete Lesson'}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
