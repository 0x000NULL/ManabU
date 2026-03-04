import { NextRequest } from 'next/server'
import { getAuthUser } from '@/lib/auth'
import prisma from '@/lib/db'
import { srsLearnSchema } from '@/lib/validations/srs'
import { createNewCard, getNextReviewDate } from '@/lib/utils/srs-algorithm'
import { recordStudyActivity } from '@/lib/utils/study-day'
import {
  successResponse,
  createdResponse,
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
    const result = srsLearnSchema.safeParse(body)
    if (!result.success) {
      const details: Record<string, string[]> = {}
      for (const issue of result.error.issues) {
        const field = issue.path.join('.')
        if (!details[field]) details[field] = []
        details[field].push(issue.message)
      }
      return validationError('Invalid input', details)
    }

    const { itemId } = result.data

    const vocab = await prisma.vocabulary.findUnique({
      where: { id: itemId },
      select: { id: true },
    })
    if (!vocab) return notFoundError('Vocabulary item not found')

    const existing = await prisma.userProgress.findUnique({
      where: {
        user_id_category_item_id: {
          user_id: user.id,
          category: 'vocabulary',
          item_id: itemId,
        },
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
        created_at: true,
      },
    })

    if (existing) {
      return successResponse({
        alreadyExists: true,
        progress: {
          id: existing.id,
          repetitions: existing.repetitions,
          easeFactor: existing.ease_factor,
          interval: existing.interval,
          status: existing.status,
          nextReviewAt: existing.next_review_at?.toISOString() ?? null,
          lastReviewedAt: existing.last_reviewed_at?.toISOString() ?? null,
          totalReviews: existing.total_reviews,
          correctReviews: existing.correct_reviews,
          createdAt: existing.created_at.toISOString(),
        },
      })
    }

    const card = createNewCard()
    const progress = await prisma.userProgress.create({
      data: {
        user_id: user.id,
        category: 'vocabulary',
        item_id: itemId,
        repetitions: card.repetitions,
        ease_factor: card.easeFactor,
        interval: card.interval,
        next_review_at: getNextReviewDate(0),
        status: 'new',
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
        created_at: true,
      },
    })

    await recordStudyActivity(user.id, { itemsLearned: 1 })

    return createdResponse({
      alreadyExists: false,
      progress: {
        id: progress.id,
        repetitions: progress.repetitions,
        easeFactor: progress.ease_factor,
        interval: progress.interval,
        status: progress.status,
        nextReviewAt: progress.next_review_at?.toISOString() ?? null,
        lastReviewedAt: progress.last_reviewed_at?.toISOString() ?? null,
        totalReviews: progress.total_reviews,
        correctReviews: progress.correct_reviews,
        createdAt: progress.created_at.toISOString(),
      },
    })
  } catch (error) {
    console.error('SRS learn POST error:', error)
    return serverError()
  }
}
