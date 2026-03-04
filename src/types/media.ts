export type MediaType = 'anime' | 'drama' | 'movie' | 'youtube'

export type MediaDifficulty = 'beginner' | 'intermediate' | 'advanced'

/** Episode shape used in the constants file for seeding */
export interface MediaEpisodeData {
  episode_number: number
  title: string
  title_english: string
  duration_seconds: number
  video_url?: string
  subtitle_ja_url: string
  subtitle_en_url: string
}

/** Shape used in the constants file for seeding */
export interface MediaContentData {
  title: string
  title_english: string
  type: MediaType
  difficulty: MediaDifficulty
  jlpt_level: string
  description: string
  genres: string[]
  streaming_url: string
  subtitle_source: string
  episodes: MediaEpisodeData[]
}

/** API list response item */
export interface MediaContentListItem {
  id: string
  title: string
  title_english: string | null
  type: string
  difficulty: string
  jlpt_level: string | null
  description: string | null
  cover_image_url: string | null
  genres: string[]
  episode_count: number
}

/** API detail response — full content with episodes */
export interface MediaContentDetailItem extends MediaContentListItem {
  completed_count: number
  episodes: {
    id: string
    episode_number: number
    title: string | null
    duration_seconds: number | null
    subtitle_ja_url: string | null
    subtitle_en_url: string | null
    progress: {
      progress_seconds: number
      completed: boolean
      watched_at: string
    } | null
  }[]
}

export interface ImmersionStats {
  episodesWatched: number
  episodesCompleted: number
  totalImmersionMinutes: number
  sentencesMined: number
  sentencesDueCount: number
  weeklyImmersion: WeeklyImmersionEntry[]
}

export interface WeeklyImmersionEntry {
  weekStart: string
  minutes: number
}
