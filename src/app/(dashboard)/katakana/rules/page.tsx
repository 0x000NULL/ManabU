import Link from 'next/link'
import { KATAKANA_RULES } from '@/lib/constants/katakana-rules'
import { RuleCard } from '@/components/hiragana/rule-card'

export default function KatakanaRulesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link
          href="/katakana"
          className="text-muted-foreground transition-colors hover:text-foreground"
          aria-label="Back to overview"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </Link>
        <div>
          <h1 className="text-xl font-bold text-foreground">Katakana Special Rules</h1>
          <p className="text-sm text-muted-foreground">
            Important rules and conventions to know as you learn katakana.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {KATAKANA_RULES.map((rule) => (
          <RuleCard key={rule.id} rule={rule} />
        ))}
      </div>
    </div>
  )
}
