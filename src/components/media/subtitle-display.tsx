'use client'

import { useMemo } from 'react'
import { cn } from '@/lib/utils/cn'
import { useSubtitleStore } from '@/store/subtitle-store'
import { findActiveSubtitles } from '@/lib/utils/subtitle-sync'
import type { SubtitleCue } from '@/lib/utils/subtitle-parser'
import type { SubtitleFontSize } from '@/types/subtitle'

const JA_FONT_SIZES: Record<SubtitleFontSize, string> = {
  small: 'text-base',
  medium: 'text-xl',
  large: 'text-3xl',
}

const EN_FONT_SIZES: Record<SubtitleFontSize, string> = {
  small: 'text-sm',
  medium: 'text-lg',
  large: 'text-2xl',
}

interface SubtitleDisplayProps {
  subtitlesJa: SubtitleCue[]
  subtitlesEn: SubtitleCue[]
  currentTime: number
}

export function SubtitleDisplay({ subtitlesJa, subtitlesEn, currentTime }: SubtitleDisplayProps) {
  const { showJapanese, showEnglish, fontSize } = useSubtitleStore()

  const active = useMemo(
    () => findActiveSubtitles(subtitlesJa, subtitlesEn, currentTime),
    [subtitlesJa, subtitlesEn, currentTime],
  )

  const jaText = showJapanese && active.ja ? active.ja.text : null
  const enText = showEnglish && active.en ? active.en.text : null

  if (!jaText && !enText) return null

  return (
    <div className="absolute bottom-14 left-0 right-0 flex flex-col items-center gap-1 px-4 pointer-events-none select-none">
      {jaText && (
        <span
          className={cn(
            'inline-block px-3 py-1 rounded bg-black/70 backdrop-blur-sm text-white font-medium text-center whitespace-pre-line leading-snug',
            JA_FONT_SIZES[fontSize],
          )}
        >
          {jaText}
        </span>
      )}
      {enText && (
        <span
          className={cn(
            'inline-block px-3 py-1 rounded bg-black/70 backdrop-blur-sm text-white/90 text-center whitespace-pre-line leading-snug',
            EN_FONT_SIZES[fontSize],
          )}
        >
          {enText}
        </span>
      )}
    </div>
  )
}
