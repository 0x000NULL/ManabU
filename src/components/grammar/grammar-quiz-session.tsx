'use client'

import { useCallback } from 'react'
import { useGrammarQuizStore } from '@/store/grammar-quiz-store'
import { GrammarQuizFeedback } from '@/components/grammar/grammar-quiz-feedback'
import { FillInBlankQuestion } from '@/components/grammar/fill-in-blank-question'
import { MultipleChoiceQuestion } from '@/components/grammar/multiple-choice-question'

export function GrammarQuizSession() {
  const question = useGrammarQuizStore((s) => s.questions[s.currentIndex] ?? null)
  const totalQuestions = useGrammarQuizStore((s) => s.questions.length)
  const answers = useGrammarQuizStore((s) => s.answers)
  const currentIndex = useGrammarQuizStore((s) => s.currentIndex)
  const showingFeedback = useGrammarQuizStore((s) => s.showingFeedback)
  const lastAnswerCorrect = useGrammarQuizStore((s) => s.lastAnswerCorrect)
  const submitAnswer = useGrammarQuizStore((s) => s.submitAnswer)
  const nextQuestion = useGrammarQuizStore((s) => s.nextQuestion)

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
      {/* Progress bar */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium text-foreground">
            {Math.min(currentIndex + 1, totalQuestions)} / {totalQuestions}
          </span>
          <span className="text-muted-foreground">
            {answers.filter((a) => a.isCorrect).length} correct
          </span>
        </div>
        <div className="flex h-2 gap-0.5 overflow-hidden rounded-full bg-muted">
          {Array.from({ length: totalQuestions }).map((_, i) => {
            const answer = answers[i]
            let colorClass = 'bg-transparent'
            if (answer?.isCorrect) colorClass = 'bg-green-500'
            else if (answer && !answer.isCorrect) colorClass = 'bg-red-500'
            else if (i === currentIndex) colorClass = 'bg-primary/40'

            return <div key={i} className={`h-full flex-1 transition-colors ${colorClass}`} />
          })}
        </div>
      </div>

      {/* Pattern label */}
      <div className="text-center">
        <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
          {question.pattern}
        </span>
      </div>

      {/* Question */}
      <div className="py-4">
        {question.type === 'fill_in_blank' && (
          <FillInBlankQuestion
            question={question}
            onAnswer={handleAnswer}
            showingFeedback={showingFeedback}
            userAnswer={lastAnswer?.userAnswer}
          />
        )}
        {question.type === 'multiple_choice' && (
          <MultipleChoiceQuestion
            question={question}
            onAnswer={handleAnswer}
            showingFeedback={showingFeedback}
            userAnswer={lastAnswer?.userAnswer}
          />
        )}
      </div>

      {/* Feedback */}
      {showingFeedback && lastAnswerCorrect !== null && (
        <GrammarQuizFeedback
          isCorrect={lastAnswerCorrect}
          question={question}
          onNext={handleNext}
        />
      )}
    </div>
  )
}
