import { NextRequest } from 'next/server'
import { getAuthUser } from '@/lib/auth'
import prisma from '@/lib/db'
import { updateMinedSentenceSchema } from '@/lib/validations/sentence'
import { isValidId } from '@/lib/utils/validate-id'
import {
  successResponse,
  validationError,
  unauthorizedError,
  forbiddenError,
  notFoundError,
  serverError,
} from '@/lib/utils/api-response'
import { hasImmersionAccess } from '@/lib/utils/immersion-access'

interface RouteParams {
  params: Promise<{ id: string }>
}

export async function GET(_request: NextRequest, { params }: RouteParams) {
  try {
    const user = await getAuthUser()
    if (!user) return unauthorizedError()
    if (!hasImmersionAccess(user.email)) return forbiddenError('Immersion access restricted')

    const { id } = await params
    if (!isValidId(id)) return validationError('Invalid ID format')

    const sentence = await prisma.minedSentence.findFirst({
      where: { id, user_id: user.id },
      select: {
        id: true,
        japanese: true,
        english: true,
        source_media_id: true,
        source_episode: true,
        source_timestamp: true,
        screenshot_url: true,
        notes: true,
        created_at: true,
      },
    })

    if (!sentence) return notFoundError('Sentence not found')

    const progress = await prisma.userProgress.findUnique({
      where: {
        user_id_category_item_id: {
          user_id: user.id,
          category: 'mined_sentence',
          item_id: sentence.id,
        },
      },
      select: {
        status: true,
        repetitions: true,
        ease_factor: true,
        interval: true,
        next_review_at: true,
        last_reviewed_at: true,
        total_reviews: true,
        correct_reviews: true,
      },
    })

    return successResponse({
      id: sentence.id,
      japanese: sentence.japanese,
      english: sentence.english,
      sourceMediaId: sentence.source_media_id,
      sourceEpisode: sentence.source_episode,
      sourceTimestamp: sentence.source_timestamp,
      screenshotUrl: sentence.screenshot_url,
      notes: sentence.notes,
      createdAt: sentence.created_at.toISOString(),
      srs: progress
        ? {
            status: progress.status,
            repetitions: progress.repetitions,
            easeFactor: progress.ease_factor,
            interval: progress.interval,
            nextReviewAt: progress.next_review_at?.toISOString() ?? null,
            lastReviewedAt: progress.last_reviewed_at?.toISOString() ?? null,
            totalReviews: progress.total_reviews,
            correctReviews: progress.correct_reviews,
          }
        : null,
    })
  } catch (error) {
    console.error('Mine sentence GET [id] error:', error instanceof Error ? error.message : 'Unknown error')
    return serverError()
  }
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const user = await getAuthUser()
    if (!user) return unauthorizedError()
    if (!hasImmersionAccess(user.email)) return forbiddenError('Immersion access restricted')

    const { id } = await params
    if (!isValidId(id)) return validationError('Invalid ID format')

    const body = await request.json()
    const result = updateMinedSentenceSchema.safeParse(body)
    if (!result.success) {
      const details: Record<string, string[]> = {}
      for (const issue of result.error.issues) {
        const field = issue.path.join('.')
        if (!details[field]) details[field] = []
        details[field].push(issue.message)
      }
      return validationError('Invalid input', details)
    }

    const existing = await prisma.minedSentence.findFirst({
      where: { id, user_id: user.id },
      select: { id: true },
    })
    if (!existing) return notFoundError('Sentence not found')

    const data: Record<string, string | null> = {}
    if (result.data.notes !== undefined) data.notes = result.data.notes ?? null
    if (result.data.english !== undefined) data.english = result.data.english ?? null

    const updated = await prisma.minedSentence.update({
      where: { id },
      data,
      select: {
        id: true,
        japanese: true,
        english: true,
        notes: true,
        source_media_id: true,
        source_episode: true,
        source_timestamp: true,
        screenshot_url: true,
        created_at: true,
      },
    })

    return successResponse({
      id: updated.id,
      japanese: updated.japanese,
      english: updated.english,
      sourceMediaId: updated.source_media_id,
      sourceEpisode: updated.source_episode,
      sourceTimestamp: updated.source_timestamp,
      screenshotUrl: updated.screenshot_url,
      notes: updated.notes,
      createdAt: updated.created_at.toISOString(),
    })
  } catch (error) {
    console.error('Mine sentence PATCH error:', error instanceof Error ? error.message : 'Unknown error')
    return serverError()
  }
}

export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  try {
    const user = await getAuthUser()
    if (!user) return unauthorizedError()
    if (!hasImmersionAccess(user.email)) return forbiddenError('Immersion access restricted')

    const { id } = await params
    if (!isValidId(id)) return validationError('Invalid ID format')

    const existing = await prisma.minedSentence.findFirst({
      where: { id, user_id: user.id },
      select: { id: true },
    })
    if (!existing) return notFoundError('Sentence not found')

    await prisma.$transaction([
      prisma.userProgress.deleteMany({
        where: {
          user_id: user.id,
          category: 'mined_sentence',
          item_id: id,
        },
      }),
      prisma.minedSentence.delete({ where: { id } }),
    ])

    return successResponse({ deleted: true })
  } catch (error) {
    console.error('Mine sentence DELETE error:', error instanceof Error ? error.message : 'Unknown error')
    return serverError()
  }
}
