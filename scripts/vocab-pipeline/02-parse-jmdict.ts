/**
 * Step 2: Parse JMdict
 *
 * Reads jmdict-eng-common.json and extracts word, reading, meaning, POS.
 * Outputs raw-words.json to .cache/intermediate/.
 *
 * jmdict-simplified format:
 * {
 *   "words": [
 *     {
 *       "id": "1000220",
 *       "kanji": [{ "common": true, "text": "明白" }],
 *       "kana": [{ "common": true, "text": "めいはく", "appliesToKanji": ["*"] }],
 *       "sense": [{
 *         "partOfSpeech": ["adjectival nouns or quasi-adjectives (keiyodoshi)", "noun"],
 *         "gloss": [{ "lang": "eng", "text": "obvious" }, ...]
 *       }]
 *     }
 *   ]
 * }
 */

import * as fs from 'fs'
import * as path from 'path'
import { mapPartOfSpeech } from './lib/pos-mapping'
import type { RawWord, WordSense } from './lib/types'

const CACHE_DIR = path.join(__dirname, '.cache')
const INPUT_FILE = path.join(CACHE_DIR, 'jmdict-eng-common.json')
const OUTPUT_FILE = path.join(CACHE_DIR, 'intermediate', '01-raw-words.json')

interface JMdictEntry {
  id: string
  kanji: Array<{ common: boolean; text: string }>
  kana: Array<{ common: boolean; text: string; appliesToKanji: string[] }>
  sense: Array<{
    partOfSpeech: string[]
    gloss: Array<{ lang: string; text: string }>
    field: string[]
    misc: string[]
  }>
}

interface JMdictFile {
  words: JMdictEntry[]
}

export default async function parseJMdict(): Promise<{ count: number; outputFile: string }> {
  console.log('  Reading JMdict...')
  const raw = fs.readFileSync(INPUT_FILE, 'utf-8')
  const data: JMdictFile = JSON.parse(raw)

  console.log(`  Total entries: ${data.words.length.toLocaleString()}`)

  const words: RawWord[] = []
  const seenWords = new Set<string>()

  for (const entry of data.words) {
    // Get the word text: prefer common kanji, fall back to kana
    let word: string | undefined
    let reading: string | undefined

    // Find first common kanji text
    const commonKanji = entry.kanji.find((k) => k.common)
    const firstKanji = entry.kanji[0]

    // Find first common kana reading
    const commonKana = entry.kana.find((k) => k.common)
    const firstKana = entry.kana[0]

    if (commonKanji) {
      word = commonKanji.text
      reading = (commonKana || firstKana)?.text
    } else if (firstKanji) {
      word = firstKanji.text
      reading = (commonKana || firstKana)?.text
    } else {
      // Kana-only word
      word = (commonKana || firstKana)?.text
      reading = word
    }

    if (!word || !reading) continue

    // Skip duplicates (keep first occurrence)
    if (seenWords.has(word)) continue
    seenWords.add(word)

    // Get meaning from first sense
    const firstSense = entry.sense[0]
    if (!firstSense) continue

    const meaning = firstSense.gloss.map((g) => g.text).join('; ')
    if (!meaning) continue

    // Map POS
    const allPos = entry.sense.flatMap((s) => s.partOfSpeech)
    const part_of_speech = mapPartOfSpeech(allPos)

    // Extract all senses
    const senses: WordSense[] = entry.sense.map((s) => ({
      meanings: s.gloss.map((g) => g.text),
      pos: mapPartOfSpeech(s.partOfSpeech),
    }))

    // Determine is_common from kanji or kana
    const is_common = !!(entry.kanji[0]?.common || entry.kana[0]?.common)

    // Derive verb transitivity from POS tags
    const hasVi = allPos.includes('vi')
    const hasVt = allPos.includes('vt')
    let verb_transitivity: RawWord['verb_transitivity'] = null
    if (hasVi && hasVt) verb_transitivity = 'both'
    else if (hasVi) verb_transitivity = 'intransitive'
    else if (hasVt) verb_transitivity = 'transitive'

    // Collect domain and misc tags (deduplicated)
    const domainSet = new Set<string>()
    const miscSet = new Set<string>()
    for (const s of entry.sense) {
      if (s.field) for (const f of s.field) domainSet.add(f)
      if (s.misc) for (const m of s.misc) miscSet.add(m)
    }

    words.push({
      word,
      reading,
      meaning,
      part_of_speech,
      tags: [part_of_speech],
      senses,
      is_common,
      verb_transitivity,
      domain_tags: [...domainSet],
      misc_tags: [...miscSet],
    })
  }

  console.log(`  Parsed ${words.length.toLocaleString()} unique words`)

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(words, null, 2))
  console.log(`  Output: ${OUTPUT_FILE}`)

  return { count: words.length, outputFile: OUTPUT_FILE }
}
