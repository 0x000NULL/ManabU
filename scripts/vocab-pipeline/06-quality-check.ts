/**
 * Step 6: Quality check
 *
 * Validates every word has:
 * - Non-empty word, reading, meaning
 * - Valid POS value
 * - Valid JLPT level (N5/N4/N3/N2/N1) or null
 *
 * Reports stats and any issues found.
 */

import * as fs from 'fs'
import * as path from 'path'
import { VALID_POS } from './lib/pos-mapping'
import type { EnrichedWord, SentencePair, VocabularySentenceMapping } from './lib/types'

const CACHE_DIR = path.join(__dirname, '.cache')
const WORDS_FILE = path.join(CACHE_DIR, 'intermediate', '03-with-jlpt.json')
const SENTENCES_FILE = path.join(CACHE_DIR, 'intermediate', '04-matched-sentences.json')
const MAPPINGS_FILE = path.join(CACHE_DIR, 'intermediate', '04-sentence-mappings.json')

const VALID_JLPT = ['N5', 'N4', 'N3', 'N2', 'N1', null]

export default async function qualityCheck(): Promise<{ count: number }> {
  const words: EnrichedWord[] = JSON.parse(fs.readFileSync(WORDS_FILE, 'utf-8'))
  const sentences: SentencePair[] = JSON.parse(fs.readFileSync(SENTENCES_FILE, 'utf-8'))
  const mappings: VocabularySentenceMapping[] = JSON.parse(
    fs.readFileSync(MAPPINGS_FILE, 'utf-8')
  )

  const issues: string[] = []
  const validPosSet = new Set<string>(VALID_POS)

  // Validate words
  for (let i = 0; i < words.length; i++) {
    const w = words[i]
    if (!w.word) issues.push(`Word ${i}: empty word`)
    if (!w.reading) issues.push(`Word ${i} (${w.word}): empty reading`)
    if (!w.meaning) issues.push(`Word ${i} (${w.word}): empty meaning`)
    if (!validPosSet.has(w.part_of_speech)) {
      issues.push(`Word ${i} (${w.word}): invalid POS "${w.part_of_speech}"`)
    }
    if (w.jlpt_level !== null && !['N5', 'N4', 'N3', 'N2', 'N1'].includes(w.jlpt_level)) {
      issues.push(`Word ${i} (${w.word}): invalid JLPT "${w.jlpt_level}"`)
    }
  }

  // Validate sentences
  for (let i = 0; i < sentences.length; i++) {
    const s = sentences[i]
    if (!s.id) issues.push(`Sentence ${i}: empty id`)
    if (!s.japanese) issues.push(`Sentence ${i}: empty japanese`)
    if (!s.english) issues.push(`Sentence ${i}: empty english`)
  }

  // Check for duplicate words
  const wordSet = new Set<string>()
  let dupes = 0
  for (const w of words) {
    if (wordSet.has(w.word)) dupes++
    wordSet.add(w.word)
  }
  if (dupes > 0) issues.push(`${dupes} duplicate words found`)

  // Stats
  console.log('  === Quality Report ===')
  console.log(`  Words: ${words.length.toLocaleString()}`)
  console.log(`  Sentences: ${sentences.length.toLocaleString()}`)
  console.log(
    `  Mappings: ${mappings.reduce((s, m) => s + m.source_ids.length, 0).toLocaleString()}`
  )

  // POS distribution
  const posCounts: Record<string, number> = {}
  for (const w of words) {
    posCounts[w.part_of_speech] = (posCounts[w.part_of_speech] || 0) + 1
  }
  console.log('\n  POS distribution:')
  for (const [pos, count] of Object.entries(posCounts).sort((a, b) => b[1] - a[1])) {
    console.log(`    ${pos}: ${count}`)
  }

  // JLPT distribution
  const jlptCounts: Record<string, number> = {}
  for (const w of words) {
    const level = w.jlpt_level || 'none'
    jlptCounts[level] = (jlptCounts[level] || 0) + 1
  }
  console.log('\n  JLPT distribution:')
  for (const [level, count] of Object.entries(jlptCounts).sort()) {
    console.log(`    ${level}: ${count}`)
  }

  // Frequency stats
  const withFreq = words.filter((w) => w.frequency_rank !== null)
  if (withFreq.length > 0) {
    const ranks = withFreq.map((w) => w.frequency_rank!).sort((a, b) => a - b)
    console.log(
      `\n  Frequency rank range: ${ranks[0]} - ${ranks[ranks.length - 1]}`
    )
  }

  // Sentence coverage
  const wordsWithSentences = new Set(mappings.map((m) => m.word))
  console.log(
    `\n  Words with sentences: ${wordsWithSentences.size} / ${words.length} (${((wordsWithSentences.size / words.length) * 100).toFixed(1)}%)`
  )

  if (issues.length > 0) {
    console.log(`\n  ⚠  ${issues.length} issue(s) found:`)
    for (const issue of issues.slice(0, 20)) {
      console.log(`    - ${issue}`)
    }
    if (issues.length > 20) {
      console.log(`    ... and ${issues.length - 20} more`)
    }
  } else {
    console.log('\n  ✓ No issues found')
  }

  return { count: issues.length }
}
