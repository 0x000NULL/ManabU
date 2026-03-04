import type { SubtitleCue } from '@/lib/utils/subtitle-parser'

/**
 * Binary search to find the index of the cue active at the given time.
 * Returns -1 if no cue is active.
 */
export function findCueIndexAtTime(cues: SubtitleCue[], time: number): number {
  if (cues.length === 0) return -1

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
      return mid
    }
  }

  return -1
}

/**
 * Get the current cue at the given time.
 */
export function getCurrentCue(cues: SubtitleCue[], time: number): SubtitleCue | null {
  const idx = findCueIndexAtTime(cues, time)
  return idx >= 0 ? cues[idx] : null
}

/**
 * Get the previous cue for navigation.
 * If within the first 1 second of the current cue, goes to the previous cue.
 * Otherwise replays the current cue from its start.
 * If between cues, goes to the most recent past cue.
 */
export function getPreviousCue(cues: SubtitleCue[], time: number): SubtitleCue | null {
  if (cues.length === 0) return null

  const idx = findCueIndexAtTime(cues, time)

  if (idx >= 0) {
    const cue = cues[idx]
    // If near start of current cue (<1s in), go to previous
    if (time - cue.startSeconds < 1 && idx > 0) {
      return cues[idx - 1]
    }
    // Otherwise replay current cue
    return cue
  }

  // Between cues — find the most recent past cue
  for (let i = cues.length - 1; i >= 0; i--) {
    if (cues[i].endSeconds <= time) {
      return cues[i]
    }
  }

  return null
}

/**
 * Get the next cue after the current time.
 */
export function getNextCue(cues: SubtitleCue[], time: number): SubtitleCue | null {
  if (cues.length === 0) return null

  const idx = findCueIndexAtTime(cues, time)

  if (idx >= 0) {
    // Currently in a cue — go to the next one
    return idx < cues.length - 1 ? cues[idx + 1] : null
  }

  // Between cues — find the next future cue
  for (let i = 0; i < cues.length; i++) {
    if (cues[i].startSeconds > time) {
      return cues[i]
    }
  }

  return null
}
