import { describe, it, expect } from 'vitest'
import {
  findCueIndexAtTime,
  getCurrentCue,
  getPreviousCue,
  getNextCue,
} from '@/lib/utils/subtitle-navigation'
import type { SubtitleCue } from '@/lib/utils/subtitle-parser'

function makeCue(index: number, start: number, end: number, text = ''): SubtitleCue {
  return {
    index,
    startTime: '',
    endTime: '',
    startSeconds: start,
    endSeconds: end,
    text: text || `Cue ${index}`,
  }
}

const cues: SubtitleCue[] = [
  makeCue(1, 0, 3),
  makeCue(2, 5, 8),
  makeCue(3, 10, 15),
  makeCue(4, 20, 25),
]

describe('findCueIndexAtTime', () => {
  it('returns -1 for empty array', () => {
    expect(findCueIndexAtTime([], 5)).toBe(-1)
  })

  it('returns correct index when inside a cue', () => {
    expect(findCueIndexAtTime(cues, 1)).toBe(0)
    expect(findCueIndexAtTime(cues, 6)).toBe(1)
    expect(findCueIndexAtTime(cues, 12)).toBe(2)
    expect(findCueIndexAtTime(cues, 22)).toBe(3)
  })

  it('returns correct index at cue start boundary', () => {
    expect(findCueIndexAtTime(cues, 0)).toBe(0)
    expect(findCueIndexAtTime(cues, 5)).toBe(1)
    expect(findCueIndexAtTime(cues, 10)).toBe(2)
  })

  it('returns -1 at cue end boundary (exclusive)', () => {
    expect(findCueIndexAtTime(cues, 3)).toBe(-1)
    expect(findCueIndexAtTime(cues, 8)).toBe(-1)
  })

  it('returns -1 between cues', () => {
    expect(findCueIndexAtTime(cues, 4)).toBe(-1)
    expect(findCueIndexAtTime(cues, 9)).toBe(-1)
    expect(findCueIndexAtTime(cues, 16)).toBe(-1)
  })

  it('returns -1 before all cues', () => {
    const laterCues = [makeCue(1, 5, 10)]
    expect(findCueIndexAtTime(laterCues, 2)).toBe(-1)
  })

  it('returns -1 after all cues', () => {
    expect(findCueIndexAtTime(cues, 30)).toBe(-1)
  })
})

describe('getCurrentCue', () => {
  it('returns null for empty array', () => {
    expect(getCurrentCue([], 5)).toBeNull()
  })

  it('returns the active cue', () => {
    expect(getCurrentCue(cues, 6)).toEqual(cues[1])
  })

  it('returns null between cues', () => {
    expect(getCurrentCue(cues, 4)).toBeNull()
  })
})

describe('getPreviousCue', () => {
  it('returns null for empty array', () => {
    expect(getPreviousCue([], 5)).toBeNull()
  })

  it('replays current cue when more than 1s into it', () => {
    // 2s into cue 2 (starts at 5)
    expect(getPreviousCue(cues, 7)).toEqual(cues[1])
  })

  it('goes to previous cue when near start (<1s) of current cue', () => {
    // 0.5s into cue 2 (starts at 5)
    expect(getPreviousCue(cues, 5.5)).toEqual(cues[0])
  })

  it('replays first cue when near start of first cue', () => {
    // No previous cue to go to
    expect(getPreviousCue(cues, 0.5)).toEqual(cues[0])
  })

  it('returns most recent past cue when between cues', () => {
    // Between cue 2 (ends at 8) and cue 3 (starts at 10)
    expect(getPreviousCue(cues, 9)).toEqual(cues[1])
  })

  it('returns null when before all cues', () => {
    const laterCues = [makeCue(1, 5, 10)]
    expect(getPreviousCue(laterCues, 2)).toBeNull()
  })
})

describe('getNextCue', () => {
  it('returns null for empty array', () => {
    expect(getNextCue([], 5)).toBeNull()
  })

  it('returns next cue when inside a cue', () => {
    expect(getNextCue(cues, 6)).toEqual(cues[2])
  })

  it('returns null when inside the last cue', () => {
    expect(getNextCue(cues, 22)).toBeNull()
  })

  it('returns next future cue when between cues', () => {
    // Between cue 1 (ends at 3) and cue 2 (starts at 5)
    expect(getNextCue(cues, 4)).toEqual(cues[1])
  })

  it('returns first cue when before all cues', () => {
    const laterCues = [makeCue(1, 5, 10)]
    expect(getNextCue(laterCues, 2)).toEqual(laterCues[0])
  })

  it('returns null when after all cues', () => {
    expect(getNextCue(cues, 30)).toBeNull()
  })
})
