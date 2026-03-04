import { NextRequest } from 'next/server'
import { getAuthUser } from '@/lib/auth'
import prisma from '@/lib/db'
import { mediaProgressSchema, mediaProgressQuerySchema } from '@/lib/validations/media'
import {
  successResponse,
  validationError,
  unauthorizedError,
  notFoundError,
  serverError,
} from '@/lib/utils/api-response'

export async function GET(request: NextRequest) {
  try {
    const user = await getAuthUser()
    if (!user) return unauthorizedError()

    const params = Object.fromEntries(request.nextUrl.searchParams)
    const result = mediaProgressQuerySchema.safeParse(params)
    if (!result.success) {
      const details: Record<string, string[]> = {}
      for (const issue of result.error.issues) {
        const field = issue.path.join('.')
        if (!details[field]) details[field] = []
        details[field].push(issue.message)
      }
      return validationError('Invalid query parameters', details)
    }

    const { mediaId } = result.data

    const media = await prisma.mediaContent.findUnique({
      where: { id: mediaId },
      select: {
        id: true,
        _count: { select: { episodes: true } },
      },
    })

    if (!media) return notFoundError('Media not found')

    const progressRecords = await prisma.userMediaProgress.findMany({
      where: { user_id: user.id, media_id: mediaId },
      orderBy: { episode_number: 'asc' },
      select: {
        episode_number: true,
        progress_seconds: true,
        completed: true,
        watched_at: true,
      },
    })

    const completedCount = progressRecords.filter((p) => p.completed).length

    return successResponse({
      mediaId,
      totalEpisodes: media._count.episodes,
      completedCount,
      episodes: progressRecords.map((p) => ({
        episode_number: p.episode_number,
        progress_seconds: p.progress_seconds,
        completed: p.completed,
        watched_at: p.watched_at.toISOString(),
      })),
    })
  } catch (error) {
    console.error('Media progress GET error:', error)
    return serverError()
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getAuthUser()
    if (!user) return unauthorizedError()

    const body = await request.json()
    const result = mediaProgressSchema.safeParse(body)
    if (!result.success) {
      const details: Record<string, string[]> = {}
      for (const issue of result.error.issues) {
        const field = issue.path.join('.')
        if (!details[field]) details[field] = []
        details[field].push(issue.message)
      }
      return validationError('Invalid input', details)
    }

    const { mediaId, episodeNumber, progressSeconds, completed } = result.data

    const episode = await prisma.mediaEpisode.findUnique({
      where: {
        media_id_episode_number: {
          media_id: mediaId,
          episode_number: episodeNumber,
        },
      },
      select: { id: true },
    })

    if (!episode) return notFoundError('Episode not found')

    const progress = await prisma.userMediaProgress.upsert({
      where: {
        user_id_media_id_episode_number: {
          user_id: user.id,
          media_id: mediaId,
          episode_number: episodeNumber,
        },
      },
      create: {
        user_id: user.id,
        media_id: mediaId,
        episode_number: episodeNumber,
        progress_seconds: progressSeconds,
        completed,
      },
      update: {
        progress_seconds: progressSeconds,
        completed,
        watched_at: new Date(),
      },
      select: {
        id: true,
        episode_number: true,
        progress_seconds: true,
        completed: true,
        watched_at: true,
      },
    })

    return successResponse({
      id: progress.id,
      episode_number: progress.episode_number,
      progress_seconds: progress.progress_seconds,
      completed: progress.completed,
      watched_at: progress.watched_at.toISOString(),
    })
  } catch (error) {
    console.error('Media progress POST error:', error)
    return serverError()
  }
}
