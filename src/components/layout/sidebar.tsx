'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils/cn'
import { dashboardNavItems } from '@/lib/constants/navigation'
import { useAuthStore } from '@/store/auth-store'
import { hasImmersionAccess, IMMERSION_NAV_HREFS } from '@/lib/utils/immersion-access'

export function Sidebar() {
  const pathname = usePathname()
  const user = useAuthStore((s) => s.user)
  const canAccessImmersion = user?.email ? hasImmersionAccess(user.email) : false
  const navItems = canAccessImmersion
    ? dashboardNavItems
    : dashboardNavItems.filter((item) => !IMMERSION_NAV_HREFS.has(item.href))

  return (
    <aside className="hidden w-56 shrink-0 border-r border-border bg-background lg:block">
      <nav className="flex flex-col gap-1 p-4">
        {navItems.map(item => {
          const isActive =
            pathname === item.href || pathname.startsWith(item.href + '/')
          return (
            <Link
              key={item.href}
              href={item.href}
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
    </aside>
  )
}
