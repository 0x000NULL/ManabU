import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { SubtitleFontSize } from '@/types/subtitle'

const FONT_SIZES: SubtitleFontSize[] = ['small', 'medium', 'large']

interface SubtitleState {
  showJapanese: boolean
  showEnglish: boolean
  fontSize: SubtitleFontSize
  isLooping: boolean
  toggleJapanese: () => void
  toggleEnglish: () => void
  cycleFontSize: () => void
  toggleLoop: () => void
}

export const useSubtitleStore = create<SubtitleState>()(
  persist(
    set => ({
      showJapanese: true,
      showEnglish: true,
      fontSize: 'medium',
      isLooping: false,

      toggleJapanese: () => set(s => ({ showJapanese: !s.showJapanese })),
      toggleEnglish: () => set(s => ({ showEnglish: !s.showEnglish })),
      cycleFontSize: () =>
        set(s => {
          const idx = FONT_SIZES.indexOf(s.fontSize)
          return { fontSize: FONT_SIZES[(idx + 1) % FONT_SIZES.length] }
        }),
      toggleLoop: () => set(s => ({ isLooping: !s.isLooping })),
    }),
    {
      name: 'wakaru-subtitles',
      partialize: state => ({
        showJapanese: state.showJapanese,
        showEnglish: state.showEnglish,
        fontSize: state.fontSize,
      }),
    },
  ),
)
