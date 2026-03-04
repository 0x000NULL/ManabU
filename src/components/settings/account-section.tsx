'use client'

import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import type { AuthUser } from '@/types/auth'

interface AccountSectionProps {
  user: AuthUser
  onDisplayNameUpdated: (name: string) => void
}

export function AccountSection({ user, onDisplayNameUpdated }: AccountSectionProps) {
  const [displayName, setDisplayName] = useState(user.displayName ?? '')
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const isDirty = displayName.trim() !== (user.displayName ?? '')

  async function handleSave() {
    setSaving(true)
    setMessage(null)
    try {
      const res = await fetch('/api/v1/user/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ displayName: displayName.trim() }),
      })
      const data = await res.json()
      if (data.success) {
        setMessage({ type: 'success', text: 'Display name updated' })
        onDisplayNameUpdated(data.data.displayName)
      } else {
        setMessage({ type: 'error', text: data.error?.message ?? 'Failed to update' })
      }
    } catch {
      setMessage({ type: 'error', text: 'Network error' })
    } finally {
      setSaving(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Account</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Input
            label="Display Name"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            maxLength={50}
          />
          <Input label="Email" value={user.email} disabled />
          <p className="text-sm text-muted-foreground">
            Member since{' '}
            {new Date(user.createdAt).toLocaleDateString('en-US', {
              month: 'long',
              year: 'numeric',
            })}
          </p>
          {message && (
            <p
              className={
                message.type === 'success' ? 'text-sm text-primary' : 'text-sm text-destructive'
              }
            >
              {message.text}
            </p>
          )}
          <Button onClick={handleSave} loading={saving} disabled={!isDirty} size="sm">
            Save
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
