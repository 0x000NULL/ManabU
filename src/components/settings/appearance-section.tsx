'use client'

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { useTheme } from '@/components/theme-provider'
import { cn } from '@/lib/utils/cn'

const themes = [
  { value: 'system', label: 'System', description: 'Match your OS preference' },
  { value: 'light', label: 'Light', description: 'Always use light mode' },
  { value: 'dark', label: 'Dark', description: 'Always use dark mode' },
] as const

export function AppearanceSection() {
  const { theme, setTheme } = useTheme()

  return (
    <Card>
      <CardHeader>
        <CardTitle>Appearance</CardTitle>
      </CardHeader>
      <CardContent>
        <fieldset>
          <legend className="mb-3 text-sm font-medium text-foreground">Theme</legend>
          <div className="grid grid-cols-3 gap-3">
            {themes.map((t) => (
              <button
                key={t.value}
                type="button"
                onClick={() => {
                  setTheme(t.value)
                  // Also persist to server settings
                  fetch('/api/v1/user/settings', {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ theme: t.value }),
                  })
                }}
                className={cn(
                  'flex flex-col items-center gap-1 rounded-lg border-2 p-3 text-center transition-colors',
                  theme === t.value
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-muted-foreground/50'
                )}
              >
                <span className="text-sm font-medium text-foreground">{t.label}</span>
                <span className="text-xs text-muted-foreground">{t.description}</span>
              </button>
            ))}
          </div>
        </fieldset>
      </CardContent>
    </Card>
  )
}
