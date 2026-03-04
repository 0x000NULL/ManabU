'use client'

import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import type { MediaContentListItem } from '@/types/media'

interface MediaCardProps {
  item: MediaContentListItem
}

const difficultyColors: Record<string, string> = {
  beginner: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  intermediate: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  advanced: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
}

const placeholderColors: Record<string, string> = {
  anime: 'from-pink-500/20 to-purple-500/20',
  drama: 'from-blue-500/20 to-cyan-500/20',
  movie: 'from-amber-500/20 to-orange-500/20',
  youtube: 'from-red-500/20 to-rose-500/20',
}

export function MediaCard({ item }: MediaCardProps) {
  return (
    <Link href={`/immersion/${item.id}`}>
      <Card className="transition-shadow hover:shadow-md">
        {item.cover_image_url ? (
          <img
            src={item.cover_image_url}
            alt={item.title}
            className="h-32 w-full rounded-t-lg object-cover"
          />
        ) : (
          <div
            className={`flex h-32 items-center justify-center rounded-t-lg bg-gradient-to-br ${placeholderColors[item.type] ?? 'from-gray-500/20 to-gray-500/20'}`}
          >
            <span className="text-3xl font-bold text-foreground/30">
              {item.type.toUpperCase()}
            </span>
          </div>
        )}
        <CardContent className="space-y-2 pt-3">
          <h3 className="font-semibold text-foreground">{item.title}</h3>
          {item.title_english && (
            <p className="text-sm text-muted-foreground">{item.title_english}</p>
          )}
          {item.description && (
            <p className="line-clamp-2 text-xs text-muted-foreground">{item.description}</p>
          )}
          <div className="flex flex-wrap gap-1.5 pt-1">
            <span
              className={`rounded-full px-2 py-0.5 text-xs font-medium ${difficultyColors[item.difficulty] ?? 'bg-muted text-muted-foreground'}`}
            >
              {item.difficulty}
            </span>
            <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
              {item.type}
            </span>
            <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
              {item.episode_count} {item.episode_count === 1 ? 'episode' : 'episodes'}
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
