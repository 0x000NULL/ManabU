import { HIRAGANA_GROUPS } from '@/lib/constants/hiragana-groups'
import type { KanaCharacter, KanaGroup } from '@/types/kana'

/**
 * Derives the SVG path for a kana character's stroke order animation
 * based on its Unicode codepoint. For combination characters (e.g. きゃ),
 * uses the first character's codepoint.
 */
export function getStrokeOrderSvgPath(character: string): string {
  const codepoint = character.codePointAt(0)
  return `/svg/kana/${codepoint}.svg`
}

/**
 * Speaks a kana character or text using the Web Speech API with a Japanese voice.
 * Returns false if speech synthesis is not available.
 */
export function speakKana(text: string, rate: number = 0.8): boolean {
  if (typeof window === 'undefined' || !window.speechSynthesis) {
    return false
  }

  window.speechSynthesis.cancel()

  const utterance = new SpeechSynthesisUtterance(text)
  utterance.lang = 'ja-JP'
  utterance.rate = rate

  const voices = window.speechSynthesis.getVoices()
  const japaneseVoice = voices.find((v) => v.lang.startsWith('ja'))
  if (japaneseVoice) {
    utterance.voice = japaneseVoice
  }

  window.speechSynthesis.speak(utterance)
  return true
}

/**
 * Looks up a group by its ID from the given groups constant.
 */
export function getGroupById(
  groupId: string,
  groups: KanaGroup[] = HIRAGANA_GROUPS,
): KanaGroup | undefined {
  return groups.find((g) => g.id === groupId)
}

/**
 * Filters characters by group and sorts by display_order.
 */
export function getCharactersByGroup(
  characters: KanaCharacter[],
  groupId: string,
): KanaCharacter[] {
  return characters
    .filter((c) => c.group === groupId)
    .sort((a, b) => a.display_order - b.display_order)
}
