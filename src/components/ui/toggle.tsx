'use client'

import { cn } from '@/lib/utils/cn'

interface ToggleProps {
  checked: boolean
  onChange: (checked: boolean) => void
  label?: string
  description?: string
  disabled?: boolean
}

export function Toggle({ checked, onChange, label, description, disabled }: ToggleProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={cn(
        'group flex items-center gap-3 text-left disabled:cursor-not-allowed disabled:opacity-50'
      )}
    >
      <span
        className={cn(
          'relative inline-flex h-6 w-11 shrink-0 rounded-full border-2 border-transparent transition-colors',
          checked ? 'bg-primary' : 'bg-muted-foreground/30'
        )}
      >
        <span
          className={cn(
            'pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-sm transition-transform',
            checked ? 'translate-x-5' : 'translate-x-0'
          )}
        />
      </span>
      {(label || description) && (
        <span className="flex flex-col">
          {label && <span className="text-sm font-medium text-foreground">{label}</span>}
          {description && <span className="text-sm text-muted-foreground">{description}</span>}
        </span>
      )}
    </button>
  )
}
