/**
 * Step 4: Apply JLPT levels and select top 10,000 words
 *
 * Reads JLPT N5/N4/N3/N2/N1 lists, matches to enriched words,
 * then selects top 10,000 prioritized by:
 *   1. Has both frequency rank AND JLPT level (sorted by rank ascending)
 *   2. Has frequency rank only (sorted by rank ascending)
 *   3. Has JLPT level only (fills remaining slots)
 *
 * JLPT list format (wkei/jlpt-vocab-api):
 *   [{ "word": "食べる", "meaning": "to eat", "furigana": "たべる", "romaji": "taberu", "level": 5 }, ...]
 */

import * as fs from 'fs'
import * as path from 'path'
import type { EnrichedWord } from './lib/types'

const CACHE_DIR = path.join(__dirname, '.cache')
const INPUT_FILE = path.join(CACHE_DIR, 'intermediate', '02-with-frequency.json')
const OUTPUT_FILE = path.join(CACHE_DIR, 'intermediate', '03-with-jlpt.json')

const TARGET_COUNT = 10000

interface JlptEntry {
  word: string
  meaning: string
  furigana: string
}

function loadJlptList(filename: string): JlptEntry[] {
  const filePath = path.join(CACHE_DIR, filename)
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'))
}

export default async function applyJlpt(): Promise<{ count: number; outputFile: string }> {
  // Load JLPT lists
  const jlptLists: Array<{ level: string; entries: JlptEntry[] }> = [
    { level: 'N5', entries: loadJlptList('jlpt-n5.json') },
    { level: 'N4', entries: loadJlptList('jlpt-n4.json') },
    { level: 'N3', entries: loadJlptList('jlpt-n3.json') },
    { level: 'N2', entries: loadJlptList('jlpt-n2.json') },
    { level: 'N1', entries: loadJlptList('jlpt-n1.json') },
  ]

  // Build JLPT lookup: word → level (lowest level wins, i.e. N5 < N4 < N3)
  const jlptMap = new Map<string, string>()
  const jlptByReading = new Map<string, string>()

  for (const { level, entries } of jlptLists) {
    console.log(`  JLPT ${level}: ${entries.length} entries`)
    for (const entry of entries) {
      // Only assign if not already set (lowest level wins)
      if (!jlptMap.has(entry.word)) {
        jlptMap.set(entry.word, level)
      }
      if (entry.furigana && !jlptByReading.has(entry.furigana)) {
        jlptByReading.set(entry.furigana, level)
      }
    }
  }

  console.log(`  Total JLPT entries: ${jlptMap.size}`)

  // Read enriched words
  const words: EnrichedWord[] = JSON.parse(fs.readFileSync(INPUT_FILE, 'utf-8'))
  console.log(`  Input words: ${words.length.toLocaleString()}`)

  // Apply JLPT levels
  let jlptMatched = 0
  for (const w of words) {
    const level = jlptMap.get(w.word) || jlptByReading.get(w.reading) || null
    if (level) {
      w.jlpt_level = level
      jlptMatched++
    }
  }
  console.log(`  JLPT matched: ${jlptMatched.toLocaleString()}`)

  // Split into priority groups
  const bothRankAndJlpt = words
    .filter((w) => w.frequency_rank !== null && w.jlpt_level !== null)
    .sort((a, b) => a.frequency_rank! - b.frequency_rank!)

  const rankOnly = words
    .filter((w) => w.frequency_rank !== null && w.jlpt_level === null)
    .sort((a, b) => a.frequency_rank! - b.frequency_rank!)

  const jlptOnly = words.filter((w) => w.frequency_rank === null && w.jlpt_level !== null)

  console.log(
    `  Group 1 (freq + JLPT): ${bothRankAndJlpt.length.toLocaleString()}`
  )
  console.log(`  Group 2 (freq only): ${rankOnly.length.toLocaleString()}`)
  console.log(`  Group 3 (JLPT only): ${jlptOnly.length.toLocaleString()}`)

  // Select top 3,000
  const selected: EnrichedWord[] = []
  const selectedWords = new Set<string>()

  const addWords = (source: EnrichedWord[], limit: number) => {
    for (const w of source) {
      if (selected.length >= limit) break
      if (selectedWords.has(w.word)) continue
      selectedWords.add(w.word)
      selected.push(w)
    }
  }

  addWords(bothRankAndJlpt, TARGET_COUNT)
  addWords(rankOnly, TARGET_COUNT)
  addWords(jlptOnly, TARGET_COUNT)

  console.log(`\n  Selected: ${selected.length.toLocaleString()} words`)

  // Stats
  const n5 = selected.filter((w) => w.jlpt_level === 'N5').length
  const n4 = selected.filter((w) => w.jlpt_level === 'N4').length
  const n3 = selected.filter((w) => w.jlpt_level === 'N3').length
  const n2 = selected.filter((w) => w.jlpt_level === 'N2').length
  const n1 = selected.filter((w) => w.jlpt_level === 'N1').length
  const noLevel = selected.filter((w) => w.jlpt_level === null).length
  console.log(
    `  JLPT distribution: N5=${n5}, N4=${n4}, N3=${n3}, N2=${n2}, N1=${n1}, none=${noLevel}`
  )

  const withFreq = selected.filter((w) => w.frequency_rank !== null).length
  console.log(`  With frequency rank: ${withFreq}`)

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(selected, null, 2))
  console.log(`  Output: ${OUTPUT_FILE}`)

  return { count: selected.length, outputFile: OUTPUT_FILE }
}
