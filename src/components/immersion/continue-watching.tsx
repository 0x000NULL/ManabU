'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { formatTime } from '@/lib/utils/format-time'
import type { RecentlyWatchedItem } from '@/types/media'

const placeholderColors: Record<string, string> = {
  anime: 'from-pink-500/20 to-purple-500/20',
  drama: 'from-blue-500/20 to-cyan-500/20',
  movie: 'from-amber-500/20 to-orange-500/20',
  youtube: 'from-red-500/20 to-rose-500/20',
}

export function ContinueWatchingSection() {
  const [items, setItems] = useState<RecentlyWatchedItem[]>([])

  useEffect(() => {
    async function fetchRecentlyWatched() {
      try {
        const res = await fetch('/api/v1/media/recently-watched')
        if (!res.ok) return
        const json = await res.json()
        setItems(json.data as RecentlyWatchedItem[])
      } catch {
        // Silently fail — section simply won't appear
      }
    }
    fetchRecentlyWatched()
  }, [])

  if (items.length === 0) return null

  return (
    <div className="space-y-3">
      <h2 className="text-xl font-semibold text-foreground">Continue Watching</h2>
      <div className="flex gap-4 overflow-x-auto pb-2">
        {items.map((item) => {
          const ep = item.last_episode
          const progressPercent =
            ep.duration_seconds && ep.duration_seconds > 0
              ? Math.min(100, Math.round((ep.progress_seconds / ep.duration_seconds) * 100))
              : 0

          return (
            <Link
              key={item.media_id}
              href={`/immersion/watch/${item.media_id}/${ep.episode_id}`}
              className="group min-w-[260px] max-w-[300px] shrink-0"
            >
              <div className="overflow-hidden rounded-lg border border-border bg-card transition-shadow hover:shadow-md">
                {/* Cover image or gradient placeholder */}
                <div className="relative h-28">
                  {item.cover_image_url ? (
                    <img
                      src={item.cover_image_url}
                      alt={item.title}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div
                      className={`flex h-full items-center justify-center bg-gradient-to-br ${placeholderColors[item.type] ?? 'from-gray-500/20 to-gray-500/20'}`}
                    >
                      <span className="text-2xl font-bold text-foreground/30">
                        {item.type.toUpperCase()}
                      </span>
                    </div>
                  )}
                  {/* Progress bar overlay at bottom of image */}
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-muted/50">
                    <div
                      className="h-full bg-primary transition-all"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>

                {/* Info */}
                <div className="space-y-1.5 p-3">
                  <p className="truncate text-sm font-semibold text-foreground">
                    {item.title_english ?? item.title}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Ep. {ep.episode_number}
                    {ep.title ? ` — ${ep.title}` : ''}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">
                      {ep.completed
                        ? 'Completed'
                        : ep.progress_seconds > 0
                          ? `${formatTime(ep.progress_seconds)}${ep.duration_seconds ? ` / ${formatTime(ep.duration_seconds)}` : ''}`
                          : 'Not started'}
                    </span>
                    <span className="text-xs font-medium text-primary group-hover:underline">
                      {ep.completed ? 'Rewatch' : 'Resume'}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
