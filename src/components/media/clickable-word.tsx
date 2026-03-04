'use client'

import type { TokenizedWord } from '@/types/subtitle'

interface ClickableWordProps {
  token: TokenizedWord
  onWordClick: (token: TokenizedWord, rect: DOMRect) => void
}

export function ClickableWord({ token, onWordClick }: ClickableWordProps) {
  if (!token.isContentWord) {
    return <span>{token.surface}</span>
  }

  function handleClick(e: React.MouseEvent<HTMLSpanElement>) {
    e.stopPropagation()
    const rect = e.currentTarget.getBoundingClientRect()
    onWordClick(token, rect)
  }

  return (
    <span
      role="button"
      tabIndex={-1}
      onClick={handleClick}
      className="cursor-pointer rounded-sm transition-colors hover:bg-amber-400/30"
    >
      {token.surface}
    </span>
  )
}
