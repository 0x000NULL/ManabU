'use client'

import { useState } from 'react'
import { Modal, ModalBody, ModalFooter } from '@/components/ui/modal'

interface MineSentenceModalProps {
  open: boolean
  onClose: () => void
  japanese: string
  english: string | null
  screenshotUrl: string | null
  videoUrl?: string | null
  mediaId?: string
  episodeNumber?: number
  timestamp?: number
}

export function MineSentenceModal({
  open,
  onClose,
  japanese,
  english,
  screenshotUrl,
  videoUrl,
  mediaId,
  episodeNumber,
  timestamp,
}: MineSentenceModalProps) {
  const [notes, setNotes] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [extractingAudio, setExtractingAudio] = useState(false)

  async function handleSave() {
    setIsSaving(true)
    setError(null)

    try {
      let audioUrl: string | null = null

      // Extract audio if videoUrl and timestamp are available
      if (videoUrl && timestamp !== undefined) {
        setExtractingAudio(true)
        try {
          const audioResponse = await fetch('/api/v1/media/extract-audio', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              videoUrl,
              startTime: Math.max(0, timestamp - 1), // Start 1 second before
              duration: 5, // 5 second clip
            }),
          })

          if (audioResponse.ok) {
            const audioData = await audioResponse.json()
            audioUrl = audioData.audioUrl
          } else {
            console.warn('Audio extraction failed, continuing without audio')
          }
        } catch (err) {
          console.warn('Audio extraction error:', err)
          // Continue without audio rather than failing the whole save
        } finally {
          setExtractingAudio(false)
        }
      }

      // Save the mined sentence
      const body: Record<string, unknown> = { japanese }
      if (english) body.english = english
      if (notes) body.notes = notes
      if (mediaId) body.sourceMediaId = mediaId
      if (episodeNumber !== undefined) body.sourceEpisode = episodeNumber
      if (timestamp !== undefined) body.sourceTimestamp = Math.floor(timestamp)
      if (screenshotUrl) body.screenshotDataUrl = screenshotUrl
      if (audioUrl) body.audioUrl = audioUrl

      const res = await fetch('/api/v1/sentences/mine', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      if (!res.ok) {
        const json = await res.json().catch(() => null)
        setError(json?.error?.message ?? 'Failed to save sentence')
        setIsSaving(false)
        return
      }

      setSaved(true)
      setIsSaving(false)

      // Auto-close after brief delay
      setTimeout(() => {
        handleClose()
      }, 1200)
    } catch {
      setError('Network error')
      setIsSaving(false)
    }
  }

  function handleClose() {
    setNotes('')
    setSaved(false)
    setError(null)
    setIsSaving(false)
    onClose()
  }

  return (
    <Modal open={open} onClose={handleClose} title="Mine Sentence" size="md">
      <ModalBody>
        <div className="space-y-4">
          {/* Screenshot */}
          {screenshotUrl && (
            <div className="overflow-hidden rounded-lg border border-border">
              {/* eslint-disable-next-line @next/next/no-img-element -- data URL, not optimizable */}
              <img
                src={screenshotUrl}
                alt="Video screenshot"
                className="w-full"
              />
            </div>
          )}

          {/* Japanese text */}
          <div>
            <label className="mb-1 block text-xs font-medium text-muted-foreground">
              Japanese
            </label>
            <p className="rounded bg-muted px-3 py-2 text-lg font-medium text-foreground">
              {japanese}
            </p>
          </div>

          {/* English text */}
          {english && (
            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">
                English
              </label>
              <p className="rounded bg-muted px-3 py-2 text-sm text-foreground">
                {english}
              </p>
            </div>
          )}

          {/* Notes */}
          <div>
            <label
              htmlFor="mine-notes"
              className="mb-1 block text-xs font-medium text-muted-foreground"
            >
              Notes (optional)
            </label>
            <textarea
              id="mine-notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add context, mnemonics, or grammar notes..."
              rows={3}
              maxLength={1000}
              className="w-full rounded border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          {/* Error */}
          {error && (
            <p className="text-sm text-red-500">{error}</p>
          )}

          {/* Success */}
          {saved && (
            <p className="text-sm text-green-500">Saved to your deck!</p>
          )}
        </div>
      </ModalBody>
      <ModalFooter>
        <button
          type="button"
          onClick={handleClose}
          className="rounded px-4 py-2 text-sm text-muted-foreground hover:text-foreground"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleSave}
          disabled={isSaving || saved}
          className="rounded bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
        >
          {saved ? 'Saved!' : extractingAudio ? 'Extracting audio...' : isSaving ? 'Saving...' : 'Save to Deck'}
        </button>
      </ModalFooter>
    </Modal>
  )
}
