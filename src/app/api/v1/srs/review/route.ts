import { NextRequest } from 'next/server'
import { getAuthUser } from '@/lib/auth'
import prisma from '@/lib/db'
import { srsReviewSchema } from '@/lib/validations/srs'
import { calculateNextReview } from '@/lib/utils/srs-algorithm'
import type { SRSCard } from '@/types/progress'
import { recordStudyActivity } from '@/lib/utils/study-day'
import {
  successResponse,
  validationError,
  unauthorizedError,
  notFoundError,
  serverError,
} from '@/lib/utils/api-response'

export async function POST(request: NextRequest) {
  try {
    const user = await getAuthUser()
    if (!user) return unauthorizedError()

    const body = await request.json()
    const result = srsReviewSchema.safeParse(body)
    if (!result.success) {
      const details: Record<string, string[]> = {}
      for (const issue of result.error.issues) {
        const field = issue.path.join('.')
        if (!details[field]) details[field] = []
        details[field].push(issue.message)
      }
      return validationError('Invalid input', details)
    }

    const { itemId, rating } = result.data

    const vocab = await prisma.vocabulary.findUnique({
      where: { id: itemId },
      select: { id: true },
    })
    if (!vocab) return notFoundError('Vocabulary item not found')

    const progress = await prisma.userProgress.findUnique({
      where: {
        user_id_category_item_id: {
          user_id: user.id,
          category: 'vocabulary',
          item_id: itemId,
        },
      },
    })
    if (!progress) return notFoundError('No progress record found — use /srs/learn first')

    const card: SRSCard = {
      repetitions: progress.repetitions,
      easeFactor: progress.ease_factor,
      interval: progress.interval,
    }

    const reviewResult = calculateNextReview(card, rating)
    const isCorrect = rating === 'good' || rating === 'easy'

    const updated = await prisma.userProgress.update({
      where: { id: progress.id },
      data: {
        repetitions: reviewResult.repetitions,
        ease_factor: reviewResult.easeFactor,
        interval: reviewResult.interval,
        status: reviewResult.status,
        next_review_at: reviewResult.nextReviewAt,
        last_reviewed_at: new Date(),
        total_reviews: { increment: 1 },
        ...(isCorrect && { correct_reviews: { increment: 1 } }),
      },
      select: {
        id: true,
        repetitions: true,
        ease_factor: true,
        interval: true,
        status: true,
        next_review_at: true,
        last_reviewed_at: true,
        total_reviews: true,
        correct_reviews: true,
      },
    })

    await recordStudyActivity(user.id, { itemsReviewed: 1 })

    return successResponse({
      id: updated.id,
      repetitions: updated.repetitions,
      easeFactor: updated.ease_factor,
      interval: updated.interval,
      status: updated.status,
      nextReviewAt: updated.next_review_at?.toISOString() ?? null,
      lastReviewedAt: updated.last_reviewed_at?.toISOString() ?? null,
      totalReviews: updated.total_reviews,
      correctReviews: updated.correct_reviews,
    })
  } catch (error) {
    console.error('SRS review POST error:', error)
    return serverError()
  }
}
