'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useParams } from 'next/navigation'
import { VideoPlayer } from '@/components/media/video-player'
import type { SubtitleCue } from '@/lib/utils/subtitle-parser'
import { LoadingSpinner } from '@/components/ui/loading-spinner'

const PROGRESS_SAVE_INTERVAL = 30_000

interface EpisodeData {
  id: string
  episode_number: number
  title: string | null
  duration_seconds: number | null
  video_url: string | null
  media: {
    id: string
    title: string
    title_english: string | null
  }
  subtitles: {
    ja: SubtitleCue[]
    en: SubtitleCue[]
  }
  progress: {
    progress_seconds: number
    completed: boolean
  } | null
}

export default function WatchPage() {
  const params = useParams<{ mediaId: string; episodeId: string }>()
  const [episode, setEpisode] = useState<EpisodeData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const currentTimeRef = useRef(0)
  const saveTimerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const isSavingRef = useRef(false)

  // -- Fetch episode data --

  useEffect(() => {
    async function fetchEpisode() {
      try {
        const res = await fetch(`/api/v1/media/${params.mediaId}/episodes/${params.episodeId}`)
        const json = await res.json()
        if (!json.success) {
          setError(json.error?.message ?? 'Failed to load episode')
          return
        }
        setEpisode(json.data)
      } catch {
        setError('Failed to load episode')
      } finally {
        setLoading(false)
      }
    }

    fetchEpisode()
  }, [params.mediaId, params.episodeId])

  // -- Save progress --

  const saveProgress = useCallback(
    async (completed = false) => {
      if (!episode || isSavingRef.current) return
      isSavingRef.current = true

      try {
        await fetch('/api/v1/media/progress', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            mediaId: episode.media.id,
            episodeNumber: episode.episode_number,
            progressSeconds: Math.floor(currentTimeRef.current),
            completed,
          }),
        })
      } catch {
        // Silently ignore save errors to not disrupt playback
      } finally {
        isSavingRef.current = false
      }
    },
    [episode],
  )

  // -- Auto-save interval --

  useEffect(() => {
    if (!episode) return

    saveTimerRef.current = setInterval(() => {
      saveProgress()
    }, PROGRESS_SAVE_INTERVAL)

    return () => {
      if (saveTimerRef.current) clearInterval(saveTimerRef.current)
    }
  }, [episode, saveProgress])

  // -- Save on page unload --

  useEffect(() => {
    function handleBeforeUnload() {
      if (!episode) return
      const body = JSON.stringify({
        mediaId: episode.media.id,
        episodeNumber: episode.episode_number,
        progressSeconds: Math.floor(currentTimeRef.current),
        completed: false,
      })
      navigator.sendBeacon('/api/v1/media/progress', new Blob([body], { type: 'application/json' }))
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [episode])

  function handleTimeUpdate(seconds: number) {
    currentTimeRef.current = seconds
  }

  function handleEnded() {
    saveProgress(true)
  }

  // -- Loading state --

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  // -- Error state --

  if (error || !episode) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <p className="text-lg font-medium text-foreground">{error ?? 'Episode not found'}</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Please check the URL and try again.
          </p>
        </div>
      </div>
    )
  }

  // -- Render --

  return (
    <div className="space-y-4">
      <div>
        <p className="text-sm text-muted-foreground">
          {episode.media.title_english ?? episode.media.title}
        </p>
        <h1 className="text-xl font-semibold text-foreground">
          Episode {episode.episode_number}
          {episode.title ? ` — ${episode.title}` : ''}
        </h1>
      </div>

      <VideoPlayer
        src={episode.video_url}
        initialTime={episode.progress?.progress_seconds ?? 0}
        subtitlesJa={episode.subtitles.ja}
        subtitlesEn={episode.subtitles.en}
        mediaId={episode.media.id}
        episodeNumber={episode.episode_number}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
        className="w-full max-w-4xl"
      />
    </div>
  )
}
