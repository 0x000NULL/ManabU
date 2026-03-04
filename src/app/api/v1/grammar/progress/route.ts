import { NextRequest } from 'next/server'
import { getAuthUser } from '@/lib/auth'
import prisma from '@/lib/db'
import { grammarQuizResultSchema } from '@/lib/validations/grammar'
import { processReview } from '@/lib/utils/srs-lite'
import { recordStudyActivity } from '@/lib/utils/study-day'
import {
  successResponse,
  validationError,
  unauthorizedError,
  serverError,
} from '@/lib/utils/api-response'

export async function GET() {
  try {
    const user = await getAuthUser()
    if (!user) return unauthorizedError()

    const [total, progressRecords] = await Promise.all([
      prisma.grammarPattern.count(),
      prisma.userProgress.findMany({
        where: { user_id: user.id, category: 'grammar' },
        select: { status: true },
      }),
    ])

    const learned = progressRecords.filter((p) => p.status !== 'new').length
    const mastered = progressRecords.filter((p) => p.status === 'mastered').length

    return successResponse({ total, learned, mastered })
  } catch (error) {
    console.error('Grammar progress GET error:', error)
    return serverError()
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getAuthUser()
    if (!user) return unauthorizedError()

    const body = await request.json()
    const result = grammarQuizResultSchema.safeParse(body)
    if (!result.success) {
      const details: Record<string, string[]> = {}
      for (const issue of result.error.issues) {
        const field = issue.path.join('.')
        if (!details[field]) details[field] = []
        details[field].push(issue.message)
      }
      return validationError('Invalid input', details)
    }

    const { answers } = result.data

    // Verify pattern IDs exist
    const uniquePatternIds = [...new Set(answers.map((a) => a.patternId))]
    const patternRecords = await prisma.grammarPattern.findMany({
      where: { id: { in: uniquePatternIds } },
      select: { id: true },
    })
    const validIds = new Set(patternRecords.map((p) => p.id))

    // Aggregate per pattern (majority wins)
    const patternCounts = new Map<string, { correct: number; total: number }>()
    for (const answer of answers) {
      if (!validIds.has(answer.patternId)) continue
      const counts = patternCounts.get(answer.patternId) ?? { correct: 0, total: 0 }
      counts.total++
      if (answer.isCorrect) counts.correct++
      patternCounts.set(answer.patternId, counts)
    }

    const aggregated = new Map<string, boolean>()
    for (const [patternId, counts] of patternCounts) {
      aggregated.set(patternId, counts.correct / counts.total > 0.5)
    }

    const existingGrammarProgress = await prisma.userProgress.findMany({
      where: { user_id: user.id, category: 'grammar', item_id: { in: [...validIds] } },
      select: { item_id: true },
    })
    const existingGrammarIds = new Set(existingGrammarProgress.map((p) => p.item_id))

    // Upsert progress in a transaction
    await prisma.$transaction(async (tx) => {
      for (const [patternId, isCorrect] of aggregated) {
        const existing = await tx.userProgress.findUnique({
          where: {
            user_id_category_item_id: {
              user_id: user.id,
              category: 'grammar',
              item_id: patternId,
            },
          },
          select: { repetitions: true, total_reviews: true, correct_reviews: true },
        })

        const currentReps = existing?.repetitions ?? 0
        const srsUpdate = processReview(currentReps, isCorrect)
        const counts = patternCounts.get(patternId)!

        await tx.userProgress.upsert({
          where: {
            user_id_category_item_id: {
              user_id: user.id,
              category: 'grammar',
              item_id: patternId,
            },
          },
          create: {
            user_id: user.id,
            category: 'grammar',
            item_id: patternId,
            repetitions: srsUpdate.repetitions,
            interval: srsUpdate.interval,
            next_review_at: srsUpdate.nextReviewAt,
            last_reviewed_at: new Date(),
            status: srsUpdate.status,
            total_reviews: counts.total,
            correct_reviews: counts.correct,
          },
          update: {
            repetitions: srsUpdate.repetitions,
            interval: srsUpdate.interval,
            next_review_at: srsUpdate.nextReviewAt,
            last_reviewed_at: new Date(),
            status: srsUpdate.status,
            total_reviews: { increment: counts.total },
            correct_reviews: { increment: counts.correct },
          },
        })
      }
    })

    const newlyLearnedGrammar = [...validIds].filter((id) => !existingGrammarIds.has(id)).length
    await recordStudyActivity(user.id, {
      itemsReviewed: answers.length,
      itemsLearned: newlyLearnedGrammar,
    })

    // Return updated counts
    const [total, progressRecords] = await Promise.all([
      prisma.grammarPattern.count(),
      prisma.userProgress.findMany({
        where: { user_id: user.id, category: 'grammar' },
        select: { status: true },
      }),
    ])

    const learned = progressRecords.filter((p) => p.status !== 'new').length
    const mastered = progressRecords.filter((p) => p.status === 'mastered').length

    return successResponse({ total, learned, mastered })
  } catch (error) {
    console.error('Grammar progress POST error:', error)
    return serverError()
  }
}
