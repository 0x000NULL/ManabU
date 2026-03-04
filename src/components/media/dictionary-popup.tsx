'use client'

import { useEffect, useRef, useCallback, useLayoutEffect } from 'react'
import { useDictionaryStore } from '@/store/dictionary-store'
import { katakanaToHiragana } from '@/lib/utils/kana-convert'

interface DictionaryPopupProps {
  containerRef: React.RefObject<HTMLDivElement | null>
}

export function DictionaryPopup({ containerRef }: DictionaryPopupProps) {
  const { selectedWord, anchorRect, entry, isLoading, isAddingToSrs, closePopup, addToSrs } =
    useDictionaryStore()
  const popupRef = useRef<HTMLDivElement>(null)

  // Position popup via direct DOM manipulation (avoids setState-in-effect lint error)
  useLayoutEffect(() => {
    const popup = popupRef.current
    if (!popup || !selectedWord || !anchorRect) return

    const container = containerRef.current
    const containerRect = container?.getBoundingClientRect()
    if (!containerRect) {
      popup.style.position = 'absolute'
      popup.style.zIndex = '60'
      return
    }

    const left = anchorRect.left - containerRect.left + anchorRect.width / 2
    const top = anchorRect.top - containerRect.top

    popup.style.position = 'absolute'
    popup.style.left = `${Math.max(16, Math.min(left, containerRect.width - 176))}px`
    popup.style.bottom = `${containerRect.height - top + 8}px`
    popup.style.transform = 'translateX(-50%)'
    popup.style.zIndex = '60'
  }, [selectedWord, anchorRect, containerRef])

  // Close on click outside
  const handleClickOutside = useCallback(
    (e: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(e.target as Node)) {
        closePopup()
      }
    },
    [closePopup],
  )

  // Close on Escape
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closePopup()
      }
    },
    [closePopup],
  )

  useEffect(() => {
    if (!selectedWord) return

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [selectedWord, handleClickOutside, handleKeyDown])

  if (!selectedWord || !anchorRect) return null

  const reading = entry?.reading
    ? katakanaToHiragana(entry.reading)
    : selectedWord.reading
      ? katakanaToHiragana(selectedWord.reading)
      : null

  return (
    <div
      ref={popupRef}
      className="w-80 max-h-80 overflow-y-auto rounded-lg border border-white/20 bg-gray-900/95 p-4 text-white shadow-xl backdrop-blur-md"
    >
      {isLoading ? (
        <div className="flex items-center justify-center py-4">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
        </div>
      ) : (
        <>
          {/* Word + reading */}
          <div className="mb-2">
            <span className="text-xl font-bold">{selectedWord.surface}</span>
            {reading && reading !== selectedWord.surface && (
              <span className="ml-2 text-sm text-white/60">({reading})</span>
            )}
          </div>

          {/* Base form if different */}
          {entry && entry.baseForm !== selectedWord.surface && (
            <div className="mb-1 text-xs text-white/50">
              Base form: {entry.baseForm}
            </div>
          )}

          {/* POS */}
          <div className="mb-2 text-xs text-white/50">
            {entry?.pos || selectedWord.pos}
          </div>

          {/* JLPT badge */}
          {entry?.jlptLevel && (
            <span className="mb-2 inline-block rounded bg-primary/20 px-2 py-0.5 text-xs font-medium text-primary">
              {entry.jlptLevel}
            </span>
          )}

          {/* Meaning */}
          {entry?.meaning && (
            <p className="mb-3 text-sm leading-relaxed text-white/90">{entry.meaning}</p>
          )}

          {/* Example sentences */}
          {entry?.sentences && entry.sentences.length > 0 && (
            <div className="mb-3 space-y-2">
              <p className="text-xs font-medium text-white/50">Examples</p>
              {entry.sentences.map((s) => (
                <div key={s.id} className="rounded bg-white/5 px-2 py-1.5 text-xs">
                  <p className="text-white/90">{s.japanese}</p>
                  <p className="mt-0.5 text-white/50">{s.english}</p>
                </div>
              ))}
            </div>
          )}

          {/* Add to SRS */}
          {entry?.vocabularyId && (
            <div className="border-t border-white/10 pt-2">
              {entry.srs ? (
                <div className="flex items-center gap-2 text-xs text-white/50">
                  <span className="inline-block h-2 w-2 rounded-full bg-green-400" />
                  In SRS — {entry.srs.status}
                </div>
              ) : (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    addToSrs()
                  }}
                  disabled={isAddingToSrs}
                  className="w-full rounded bg-primary/20 px-3 py-1.5 text-xs font-medium text-primary transition-colors hover:bg-primary/30 disabled:opacity-50"
                >
                  {isAddingToSrs ? 'Adding...' : 'Add to SRS'}
                </button>
              )}
            </div>
          )}

          {/* Not in vocabulary */}
          {entry && !entry.vocabularyId && !entry.meaning && (
            <p className="text-xs italic text-white/40">Not in vocabulary database</p>
          )}
        </>
      )}
    </div>
  )
}
