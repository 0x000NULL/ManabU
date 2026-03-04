import { describe, it, expect } from 'vitest'
import { getStudyDate } from '@/lib/utils/study-day'

describe('getStudyDate', () => {
  it('returns same day when hour >= 4', () => {
    const date = new Date(2026, 2, 4, 10, 30) // March 4, 10:30 AM
    const result = getStudyDate(date)
    expect(result.getFullYear()).toBe(2026)
    expect(result.getMonth()).toBe(2)
    expect(result.getDate()).toBe(4)
  })

  it('returns previous day when hour < 4', () => {
    const date = new Date(2026, 2, 4, 3, 0) // March 4, 3:00 AM
    const result = getStudyDate(date)
    expect(result.getFullYear()).toBe(2026)
    expect(result.getMonth()).toBe(2)
    expect(result.getDate()).toBe(3)
  })

  it('returns previous day at exactly hour 0', () => {
    const date = new Date(2026, 2, 4, 0, 0) // March 4, midnight
    const result = getStudyDate(date)
    expect(result.getDate()).toBe(3)
  })

  it('returns same day at exactly hour 4', () => {
    const date = new Date(2026, 2, 4, 4, 0) // March 4, 4:00 AM
    const result = getStudyDate(date)
    expect(result.getDate()).toBe(4)
  })

  it('handles month boundaries', () => {
    const date = new Date(2026, 2, 1, 2, 0) // March 1, 2:00 AM
    const result = getStudyDate(date)
    expect(result.getMonth()).toBe(1) // February
    expect(result.getDate()).toBe(28)
  })

  it('zeroes out time', () => {
    const date = new Date(2026, 2, 4, 15, 45, 30, 123)
    const result = getStudyDate(date)
    expect(result.getHours()).toBe(0)
    expect(result.getMinutes()).toBe(0)
    expect(result.getSeconds()).toBe(0)
    expect(result.getMilliseconds()).toBe(0)
  })
})
