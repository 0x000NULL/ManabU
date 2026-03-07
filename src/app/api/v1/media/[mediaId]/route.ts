import { getAuthUser } from '@/lib/auth'
import prisma from '@/lib/db'
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

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ mediaId: string }> },
) {
  try {
    const user = await getAuthUser()
    if (!user) return unauthorizedError()
    if (!hasImmersionAccess(user.email)) return forbiddenError('Immersion access restricted')

    const { mediaId } = await params
    if (!isValidId(mediaId)) return validationError('Invalid ID format')

    const media = await prisma.mediaContent.findUnique({
      where: { id: mediaId },
      select: {
        id: true,
        title: true,
        title_english: true,
        type: true,
        difficulty: true,
        jlpt_level: true,
        description: true,
        cover_image_url: true,
        genres: true,
        episodes: {
          orderBy: { episode_number: 'asc' },
          select: {
            id: true,
            episode_number: true,
            title: true,
            duration_seconds: true,
            subtitle_ja_url: true,
            subtitle_en_url: true,
          },
        },
      },
    })

    if (!media) return notFoundError('Media not found')

    const progressRecords = await prisma.userMediaProgress.findMany({
      where: { user_id: user.id, media_id: mediaId },
      select: {
        episode_number: true,
        progress_seconds: true,
        completed: true,
        watched_at: true,
      },
    })

    const progressMap = new Map(progressRecords.map((p) => [p.episode_number, p]))

    const episodes = media.episodes.map((ep) => {
      const prog = progressMap.get(ep.episode_number)
      return {
        ...ep,
        progress: prog
          ? {
              progress_seconds: prog.progress_seconds,
              completed: prog.completed,
              watched_at: prog.watched_at.toISOString(),
            }
          : null,
      }
    })

    const completedCount = progressRecords.filter((p) => p.completed).length

    return successResponse({
      id: media.id,
      title: media.title,
      title_english: media.title_english,
      type: media.type,
      difficulty: media.difficulty,
      jlpt_level: media.jlpt_level,
      description: media.description,
      cover_image_url: media.cover_image_url,
      genres: media.genres as string[],
      episode_count: media.episodes.length,
      completed_count: completedCount,
      episodes,
    })
  } catch (error) {
    console.error('Media detail GET error:', error instanceof Error ? error.message : 'Unknown error')
    return serverError()
  }
}
