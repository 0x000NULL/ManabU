/**
 * Step 7: Generate seed data JSON files
 *
 * Reads intermediate pipeline data and outputs final JSON files
 * committed to the repo for the seed script to use:
 *   - prisma/data/vocabulary.json
 *   - prisma/data/example-sentences.json
 *   - prisma/data/vocabulary-sentences.json
 */

import * as fs from 'fs'
import * as path from 'path'
import type {
  CuratedWord,
  EnrichedWord,
  SeedSentence,
  SeedVocabSentence,
  SentencePair,
  VocabularySentenceMapping,
} from './lib/types'

const CACHE_DIR = path.join(__dirname, '.cache')
const PROJECT_ROOT = path.resolve(__dirname, '../..')
const DATA_DIR = path.join(PROJECT_ROOT, 'prisma', 'data')

const WORDS_FILE = path.join(CACHE_DIR, 'intermediate', '03-with-jlpt.json')
const SENTENCES_FILE = path.join(CACHE_DIR, 'intermediate', '04-matched-sentences.json')
const MAPPINGS_FILE = path.join(CACHE_DIR, 'intermediate', '04-sentence-mappings.json')

export default async function generateSeedData(): Promise<{
  count: number
  outputFile: string
}> {
  fs.mkdirSync(DATA_DIR, { recursive: true })

  // Read intermediate data
  const enrichedWords: EnrichedWord[] = JSON.parse(fs.readFileSync(WORDS_FILE, 'utf-8'))
  const sentences: SentencePair[] = JSON.parse(fs.readFileSync(SENTENCES_FILE, 'utf-8'))
  const mappings: VocabularySentenceMapping[] = JSON.parse(
    fs.readFileSync(MAPPINGS_FILE, 'utf-8')
  )

  // 1. Generate vocabulary.json
  const vocabulary: CuratedWord[] = enrichedWords.map((w) => ({
    word: w.word,
    reading: w.reading,
    meaning: w.meaning,
    part_of_speech: w.part_of_speech,
    jlpt_level: w.jlpt_level,
    frequency_rank: w.frequency_rank,
    tags: {
      senses: w.senses ?? [],
      is_common: w.is_common ?? false,
      transitivity: w.verb_transitivity ?? null,
      domains: w.domain_tags ?? [],
      misc: w.misc_tags ?? [],
    },
  }))

  const vocabPath = path.join(DATA_DIR, 'vocabulary.json')
  fs.writeFileSync(vocabPath, JSON.stringify(vocabulary, null, 2))
  console.log(`  ✓ vocabulary.json: ${vocabulary.length.toLocaleString()} words`)

  // 2. Generate example-sentences.json
  const seedSentences: SeedSentence[] = sentences.map((s) => ({
    source_id: s.id,
    japanese: s.japanese,
    english: s.english,
  }))

  const sentencesPath = path.join(DATA_DIR, 'example-sentences.json')
  fs.writeFileSync(sentencesPath, JSON.stringify(seedSentences, null, 2))
  console.log(`  ✓ example-sentences.json: ${seedSentences.length.toLocaleString()} sentences`)

  // 3. Generate vocabulary-sentences.json (flat junction mappings)
  const junctions: SeedVocabSentence[] = []
  for (const mapping of mappings) {
    for (const sourceId of mapping.source_ids) {
      junctions.push({
        word: mapping.word,
        source_id: sourceId,
      })
    }
  }

  const junctionsPath = path.join(DATA_DIR, 'vocabulary-sentences.json')
  fs.writeFileSync(junctionsPath, JSON.stringify(junctions, null, 2))
  console.log(`  ✓ vocabulary-sentences.json: ${junctions.length.toLocaleString()} mappings`)

  return { count: vocabulary.length, outputFile: vocabPath }
}
