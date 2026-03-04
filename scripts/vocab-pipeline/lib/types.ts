/** A single sense extracted from JMdict */
export interface WordSense {
  meanings: string[]
  pos: string
}

/** Raw word extracted from JMdict */
export interface RawWord {
  word: string
  reading: string
  meaning: string
  part_of_speech: string
  tags: string[]
  senses: WordSense[]
  is_common: boolean
  verb_transitivity: 'transitive' | 'intransitive' | 'both' | null
  domain_tags: string[]
  misc_tags: string[]
}

/** Word enriched with frequency and JLPT data */
export interface EnrichedWord extends RawWord {
  frequency_rank: number | null
  jlpt_level: string | null
}

/** Rich metadata tags for seed data */
export interface RichTags {
  senses: WordSense[]
  is_common: boolean
  transitivity: 'transitive' | 'intransitive' | 'both' | null
  domains: string[]
  misc: string[]
}

/** Final curated word ready for seed data */
export interface CuratedWord {
  word: string
  reading: string
  meaning: string
  part_of_speech: string
  jlpt_level: string | null
  frequency_rank: number | null
  tags: RichTags
}

/** Tatoeba sentence pair */
export interface SentencePair {
  id: string
  japanese: string
  english: string
}

/** Junction mapping: word → sentence source_ids */
export interface VocabularySentenceMapping {
  word: string
  source_ids: string[]
}

/** Seed data sentence record */
export interface SeedSentence {
  source_id: string
  japanese: string
  english: string
}

/** Seed data junction record */
export interface SeedVocabSentence {
  word: string
  source_id: string
}

/** Pipeline step result for logging */
export interface StepResult {
  step: number
  name: string
  outputFile?: string
  count?: number
  duration: number
}
