import { describe, it, expect } from 'vitest'
import { calculateStreaks, dateKey } from '@/lib/utils/streak'
import type { StudyDayRecord } from '@/types/streak'

function makeRecord(dateStr: string, itemsReviewed = 5, itemsLearned = 0): StudyDayRecord {
  return {
    date: new Date(dateStr + 'T00:00:00'),
    minutesStudied: 10,
    itemsReviewed,
    itemsLearned,
  }
}

describe('dateKey', () => {
  it('formats Date as YYYY-MM-DD', () => {
    expect(dateKey(new Date(2026, 0, 5))).toBe('2026-01-05')
    expect(dateKey(new Date(2026, 11, 25))).toBe('2026-12-25')
  })

  it('pads single-digit months and days', () => {
    expect(dateKey(new Date(2026, 2, 4))).toBe('2026-03-04')
  })
})

describe('calculateStreaks', () => {
  // "now" fixed at March 4, 2026 at 10:00 AM (hour >= 4, so study day = March 4)
  const now = new Date(2026, 2, 4, 10, 0)

  it('returns zero streak for empty records', () => {
    const result = calculateStreaks([], now)
    expect(result.currentStreak).toBe(0)
    expect(result.longestStreak).toBe(0)
    expect(result.todayActivity.hasActivity).toBe(false)
    expect(result.totalStudyDays).toBe(0)
  })

  it('returns streak 1 for activity only today', () => {
    const records = [makeRecord('2026-03-04')]
    const result = calculateStreaks(records, now)
    expect(result.currentStreak).toBe(1)
    expect(result.longestStreak).toBe(1)
    expect(result.todayActivity.hasActivity).toBe(true)
  })

  it('returns correct streak for 5 consecutive days', () => {
    const records = [
      makeRecord('2026-02-28'),
      makeRecord('2026-03-01'),
      makeRecord('2026-03-02'),
      makeRecord('2026-03-03'),
      makeRecord('2026-03-04'),
    ]
    const result = calculateStreaks(records, now)
    expect(result.currentStreak).toBe(5)
    expect(result.longestStreak).toBe(5)
  })

  it('breaks streak on gap', () => {
    const records = [
      makeRecord('2026-03-01'),
      // gap on March 2
      makeRecord('2026-03-03'),
      makeRecord('2026-03-04'),
    ]
    const result = calculateStreaks(records, now)
    expect(result.currentStreak).toBe(2)
  })

  it('preserves streak when today has no activity yet (grace period)', () => {
    // Yesterday and the day before had activity, but not today
    const records = [makeRecord('2026-03-02'), makeRecord('2026-03-03')]
    const result = calculateStreaks(records, now)
    expect(result.currentStreak).toBe(2)
    expect(result.todayActivity.hasActivity).toBe(false)
  })

  it('tracks longest streak independently of current', () => {
    const records = [
      // Old 4-day streak
      makeRecord('2026-01-10'),
      makeRecord('2026-01-11'),
      makeRecord('2026-01-12'),
      makeRecord('2026-01-13'),
      // Current 2-day streak
      makeRecord('2026-03-03'),
      makeRecord('2026-03-04'),
    ]
    const result = calculateStreaks(records, now)
    expect(result.currentStreak).toBe(2)
    expect(result.longestStreak).toBe(4)
  })

  it('counts only days with itemsReviewed > 0 or itemsLearned > 0 as active', () => {
    // Day with only minutes but no items should not count
    const records: StudyDayRecord[] = [
      {
        date: new Date('2026-03-04T00:00:00'),
        minutesStudied: 30,
        itemsReviewed: 0,
        itemsLearned: 0,
      },
    ]
    const result = calculateStreaks(records, now)
    expect(result.currentStreak).toBe(0)
    expect(result.todayActivity.hasActivity).toBe(false)
    expect(result.todayActivity.minutesStudied).toBe(30)
  })

  it('counts itemsLearned-only days as active', () => {
    const records: StudyDayRecord[] = [
      {
        date: new Date('2026-03-04T00:00:00'),
        minutesStudied: 0,
        itemsReviewed: 0,
        itemsLearned: 3,
      },
    ]
    const result = calculateStreaks(records, now)
    expect(result.currentStreak).toBe(1)
    expect(result.todayActivity.hasActivity).toBe(true)
  })

  it('returns 90 heatmap entries', () => {
    const result = calculateStreaks([], now)
    expect(result.studyDays).toHaveLength(90)
  })

  it('counts total study days correctly', () => {
    const records = [
      makeRecord('2026-02-01'),
      makeRecord('2026-02-15'),
      makeRecord('2026-03-04'),
    ]
    const result = calculateStreaks(records, now)
    expect(result.totalStudyDays).toBe(3)
  })
})
