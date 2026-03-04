'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { formatTime } from '@/lib/utils/format-time'
import type { MediaContentDetailItem } from '@/types/media'

const difficultyColors: Record<string, string> = {
  beginner: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  intermediate: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  advanced: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
}

function getResumeEpisode(media: MediaContentDetailItem) {
  // 1. First in-progress episode
  const inProgress = media.episodes.find(
    (ep) => ep.progress && !ep.progress.completed && ep.progress.progress_seconds > 0
  )
  if (inProgress) {
    return { episode: inProgress, label: `Resume Episode ${inProgress.episode_number}` }
  }

  // 2. First unwatched episode
  const unwatched = media.episodes.find((ep) => !ep.progress)
  if (unwatched) {
    return { episode: unwatched, label: `Start Episode ${unwatched.episode_number}` }
  }

  // 3. Most recently watched episode
  const sorted = [...media.episodes]
    .filter((ep) => ep.progress)
    .sort(
      (a, b) =>
        new Date(b.progress!.watched_at).getTime() - new Date(a.progress!.watched_at).getTime()
    )
  if (sorted.length > 0) {
    return { episode: sorted[0], label: `Rewatch Episode ${sorted[0].episode_number}` }
  }

  // 4. Fallback to first episode
  if (media.episodes.length > 0) {
    return { episode: media.episodes[0], label: `Start Episode ${media.episodes[0].episode_number}` }
  }

  return null
}

export default function MediaDetailPage() {
  const { mediaId } = useParams<{ mediaId: string }>()
  const [media, setMedia] = useState<MediaContentDetailItem | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchMedia() {
      try {
        const res = await fetch(`/api/v1/media/${mediaId}`)
        if (!res.ok) {
          setError(res.status === 404 ? 'Media not found' : 'Failed to load media details')
          return
        }
        const json = await res.json()
        setMedia(json.data as MediaContentDetailItem)
      } catch {
        setError('Network error — please try again')
      }
    }
    fetchMedia()
  }, [mediaId])

  if (!media && !error) {
    return (
      <div className="flex flex-col items-center gap-3 py-12">
        <LoadingSpinner size="lg" />
        <p className="text-sm text-muted-foreground">Loading...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-4">
        <Link href="/immersion" className="text-sm text-primary hover:underline">
          &larr; Back to Immersion
        </Link>
        <div className="flex flex-col items-center gap-4 py-12 text-center">
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      </div>
    )
  }

  if (!media) return null

  const completedCount = media.episodes.filter((ep) => ep.progress?.completed).length
  const resumeInfo = getResumeEpisode(media)

  return (
    <div className="space-y-6">
      {/* Back link */}
      <Link href="/immersion" className="text-sm text-primary hover:underline">
        &larr; Back to Immersion
      </Link>

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">
          {media.title_english ?? media.title}
        </h1>
        {media.title_english && (
          <p className="mt-1 text-lg text-muted-foreground">{media.title}</p>
        )}
        <div className="mt-2 flex flex-wrap gap-1.5">
          <span
            className={`rounded-full px-2 py-0.5 text-xs font-medium ${difficultyColors[media.difficulty] ?? 'bg-muted text-muted-foreground'}`}
          >
            {media.difficulty}
          </span>
          <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
            {media.type}
          </span>
          {media.jlpt_level && (
            <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
              {media.jlpt_level}
            </span>
          )}
          {media.genres.map((genre) => (
            <span
              key={genre}
              className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground"
            >
              {genre}
            </span>
          ))}
        </div>
      </div>

      {/* Resume button */}
      {resumeInfo && (
        <Link href={`/immersion/watch/${mediaId}/${resumeInfo.episode.id}`}>
          <Button size="lg">{resumeInfo.label}</Button>
        </Link>
      )}

      {/* Description */}
      {media.description && <p className="text-sm text-muted-foreground">{media.description}</p>}

      {/* Progress card */}
      <Card>
        <CardContent className="pt-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-foreground">
              {completedCount} / {media.episode_count} episodes completed
            </span>
            <span className="text-xs text-muted-foreground">
              {media.episode_count > 0
                ? Math.round((completedCount / media.episode_count) * 100)
                : 0}
              %
            </span>
          </div>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-primary transition-all"
              style={{
                width: `${media.episode_count > 0 ? (completedCount / media.episode_count) * 100 : 0}%`,
              }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Episodes list */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-foreground">Episodes</h2>
        {media.episodes.map((ep) => (
          <Link
            key={ep.id}
            href={`/immersion/watch/${mediaId}/${ep.id}`}
            className="block"
          >
            <Card className="transition-shadow hover:shadow-md">
              <CardContent className="flex items-center gap-4 py-3">
                {/* Episode number circle */}
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted text-sm font-semibold text-foreground">
                  {ep.episode_number}
                </div>

                {/* Info */}
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-foreground">
                    {ep.title ?? `Episode ${ep.episode_number}`}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {ep.duration_seconds ? formatTime(ep.duration_seconds) : 'Unknown duration'}
                  </p>
                </div>

                {/* Status badge */}
                <div className="shrink-0">
                  {ep.progress?.completed ? (
                    <span className="rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-700 dark:bg-green-900/30 dark:text-green-400">
                      Completed
                    </span>
                  ) : ep.progress ? (
                    <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                      {formatTime(ep.progress.progress_seconds)}
                    </span>
                  ) : (
                    <span className="text-xs text-muted-foreground">Unwatched</span>
                  )}
                </div>

                {/* Chevron */}
                <svg
                  className="h-5 w-5 shrink-0 text-muted-foreground"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
