'use client'

import { useCallback, useMemo } from 'react'
import { useQuizStore } from '@/store/quiz-store'
import { HIRAGANA_CHARACTERS } from '@/lib/constants/hiragana-data'
import { KATAKANA_CHARACTERS } from '@/lib/constants/katakana-data'
import { QuizProgressBar } from '@/components/hiragana/quiz-progress-bar'
import { QuizFeedback } from '@/components/hiragana/quiz-feedback'
import { RecognitionQuestion } from '@/components/hiragana/recognition-question'
import { TypingQuestion } from '@/components/hiragana/typing-question'
import { AudioQuestion } from '@/components/hiragana/audio-question'
import type { KanaGroup } from '@/types/kana'

interface QuizSessionProps {
  kanaLabel?: string
  groups?: KanaGroup[]
}

export function QuizSession({ kanaLabel, groups }: QuizSessionProps) {
  const question = useQuizStore((s) => s.questions[s.currentIndex] ?? null)
  const totalQuestions = useQuizStore((s) => s.questions.length)
  const answers = useQuizStore((s) => s.answers)
  const currentIndex = useQuizStore((s) => s.currentIndex)
  const showingFeedback = useQuizStore((s) => s.showingFeedback)
  const lastAnswerCorrect = useQuizStore((s) => s.lastAnswerCorrect)
  const config = useQuizStore((s) => s.config)
  const kanaType = useQuizStore((s) => s.kanaType)
  const availableCharacters = useMemo(() => {
    if (!config) return []
    const allChars = kanaType === 'katakana' ? KATAKANA_CHARACTERS : HIRAGANA_CHARACTERS
    return allChars.filter((c) => config.groupIds.includes(c.group))
  }, [config, kanaType])
  const submitAnswer = useQuizStore((s) => s.submitAnswer)
  const nextQuestion = useQuizStore((s) => s.nextQuestion)

  const handleAnswer = useCallback(
    (answer: string) => {
      if (!showingFeedback) {
        submitAnswer(answer)
      }
    },
    [showingFeedback, submitAnswer],
  )

  const handleNext = useCallback(() => {
    nextQuestion()
  }, [nextQuestion])

  if (!question) return null

  const lastAnswer = answers[answers.length - 1]

  return (
    <div className="space-y-6">
      <QuizProgressBar
        currentIndex={currentIndex}
        totalCount={totalQuestions}
        answers={answers}
      />

      <div className="py-4">
        {question.type === 'recognition' && (
          <RecognitionQuestion
            question={question}
            onAnswer={handleAnswer}
            showingFeedback={showingFeedback}
            userAnswer={lastAnswer?.userAnswer}
          />
        )}
        {question.type === 'typing' && (
          <TypingQuestion
            question={question}
            onAnswer={handleAnswer}
            showingFeedback={showingFeedback}
            userAnswer={lastAnswer?.userAnswer}
            availableCharacters={availableCharacters}
            kanaLabel={kanaLabel}
            groups={groups}
          />
        )}
        {question.type === 'audio' && (
          <AudioQuestion
            question={question}
            onAnswer={handleAnswer}
            showingFeedback={showingFeedback}
            userAnswer={lastAnswer?.userAnswer}
          />
        )}
      </div>

      {showingFeedback && lastAnswerCorrect !== null && (
        <QuizFeedback
          isCorrect={lastAnswerCorrect}
          question={question}
          userAnswer={lastAnswer?.userAnswer ?? ''}
          onNext={handleNext}
        />
      )}
    </div>
  )
}
