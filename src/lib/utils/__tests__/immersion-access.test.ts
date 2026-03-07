import { describe, it, expect } from 'vitest'
import { hasImmersionAccess, IMMERSION_NAV_HREFS } from '@/lib/utils/immersion-access'

describe('hasImmersionAccess', () => {
  it('allows @fimil.dev', () => {
    expect(hasImmersionAccess('user@fimil.dev')).toBe(true)
  })

  it('allows @wakaru.dev', () => {
    expect(hasImmersionAccess('admin@wakaru.dev')).toBe(true)
  })

  it('allows @ethanaldrich.net', () => {
    expect(hasImmersionAccess('ethan@ethanaldrich.net')).toBe(true)
  })

  it('allows @ethanaldrich.org', () => {
    expect(hasImmersionAccess('test@ethanaldrich.org')).toBe(true)
  })

  it('rejects other domains', () => {
    expect(hasImmersionAccess('user@gmail.com')).toBe(false)
    expect(hasImmersionAccess('user@example.com')).toBe(false)
  })

  it('is case-insensitive', () => {
    expect(hasImmersionAccess('USER@FIMIL.DEV')).toBe(true)
    expect(hasImmersionAccess('Admin@Wakaru.Dev')).toBe(true)
    expect(hasImmersionAccess('test@EthanAldrich.Net')).toBe(true)
  })

  it('returns false for empty string', () => {
    expect(hasImmersionAccess('')).toBe(false)
  })

  it('returns false for string without @', () => {
    expect(hasImmersionAccess('noemail')).toBe(false)
  })

  it('rejects partial domain matches', () => {
    expect(hasImmersionAccess('user@notfimil.dev')).toBe(false)
    expect(hasImmersionAccess('user@fimil.dev.evil.com')).toBe(false)
    expect(hasImmersionAccess('user@xwakaru.dev')).toBe(false)
  })
})

describe('IMMERSION_NAV_HREFS', () => {
  it('contains immersion routes', () => {
    expect(IMMERSION_NAV_HREFS.has('/immersion')).toBe(true)
    expect(IMMERSION_NAV_HREFS.has('/immersion/sentences')).toBe(true)
  })

  it('does not contain non-immersion routes', () => {
    expect(IMMERSION_NAV_HREFS.has('/dashboard')).toBe(false)
  })
})
