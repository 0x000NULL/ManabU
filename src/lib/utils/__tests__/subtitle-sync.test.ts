import { describe, it, expect } from 'vitest'
import { findActiveCue, findActiveSubtitles } from '@/lib/utils/subtitle-sync'
import type { SubtitleCue } from '@/lib/utils/subtitle-parser'

function makeCue(index: number, start: number, end: number, text: string): SubtitleCue {
  return {
    index,
    startTime: '',
    endTime: '',
    startSeconds: start,
    endSeconds: end,
    text,
  }
}

const cues: SubtitleCue[] = [
  makeCue(1, 1.0, 3.0, 'First'),
  makeCue(2, 5.0, 8.0, 'Second'),
  makeCue(3, 10.0, 12.5, 'Third'),
  makeCue(4, 15.0, 18.0, 'Fourth'),
]

describe('findActiveCue', () => {
  it('returns null for empty array', () => {
    expect(findActiveCue([], 5)).toBeNull()
  })

  it('returns null when time is before all cues', () => {
    expect(findActiveCue(cues, 0.5)).toBeNull()
  })

  it('returns null when time is after all cues', () => {
    expect(findActiveCue(cues, 20)).toBeNull()
  })

  it('returns null when time is between cues', () => {
    expect(findActiveCue(cues, 4.0)).toBeNull()
    expect(findActiveCue(cues, 9.0)).toBeNull()
    expect(findActiveCue(cues, 13.0)).toBeNull()
  })

  it('returns cue when time is at exact start boundary', () => {
    expect(findActiveCue(cues, 1.0)).toEqual(cues[0])
    expect(findActiveCue(cues, 5.0)).toEqual(cues[1])
    expect(findActiveCue(cues, 10.0)).toEqual(cues[2])
  })

  it('returns null when time is at exact end boundary (exclusive)', () => {
    expect(findActiveCue(cues, 3.0)).toBeNull()
    expect(findActiveCue(cues, 8.0)).toBeNull()
    expect(findActiveCue(cues, 12.5)).toBeNull()
  })

  it('returns correct cue when time is within range', () => {
    expect(findActiveCue(cues, 2.0)).toEqual(cues[0])
    expect(findActiveCue(cues, 6.5)).toEqual(cues[1])
    expect(findActiveCue(cues, 11.0)).toEqual(cues[2])
    expect(findActiveCue(cues, 16.5)).toEqual(cues[3])
  })

  it('works with a single cue', () => {
    const single = [makeCue(1, 5.0, 10.0, 'Only')]
    expect(findActiveCue(single, 4.9)).toBeNull()
    expect(findActiveCue(single, 5.0)).toEqual(single[0])
    expect(findActiveCue(single, 7.5)).toEqual(single[0])
    expect(findActiveCue(single, 10.0)).toBeNull()
  })
})

describe('findActiveSubtitles', () => {
  const enCues: SubtitleCue[] = [
    makeCue(1, 1.0, 3.0, 'Hello'),
    makeCue(2, 5.0, 8.0, 'World'),
  ]

  const jaCues: SubtitleCue[] = [
    makeCue(1, 1.5, 3.5, 'こんにちは'),
    makeCue(2, 5.5, 8.5, '世界'),
  ]

  it('returns both active cues when both match', () => {
    const result = findActiveSubtitles(jaCues, enCues, 2.0)
    expect(result.ja).toEqual(jaCues[0])
    expect(result.en).toEqual(enCues[0])
  })

  it('returns only matching language when times differ', () => {
    // At 1.0, EN is active but JA starts at 1.5
    const result = findActiveSubtitles(jaCues, enCues, 1.2)
    expect(result.ja).toBeNull()
    expect(result.en).toEqual(enCues[0])
  })

  it('returns both null when no cues match', () => {
    const result = findActiveSubtitles(jaCues, enCues, 4.0)
    expect(result.ja).toBeNull()
    expect(result.en).toBeNull()
  })

  it('handles empty cue arrays', () => {
    const result = findActiveSubtitles([], [], 5.0)
    expect(result.ja).toBeNull()
    expect(result.en).toBeNull()
  })
})
