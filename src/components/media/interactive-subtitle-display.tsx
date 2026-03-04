'use client'

import { useMemo, useRef, useCallback, useState, useEffect } from 'react'
import { cn } from '@/lib/utils/cn'
import { useSubtitleStore } from '@/store/subtitle-store'
import { useDictionaryStore } from '@/store/dictionary-store'
import { findActiveSubtitles } from '@/lib/utils/subtitle-sync'
import { ClickableWord } from '@/components/media/clickable-word'
import type { SubtitleCue } from '@/lib/utils/subtitle-parser'
import type { SubtitleFontSize, TokenizedWord } from '@/types/subtitle'

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

// Module-level token cache (persists across renders, not tied to React state)
const tokenCache = new Map<string, TokenizedWord[]>()

interface InteractiveSubtitleDisplayProps {
  subtitlesJa: SubtitleCue[]
  subtitlesEn: SubtitleCue[]
  currentTime: number
  onPauseRequest: () => void
  onMineRequest?: (ja: SubtitleCue, en: SubtitleCue | null) => void
}

export function InteractiveSubtitleDisplay({
  subtitlesJa,
  subtitlesEn,
  currentTime,
  onPauseRequest,
  onMineRequest,
}: InteractiveSubtitleDisplayProps) {
  const { showJapanese, showEnglish, fontSize } = useSubtitleStore()
  const closePopup = useDictionaryStore((s) => s.closePopup)
  const openPopup = useDictionaryStore((s) => s.openPopup)

  // Counter to trigger re-renders when cache is populated
  const [cacheVersion, setCacheVersion] = useState(0)
  const prevJaTextRef = useRef<string | null>(null)

  const active = useMemo(
    () => findActiveSubtitles(subtitlesJa, subtitlesEn, currentTime),
    [subtitlesJa, subtitlesEn, currentTime],
  )

  const jaText = showJapanese && active.ja ? active.ja.text : null
  const enText = showEnglish && active.en ? active.en.text : null

  // Close popup when active cue changes
  useEffect(() => {
    if (prevJaTextRef.current !== jaText) {
      closePopup()
      prevJaTextRef.current = jaText
    }
  }, [jaText, closePopup])

  // Resolve tokens from module-level cache
  const tokenizedText = useMemo(() => {
    if (!jaText) return null
    // cacheVersion dependency ensures re-evaluation after async fetch
    void cacheVersion
    return tokenCache.get(jaText) ?? null
  }, [jaText, cacheVersion])

  // Fetch tokenization when not cached
  useEffect(() => {
    if (!jaText || tokenCache.has(jaText)) return

    let cancelled = false

    async function fetchTokens() {
      try {
        const res = await fetch('/api/v1/tokenize', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: jaText }),
        })
        if (cancelled) return
        if (!res.ok) return

        const json = await res.json()
        const tokens = json.data.tokens as TokenizedWord[]
        tokenCache.set(jaText!, tokens)
        if (!cancelled) setCacheVersion((v) => v + 1)
      } catch {
        // Fall back to plain text
      }
    }

    fetchTokens()

    return () => {
      cancelled = true
    }
  }, [jaText])

  const handleWordClick = useCallback(
    (token: TokenizedWord, rect: DOMRect) => {
      onPauseRequest()
      openPopup(token, rect)
    },
    [onPauseRequest, openPopup],
  )

  if (!jaText && !enText) return null

  return (
    <div className="absolute bottom-14 left-0 right-0 flex flex-col items-center gap-1 px-4">
      {jaText && (
        <span
          className={cn(
            'group/sub relative inline-block px-3 py-1 rounded bg-black/70 backdrop-blur-sm text-white font-medium text-center whitespace-pre-line leading-snug pointer-events-auto',
            JA_FONT_SIZES[fontSize],
          )}
        >
          {tokenizedText ? (
            tokenizedText.map((token, i) => (
              <ClickableWord key={i} token={token} onWordClick={handleWordClick} />
            ))
          ) : (
            jaText
          )}
          {onMineRequest && active.ja && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                onMineRequest(active.ja!, active.en)
              }}
              className="ml-2 inline-flex items-center opacity-0 group-hover/sub:opacity-100 transition-opacity text-white/60 hover:text-amber-400"
              aria-label="Mine this sentence"
              title="Mine sentence (S)"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 5v14M5 12h14" strokeLinecap="round" />
              </svg>
            </button>
          )}
        </span>
      )}
      {enText && (
        <span
          className={cn(
            'inline-block px-3 py-1 rounded bg-black/70 backdrop-blur-sm text-white/90 text-center whitespace-pre-line leading-snug pointer-events-none select-none',
            EN_FONT_SIZES[fontSize],
          )}
        >
          {enText}
        </span>
      )}
    </div>
  )
}
