import { getAuthUser } from '@/lib/auth'
import prisma from '@/lib/db'
import { loadSubtitles } from '@/lib/utils/subtitle-parser'
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
  { params }: { params: Promise<{ mediaId: string; episodeId: string }> },
) {
  try {
    const user = await getAuthUser()
    if (!user) return unauthorizedError()
    if (!hasImmersionAccess(user.email)) return forbiddenError('Immersion access restricted')

    const { mediaId, episodeId } = await params
    if (!isValidId(mediaId) || !isValidId(episodeId)) return validationError('Invalid ID format')

    const episode = await prisma.mediaEpisode.findUnique({
      where: { id: episodeId },
      select: {
        id: true,
        media_id: true,
        episode_number: true,
        title: true,
        duration_seconds: true,
        video_url: true,
        subtitle_ja_url: true,
        subtitle_en_url: true,
        media: {
          select: {
            id: true,
            title: true,
            title_english: true,
          },
        },
      },
    })

    if (!episode || episode.media_id !== mediaId) {
      return notFoundError('Episode not found')
    }

    const [jaSubtitles, enSubtitles] = await Promise.all([
      episode.subtitle_ja_url ? loadSubtitles(episode.subtitle_ja_url) : null,
      episode.subtitle_en_url ? loadSubtitles(episode.subtitle_en_url) : null,
    ])

    const progress = await prisma.userMediaProgress.findUnique({
      where: {
        user_id_media_id_episode_number: {
          user_id: user.id,
          media_id: mediaId,
          episode_number: episode.episode_number,
        },
      },
      select: {
        progress_seconds: true,
        completed: true,
        watched_at: true,
      },
    })

    return successResponse({
      id: episode.id,
      episode_number: episode.episode_number,
      title: episode.title,
      duration_seconds: episode.duration_seconds,
      video_url: episode.video_url,
      subtitle_ja_url: episode.subtitle_ja_url,
      subtitle_en_url: episode.subtitle_en_url,
      media: episode.media,
      subtitles: {
        ja: jaSubtitles ?? [],
        en: enSubtitles ?? [],
      },
      progress: progress
        ? {
            progress_seconds: progress.progress_seconds,
            completed: progress.completed,
            watched_at: progress.watched_at.toISOString(),
          }
        : null,
    })
  } catch (error) {
    console.error('Episode detail GET error:', error instanceof Error ? error.message : 'Unknown error')
    return serverError()
  }
}
