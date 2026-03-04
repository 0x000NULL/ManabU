'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Toggle } from '@/components/ui/toggle'
import type { UserSettings } from '@/types/settings'

interface LearningPreferencesSectionProps {
  settings: UserSettings
  onSettingsChange: (settings: UserSettings) => void
}

export function LearningPreferencesSection({
  settings,
  onSettingsChange,
}: LearningPreferencesSectionProps) {
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined)

  const save = useCallback(
    async (patch: Partial<UserSettings>) => {
      setSaving(true)
      setMessage(null)
      try {
        const res = await fetch('/api/v1/user/settings', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(patch),
        })
        const data = await res.json()
        if (data.success) {
          onSettingsChange({ ...settings, ...patch })
        } else {
          setMessage(data.error?.message ?? 'Failed to save')
        }
      } catch {
        setMessage('Network error')
      } finally {
        setSaving(false)
      }
    },
    [settings, onSettingsChange]
  )

  function handleNumberChange(field: keyof UserSettings, value: string) {
    const num = parseInt(value, 10)
    if (isNaN(num)) return
    onSettingsChange({ ...settings, [field]: num })
    clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => save({ [field]: num }), 500)
  }

  useEffect(() => {
    return () => clearTimeout(debounceRef.current)
  }, [])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Learning Preferences</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-5">
          <Input
            label="Daily New Word Limit"
            type="number"
            min={1}
            max={100}
            value={settings.dailyNewWordLimit}
            onChange={(e) => handleNumberChange('dailyNewWordLimit', e.target.value)}
          />
          <Input
            label="Daily New Grammar Limit"
            type="number"
            min={1}
            max={50}
            value={settings.dailyNewGrammarLimit}
            onChange={(e) => handleNumberChange('dailyNewGrammarLimit', e.target.value)}
          />
          <Input
            label="Review Batch Size"
            type="number"
            min={5}
            max={200}
            placeholder="No limit"
            value={settings.reviewBatchSize ?? ''}
            onChange={(e) => {
              const val = e.target.value
              if (val === '') {
                onSettingsChange({ ...settings, reviewBatchSize: null })
                clearTimeout(debounceRef.current)
                debounceRef.current = setTimeout(() => save({ reviewBatchSize: null }), 500)
              } else {
                handleNumberChange('reviewBatchSize', val)
              }
            }}
          />
          <Toggle
            checked={settings.audioAutoplay}
            onChange={(checked) => {
              onSettingsChange({ ...settings, audioAutoplay: checked })
              save({ audioAutoplay: checked })
            }}
            label="Audio Autoplay"
            description="Automatically play pronunciation audio in lessons"
          />
          <Select
            label="Furigana Display"
            value={settings.furiganaDisplay}
            onChange={(e) => {
              const val = e.target.value as UserSettings['furiganaDisplay']
              onSettingsChange({ ...settings, furiganaDisplay: val })
              save({ furiganaDisplay: val })
            }}
            options={[
              { value: 'always', label: 'Always show' },
              { value: 'hover', label: 'Show on hover' },
              { value: 'never', label: 'Never show' },
            ]}
          />
          {message && <p className="text-sm text-destructive">{message}</p>}
          {saving && <p className="text-sm text-muted-foreground">Saving...</p>}
        </div>
      </CardContent>
    </Card>
  )
}
