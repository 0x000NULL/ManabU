'use client'

import { useCallback } from 'react'
import { useQuizStore } from '@/store/quiz-store'
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
  const question = useQuizStore((s) => s.currentQuestion())
  const progress = useQuizStore((s) => s.progress())
  const answers = useQuizStore((s) => s.answers)
  const currentIndex = useQuizStore((s) => s.currentIndex)
  const showingFeedback = useQuizStore((s) => s.showingFeedback)
  const lastAnswerCorrect = useQuizStore((s) => s.lastAnswerCorrect)
  const availableCharacters = useQuizStore((s) => s.availableCharacters())
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
        totalCount={progress.total}
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
