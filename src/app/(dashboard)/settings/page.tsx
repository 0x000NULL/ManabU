'use client'

import { useCallback, useEffect, useState } from 'react'
import { useAuthStore } from '@/store/auth-store'
import { AccountSection } from '@/components/settings/account-section'
import { SecuritySection } from '@/components/settings/security-section'
import { LearningPreferencesSection } from '@/components/settings/learning-preferences-section'
import { AppearanceSection } from '@/components/settings/appearance-section'
import { StatsSection } from '@/components/settings/stats-section'
import { DEFAULT_SETTINGS, type UserSettings } from '@/types/settings'

export default function SettingsPage() {
  const { user } = useAuthStore()
  const [settings, setSettings] = useState<UserSettings>(DEFAULT_SETTINGS)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/v1/user/settings')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.success) {
          setSettings({ ...DEFAULT_SETTINGS, ...data.data })
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const handleDisplayNameUpdated = useCallback((name: string) => {
    const store = useAuthStore.getState()
    if (store.user) {
      useAuthStore.setState({ user: { ...store.user, displayName: name } })
    }
  }, [])

  const handleSettingsChange = useCallback((next: UserSettings) => {
    setSettings(next)
  }, [])

  if (!user) return null

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        <p className="mt-1 text-muted-foreground">Manage your account and preferences.</p>
      </div>

      <AccountSection user={user} onDisplayNameUpdated={handleDisplayNameUpdated} />
      <SecuritySection />
      {!loading && (
        <LearningPreferencesSection
          settings={settings}
          onSettingsChange={handleSettingsChange}
        />
      )}
      <AppearanceSection />
      <StatsSection />
    </div>
  )
}
