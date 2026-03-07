const ALLOWED_IMMERSION_DOMAINS = new Set([
  'fimil.dev',
  'wakaru.dev',
  'ethanaldrich.net',
  'ethanaldrich.org',
])

export function hasImmersionAccess(email: string): boolean {
  const atIndex = email.lastIndexOf('@')
  if (atIndex === -1) return false
  const domain = email.slice(atIndex + 1).toLowerCase()
  return ALLOWED_IMMERSION_DOMAINS.has(domain)
}

export const IMMERSION_NAV_HREFS = new Set(['/immersion', '/immersion/sentences'])
