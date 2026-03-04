'use client'

import { Modal, ModalBody } from '@/components/ui/modal'

interface KeyboardShortcutsOverlayProps {
  open: boolean
  onClose: () => void
}

const SECTIONS = [
  {
    title: 'Playback',
    shortcuts: [
      { key: 'Space', description: 'Play / Pause' },
      { key: 'ArrowLeft', description: 'Seek back 5s' },
      { key: 'ArrowRight', description: 'Seek forward 5s' },
      { key: 'F', description: 'Toggle fullscreen' },
    ],
  },
  {
    title: 'Subtitle Navigation',
    shortcuts: [
      { key: 'R', description: 'Replay current subtitle' },
      { key: 'A', description: 'Previous subtitle' },
      { key: 'D', description: 'Next subtitle' },
      { key: 'L', description: 'Loop current subtitle' },
    ],
  },
  {
    title: 'Subtitles',
    shortcuts: [
      { key: 'J', description: 'Toggle Japanese subtitles' },
      { key: 'E', description: 'Toggle English subtitles' },
    ],
  },
  {
    title: 'Audio',
    shortcuts: [
      { key: 'M', description: 'Mute / Unmute' },
      { key: 'ArrowUp', description: 'Volume up' },
      { key: 'ArrowDown', description: 'Volume down' },
    ],
  },
  {
    title: 'Other',
    shortcuts: [
      { key: 'S', description: 'Mine current sentence' },
      { key: '?', description: 'Show keyboard shortcuts' },
    ],
  },
]

export function KeyboardShortcutsOverlay({ open, onClose }: KeyboardShortcutsOverlayProps) {
  return (
    <Modal open={open} onClose={onClose} title="Keyboard Shortcuts" size="md">
      <ModalBody>
        <div className="space-y-4">
          {SECTIONS.map((section) => (
            <div key={section.title}>
              <h3 className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                {section.title}
              </h3>
              <div className="space-y-1.5">
                {section.shortcuts.map((shortcut) => (
                  <div
                    key={shortcut.key}
                    className="flex items-center justify-between text-sm"
                  >
                    <span className="text-foreground">{shortcut.description}</span>
                    <kbd className="rounded border border-border bg-muted px-2 py-0.5 font-mono text-xs text-muted-foreground">
                      {shortcut.key}
                    </kbd>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </ModalBody>
    </Modal>
  )
}
