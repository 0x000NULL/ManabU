'use client'

import { cn } from '@/lib/utils/cn'
import { useSubtitleStore } from '@/store/subtitle-store'
import type { SubtitleFontSize } from '@/types/subtitle'

const FONT_SIZE_LABELS: Record<SubtitleFontSize, string> = {
  small: 'S',
  medium: 'M',
  large: 'L',
}

interface SubtitleControlsProps {
  hasJaSubtitles: boolean
  hasEnSubtitles: boolean
}

export function SubtitleControls({ hasJaSubtitles, hasEnSubtitles }: SubtitleControlsProps) {
  const { showJapanese, showEnglish, fontSize, toggleJapanese, toggleEnglish, cycleFontSize } =
    useSubtitleStore()

  if (!hasJaSubtitles && !hasEnSubtitles) return null

  return (
    <div className="flex items-center gap-1 shrink-0">
      {hasJaSubtitles && (
        <button
          type="button"
          onClick={toggleJapanese}
          className={cn(
            'text-xs font-medium px-1.5 py-0.5 rounded transition-colors',
            showJapanese
              ? 'text-white bg-white/20'
              : 'text-white/40 hover:text-white/60',
          )}
          aria-label={showJapanese ? 'Hide Japanese subtitles' : 'Show Japanese subtitles'}
          title="Toggle Japanese subtitles (J)"
        >
          JA
        </button>
      )}
      {hasEnSubtitles && (
        <button
          type="button"
          onClick={toggleEnglish}
          className={cn(
            'text-xs font-medium px-1.5 py-0.5 rounded transition-colors',
            showEnglish
              ? 'text-white bg-white/20'
              : 'text-white/40 hover:text-white/60',
          )}
          aria-label={showEnglish ? 'Hide English subtitles' : 'Show English subtitles'}
          title="Toggle English subtitles (E)"
        >
          EN
        </button>
      )}
      <button
        type="button"
        onClick={cycleFontSize}
        className="text-xs font-medium text-white/80 hover:text-white px-1.5 py-0.5 rounded transition-colors"
        aria-label={`Font size: ${fontSize}`}
        title="Cycle subtitle font size"
      >
        {FONT_SIZE_LABELS[fontSize]}
      </button>
    </div>
  )
}
