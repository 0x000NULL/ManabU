import { getAuthUser } from '@/lib/auth'
import prisma from '@/lib/db'
import { successResponse, unauthorizedError, serverError } from '@/lib/utils/api-response'
import type { RecentlyWatchedItem } from '@/types/media'

export async function GET() {
  try {
    const user = await getAuthUser()
    if (!user) return unauthorizedError()

    // Fetch all user media progress, most recent first
    const progressRecords = await prisma.userMediaProgress.findMany({
      where: { user_id: user.id },
      orderBy: { watched_at: 'desc' },
      select: {
        media_id: true,
        episode_number: true,
        progress_seconds: true,
        completed: true,
        watched_at: true,
      },
    })

    if (progressRecords.length === 0) {
      return successResponse([])
    }

    // Group by media_id, keep only the most recent episode per media
    const byMedia = new Map<
      string,
      (typeof progressRecords)[number]
    >()
    for (const record of progressRecords) {
      if (!byMedia.has(record.media_id)) {
        byMedia.set(record.media_id, record)
      }
    }

    // Take top 6
    const recentMedia = Array.from(byMedia.entries()).slice(0, 6)
    const mediaIds = recentMedia.map(([id]) => id)

    // Batch-fetch media content, episodes, and completed counts
    const [mediaItems, episodes, completedCounts] = await Promise.all([
      prisma.mediaContent.findMany({
        where: { id: { in: mediaIds } },
        select: {
          id: true,
          title: true,
          title_english: true,
          type: true,
          difficulty: true,
          cover_image_url: true,
          _count: { select: { episodes: true } },
        },
      }),
      prisma.mediaEpisode.findMany({
        where: {
          media_id: { in: mediaIds },
          episode_number: {
            in: recentMedia.map(([, record]) => record.episode_number),
          },
        },
        select: {
          id: true,
          media_id: true,
          episode_number: true,
          title: true,
          duration_seconds: true,
        },
      }),
      prisma.userMediaProgress.groupBy({
        by: ['media_id'],
        where: {
          user_id: user.id,
          media_id: { in: mediaIds },
          completed: true,
        },
        _count: true,
      }),
    ])

    const mediaMap = new Map(mediaItems.map((m) => [m.id, m]))
    const completedMap = new Map(
      completedCounts.map((c) => [c.media_id, c._count])
    )

    // Build episode lookup keyed by media_id + episode_number
    const episodeMap = new Map(
      episodes.map((ep) => [`${ep.media_id}:${ep.episode_number}`, ep])
    )

    const data: RecentlyWatchedItem[] = []
    for (const [mediaId, record] of recentMedia) {
      const media = mediaMap.get(mediaId)
      if (!media) continue

      const episode = episodeMap.get(`${mediaId}:${record.episode_number}`)
      if (!episode) continue

      data.push({
        media_id: mediaId,
        title: media.title,
        title_english: media.title_english,
        type: media.type,
        difficulty: media.difficulty,
        cover_image_url: media.cover_image_url,
        episode_count: media._count.episodes,
        completed_count: completedMap.get(mediaId) ?? 0,
        last_episode: {
          episode_id: episode.id,
          episode_number: episode.episode_number,
          title: episode.title,
          duration_seconds: episode.duration_seconds,
          progress_seconds: record.progress_seconds,
          completed: record.completed,
          watched_at: record.watched_at.toISOString(),
        },
      })
    }

    return successResponse(data)
  } catch (error) {
    console.error('Recently watched GET error:', error)
    return serverError()
  }
}
