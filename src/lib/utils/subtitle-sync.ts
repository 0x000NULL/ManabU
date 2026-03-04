import type { SubtitleCue } from '@/lib/utils/subtitle-parser'
import type { ActiveSubtitles } from '@/types/subtitle'

/**
 * Binary search to find the active cue at a given time.
 * Returns the cue whose startSeconds <= time < endSeconds, or null.
 */
export function findActiveCue(cues: SubtitleCue[], time: number): SubtitleCue | null {
  if (cues.length === 0) return null

  let low = 0
  let high = cues.length - 1

  while (low <= high) {
    const mid = (low + high) >>> 1
    const cue = cues[mid]

    if (time < cue.startSeconds) {
      high = mid - 1
    } else if (time >= cue.endSeconds) {
      low = mid + 1
    } else {
      return cue
    }
  }

  return null
}

/**
 * Find active subtitles for both languages at a given time.
 */
export function findActiveSubtitles(
  jaCues: SubtitleCue[],
  enCues: SubtitleCue[],
  time: number,
): ActiveSubtitles {
  return {
    ja: findActiveCue(jaCues, time),
    en: findActiveCue(enCues, time),
  }
}
