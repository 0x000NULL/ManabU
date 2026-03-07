import { NextRequest } from 'next/server'
import { getAuthUser } from '@/lib/auth'
import prisma from '@/lib/db'
import { mineSentenceSchema, minedSentenceQuerySchema } from '@/lib/validations/sentence'
import { createNewCard, getNextReviewDate } from '@/lib/utils/srs-algorithm'
import {
  successResponse,
  createdResponse,
  validationError,
  unauthorizedError,
  forbiddenError,
  serverError,
} from '@/lib/utils/api-response'
import { hasImmersionAccess } from '@/lib/utils/immersion-access'

export async function POST(request: NextRequest) {
  try {
    const user = await getAuthUser()
    if (!user) return unauthorizedError()
    if (!hasImmersionAccess(user.email)) return forbiddenError('Immersion access restricted')

    const body = await request.json()
    const result = mineSentenceSchema.safeParse(body)
    if (!result.success) {
      const details: Record<string, string[]> = {}
      for (const issue of result.error.issues) {
        const field = issue.path.join('.')
        if (!details[field]) details[field] = []
        details[field].push(issue.message)
      }
      return validationError('Invalid input', details)
    }

    const { japanese, english, sourceMediaId, sourceEpisode, sourceTimestamp, screenshotDataUrl, notes } =
      result.data
    const card = createNewCard()

    const [sentence] = await prisma.$transaction([
      prisma.minedSentence.create({
        data: {
          user_id: user.id,
          japanese,
          english: english ?? null,
          source_media_id: sourceMediaId ?? null,
          source_episode: sourceEpisode ?? null,
          source_timestamp: sourceTimestamp ?? null,
          screenshot_url: screenshotDataUrl ?? null,
          notes: notes ?? null,
        },
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
      }),
    ])

    // Create UserProgress for SRS tracking after getting the sentence ID
    await prisma.userProgress.create({
      data: {
        user_id: user.id,
        category: 'mined_sentence',
        item_id: sentence.id,
        repetitions: card.repetitions,
        ease_factor: card.easeFactor,
        interval: card.interval,
        next_review_at: getNextReviewDate(0),
        status: 'new',
      },
    })

    return createdResponse({
      id: sentence.id,
      japanese: sentence.japanese,
      english: sentence.english,
      sourceMediaId: sentence.source_media_id,
      sourceEpisode: sentence.source_episode,
      sourceTimestamp: sentence.source_timestamp,
      screenshotUrl: sentence.screenshot_url,
      notes: sentence.notes,
      createdAt: sentence.created_at.toISOString(),
    })
  } catch (error) {
    console.error('Mine sentence POST error:', error instanceof Error ? error.message : 'Unknown error')
    return serverError()
  }
}

export async function GET(request: NextRequest) {
  try {
    const user = await getAuthUser()
    if (!user) return unauthorizedError()
    if (!hasImmersionAccess(user.email)) return forbiddenError('Immersion access restricted')

    const params = Object.fromEntries(request.nextUrl.searchParams)
    const result = minedSentenceQuerySchema.safeParse(params)
    if (!result.success) {
      const details: Record<string, string[]> = {}
      for (const issue of result.error.issues) {
        const field = issue.path.join('.')
        if (!details[field]) details[field] = []
        details[field].push(issue.message)
      }
      return validationError('Invalid input', details)
    }

    const { limit, offset, search } = result.data

    const where = {
      user_id: user.id,
      ...(search && {
        japanese: { contains: search, mode: 'insensitive' as const },
      }),
    }

    const [sentences, total] = await Promise.all([
      prisma.minedSentence.findMany({
        where,
        orderBy: { created_at: 'desc' },
        skip: offset,
        take: limit,
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
      }),
      prisma.minedSentence.count({ where }),
    ])

    return successResponse(
      sentences.map((s) => ({
        id: s.id,
        japanese: s.japanese,
        english: s.english,
        sourceMediaId: s.source_media_id,
        sourceEpisode: s.source_episode,
        sourceTimestamp: s.source_timestamp,
        screenshotUrl: s.screenshot_url,
        notes: s.notes,
        createdAt: s.created_at.toISOString(),
      })),
      { total, limit, offset, hasMore: offset + limit < total },
    )
  } catch (error) {
    console.error('Mine sentence GET error:', error instanceof Error ? error.message : 'Unknown error')
    return serverError()
  }
}
