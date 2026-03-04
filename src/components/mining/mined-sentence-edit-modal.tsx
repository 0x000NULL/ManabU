'use client'

import { useState } from 'react'
import { Modal, ModalBody, ModalFooter } from '@/components/ui/modal'
import type { MinedSentence } from '@/types/mined-sentence'

interface MinedSentenceEditModalProps {
  open: boolean
  onClose: () => void
  sentence: MinedSentence
  onSave: (id: string, updates: { notes?: string; english?: string }) => Promise<boolean>
}

export function MinedSentenceEditModal({
  open,
  onClose,
  sentence,
  onSave,
}: MinedSentenceEditModalProps) {
  const [notes, setNotes] = useState(sentence.notes ?? '')
  const [english, setEnglish] = useState(sentence.english ?? '')
  const [isSaving, setIsSaving] = useState(false)

  async function handleSave() {
    setIsSaving(true)
    const success = await onSave(sentence.id, { notes, english })
    setIsSaving(false)
    if (success) onClose()
  }

  return (
    <Modal open={open} onClose={onClose} title="Edit Sentence" size="md">
      <ModalBody>
        <div className="space-y-4">
          {/* Japanese (read-only) */}
          <div>
            <label className="mb-1 block text-xs font-medium text-muted-foreground">
              Japanese
            </label>
            <p className="rounded bg-muted px-3 py-2 text-lg font-medium text-foreground">
              {sentence.japanese}
            </p>
          </div>

          {/* English */}
          <div>
            <label
              htmlFor="edit-english"
              className="mb-1 block text-xs font-medium text-muted-foreground"
            >
              English
            </label>
            <input
              id="edit-english"
              type="text"
              value={english}
              onChange={(e) => setEnglish(e.target.value)}
              maxLength={1000}
              className="w-full rounded border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          {/* Notes */}
          <div>
            <label
              htmlFor="edit-notes"
              className="mb-1 block text-xs font-medium text-muted-foreground"
            >
              Notes
            </label>
            <textarea
              id="edit-notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              maxLength={1000}
              className="w-full rounded border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
        </div>
      </ModalBody>
      <ModalFooter>
        <button
          type="button"
          onClick={onClose}
          className="rounded px-4 py-2 text-sm text-muted-foreground hover:text-foreground"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleSave}
          disabled={isSaving}
          className="rounded bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
        >
          {isSaving ? 'Saving...' : 'Save'}
        </button>
      </ModalFooter>
    </Modal>
  )
}
