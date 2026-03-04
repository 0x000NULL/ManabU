/**
 * Convert katakana string to hiragana.
 * Kuromoji returns readings in katakana; this converts them to hiragana for display.
 */
export function katakanaToHiragana(str: string): string {
  return str.replace(/[\u30A1-\u30F6]/g, (ch) =>
    String.fromCharCode(ch.charCodeAt(0) - 0x60),
  )
}
