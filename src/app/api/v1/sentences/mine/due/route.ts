import { NextRequest } from 'next/server'
import { getAuthUser } from '@/lib/auth'
import prisma from '@/lib/db'
import {
  successResponse,
  unauthorizedError,
  serverError,
} from '@/lib/utils/api-response'

export async function GET(request: NextRequest) {
  try {
    const user = await getAuthUser()
    if (!user) return unauthorizedError()

    const limit = Math.min(
      Math.max(1, parseInt(request.nextUrl.searchParams.get('limit') ?? '50', 10) || 50),
      100,
    )

    const now = new Date()

    const dueProgress = await prisma.userProgress.findMany({
      where: {
        user_id: user.id,
        category: 'mined_sentence',
        next_review_at: { lte: now },
      },
      orderBy: { next_review_at: 'asc' },
      take: limit,
      select: {
        item_id: true,
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

    if (dueProgress.length === 0) {
      return successResponse({ dueCount: 0, items: [] })
    }

    const sentenceIds = dueProgress.map((p) => p.item_id)
    const sentences = await prisma.minedSentence.findMany({
      where: { id: { in: sentenceIds } },
      select: {
        id: true,
        japanese: true,
        english: true,
        screenshot_url: true,
        notes: true,
        source_media_id: true,
        source_episode: true,
        source_timestamp: true,
      },
    })

    // Also fetch media titles for source context
    const mediaIds = [...new Set(sentences.map((s) => s.source_media_id).filter(Boolean))] as string[]
    const mediaMap = new Map<string, { title: string; title_english: string | null }>()
    if (mediaIds.length > 0) {
      const media = await prisma.mediaContent.findMany({
        where: { id: { in: mediaIds } },
        select: { id: true, title: true, title_english: true },
      })
      for (const m of media) {
        mediaMap.set(m.id, { title: m.title, title_english: m.title_english })
      }
    }

    const sentenceMap = new Map(sentences.map((s) => [s.id, s]))

    // Total due count (may be more than the limit)
    const dueCount = await prisma.userProgress.count({
      where: {
        user_id: user.id,
        category: 'mined_sentence',
        next_review_at: { lte: now },
      },
    })

    const items = dueProgress
      .map((p) => {
        const s = sentenceMap.get(p.item_id)
        if (!s) return null
        const media = s.source_media_id ? mediaMap.get(s.source_media_id) : null
        return {
          id: s.id,
          japanese: s.japanese,
          english: s.english,
          screenshotUrl: s.screenshot_url,
          notes: s.notes,
          sourceMediaId: s.source_media_id,
          sourceEpisode: s.source_episode,
          sourceTimestamp: s.source_timestamp,
          mediaTitle: media?.title ?? null,
          mediaTitleEnglish: media?.title_english ?? null,
          srs: {
            repetitions: p.repetitions,
            easeFactor: p.ease_factor,
            interval: p.interval,
            status: p.status,
            nextReviewAt: p.next_review_at?.toISOString() ?? null,
            lastReviewedAt: p.last_reviewed_at?.toISOString() ?? null,
            totalReviews: p.total_reviews,
            correctReviews: p.correct_reviews,
          },
        }
      })
      .filter(Boolean)

    return successResponse({ dueCount, items })
  } catch (error) {
    console.error('Mine sentence due GET error:', error)
    return serverError()
  }
}
