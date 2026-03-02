import Link from 'next/link'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils/cn'
import type { KanaCharacter, KanaGroup } from '@/types/kana'

interface GroupCardProps {
  group: KanaGroup
  characters: KanaCharacter[]
  className?: string
  progressBadge?: React.ReactNode
  routePrefix?: string
}

export function GroupCard({
  group,
  characters,
  className,
  progressBadge,
  routePrefix = '/hiragana',
}: GroupCardProps) {
  const preview = characters.map(c => c.character).join(' ')

  return (
    <Link href={`${routePrefix}/${group.id}`}>
      <Card
        className={cn(
          'transition-colors hover:border-primary/40 hover:bg-muted/30',
          className,
        )}
      >
        <CardHeader>
          <div className="flex items-center gap-2">
            <CardTitle>{group.name}</CardTitle>
            {group.is_dakuten && (
              <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-medium text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                Dakuten
              </span>
            )}
            {group.is_combination && (
              <span className="rounded-full bg-violet-100 px-2 py-0.5 text-[10px] font-medium text-violet-700 dark:bg-violet-900/30 dark:text-violet-400">
                Combination
              </span>
            )}
            {progressBadge}
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">{group.description}</p>
          <p className="mt-3 text-lg tracking-wider">{preview}</p>
          <p className="mt-1 text-xs text-muted-foreground">
            {group.character_count} character{group.character_count !== 1 && 's'}
          </p>
        </CardContent>
      </Card>
    </Link>
  )
}
