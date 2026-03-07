'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { useAuthStore } from '@/store/auth-store'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils/cn'
import { dashboardNavItems } from '@/lib/constants/navigation'
import { hasImmersionAccess, IMMERSION_NAV_HREFS } from '@/lib/utils/immersion-access'

interface HeaderProps {
  showDashboardNav?: boolean
}

export function Header({ showDashboardNav = false }: HeaderProps) {
  const { user, isAuthenticated, logout } = useAuthStore()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background">
      <div className="flex h-14 items-center justify-between px-4 lg:px-6">
        <Link href={isAuthenticated ? '/dashboard' : '/'} className="flex items-center gap-2">
          <span className="text-xl font-bold text-primary">Wakaru</span>
          <span className="hidden text-sm text-muted-foreground sm:inline">分かる</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-2 md:flex">
          {isAuthenticated ? (
            <>
              <span className="mr-2 text-sm text-muted-foreground">
                {user?.displayName ?? user?.email}
              </span>
              <Button variant="ghost" size="sm" onClick={() => logout()}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  Login
                </Button>
              </Link>
              <Link href="/register">
                <Button size="sm">Get Started</Button>
              </Link>
            </>
          )}
        </nav>

        {/* Mobile hamburger */}
        <button
          className="p-2 md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {mobileMenuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      <div className={cn('border-t border-border md:hidden', mobileMenuOpen ? 'block' : 'hidden')}>
        <div className="space-y-2 px-4 py-3">
          {isAuthenticated ? (
            <>
              <p className="text-sm text-muted-foreground">{user?.displayName ?? user?.email}</p>

              {showDashboardNav && (
                <>
                  <div className="border-t border-border pt-2">
                    <nav className="flex flex-col gap-1">
                      {(user?.email && hasImmersionAccess(user.email)
                        ? dashboardNavItems
                        : dashboardNavItems.filter((item) => !IMMERSION_NAV_HREFS.has(item.href))
                      ).map(item => {
                        const isActive =
                          pathname === item.href || pathname.startsWith(item.href + '/')
                        return (
                          <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setMobileMenuOpen(false)}
                            className={cn(
                              'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                              isActive
                                ? 'bg-primary/10 text-primary'
                                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                            )}
                          >
                            <svg
                              className="h-5 w-5 shrink-0"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.5}
                                d={item.icon}
                              />
                            </svg>
                            {item.label}
                          </Link>
                        )
                      })}
                    </nav>
                  </div>
                  <div className="border-t border-border pt-2" />
                </>
              )}

              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start"
                onClick={() => {
                  logout()
                  setMobileMenuOpen(false)
                }}
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="ghost" size="sm" className="w-full justify-start">
                  Login
                </Button>
              </Link>
              <Link href="/register" onClick={() => setMobileMenuOpen(false)}>
                <Button size="sm" className="w-full">
                  Get Started
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
