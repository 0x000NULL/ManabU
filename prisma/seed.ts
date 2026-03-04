import * as fs from 'fs'
import * as path from 'path'
import { Prisma, PrismaClient } from '@prisma/client'
import { HIRAGANA_CHARACTERS } from '../src/lib/constants/hiragana-data'
import { KATAKANA_CHARACTERS } from '../src/lib/constants/katakana-data'
import { N5_GRAMMAR_PATTERNS } from '../src/lib/constants/grammar-data'
import { N4_GRAMMAR_PATTERNS } from '../src/lib/constants/grammar-data-n4'
import { MEDIA_LIBRARY } from '../src/lib/constants/media-data'
import { ALL_LEARNING_PATHS } from '../src/lib/constants/learning-paths'

const prisma = new PrismaClient()

const DATA_DIR = path.join(__dirname, 'data')

interface VocabEntry {
  word: string
  reading: string
  meaning: string
  part_of_speech: string
  jlpt_level: string | null
  frequency_rank: number | null
  tags: string[]
}

interface SentenceEntry {
  source_id: string
  japanese: string
  english: string
}

interface JunctionEntry {
  word: string
  source_id: string
}

async function main() {
  console.log('🌱 Starting database seed...')

  // ============================================================================
  // SEED HIRAGANA (79 characters with mnemonics, example words, stroke data)
  // ============================================================================
  console.log('Seeding Hiragana characters...')
  for (const kana of HIRAGANA_CHARACTERS) {
    await prisma.kana.upsert({
      where: { character: kana.character },
      update: {
        romaji: kana.romaji,
        type: kana.type,
        group: kana.group,
        display_order: kana.display_order,
        is_combination: kana.is_combination,
        stroke_count: kana.stroke_count,
        mnemonic: kana.mnemonic,
        stroke_order_svg: kana.stroke_order_svg,
        audio_url: kana.audio_url,
        example_words: kana.example_words as unknown as Prisma.InputJsonValue,
      },
      create: {
        character: kana.character,
        romaji: kana.romaji,
        type: kana.type,
        group: kana.group,
        display_order: kana.display_order,
        is_combination: kana.is_combination,
        stroke_count: kana.stroke_count,
        mnemonic: kana.mnemonic,
        stroke_order_svg: kana.stroke_order_svg,
        audio_url: kana.audio_url,
        example_words: kana.example_words as unknown as Prisma.InputJsonValue,
      },
    })
  }
  console.log(`✓ Seeded ${HIRAGANA_CHARACTERS.length} hiragana characters`)

  // ============================================================================
  // SEED KATAKANA (79 characters with mnemonics, example words, stroke data)
  // ============================================================================
  console.log('Seeding Katakana characters...')
  for (const kana of KATAKANA_CHARACTERS) {
    await prisma.kana.upsert({
      where: { character: kana.character },
      update: {
        romaji: kana.romaji,
        type: kana.type,
        group: kana.group,
        display_order: kana.display_order,
        is_combination: kana.is_combination,
        stroke_count: kana.stroke_count,
        mnemonic: kana.mnemonic,
        stroke_order_svg: kana.stroke_order_svg,
        audio_url: kana.audio_url,
        example_words: kana.example_words as unknown as Prisma.InputJsonValue,
      },
      create: {
        character: kana.character,
        romaji: kana.romaji,
        type: kana.type,
        group: kana.group,
        display_order: kana.display_order,
        is_combination: kana.is_combination,
        stroke_count: kana.stroke_count,
        mnemonic: kana.mnemonic,
        stroke_order_svg: kana.stroke_order_svg,
        audio_url: kana.audio_url,
        example_words: kana.example_words as unknown as Prisma.InputJsonValue,
      },
    })
  }
  console.log(`✓ Seeded ${KATAKANA_CHARACTERS.length} katakana characters`)

  // ============================================================================
  // SEED VOCABULARY (from pipeline-generated JSON)
  // ============================================================================
  const vocabPath = path.join(DATA_DIR, 'vocabulary.json')
  if (fs.existsSync(vocabPath)) {
    const vocabData: VocabEntry[] = JSON.parse(fs.readFileSync(vocabPath, 'utf-8'))
    console.log(`Seeding ${vocabData.length.toLocaleString()} vocabulary items...`)

    // Batch upsert in chunks for performance
    const BATCH_SIZE = 100
    for (let i = 0; i < vocabData.length; i += BATCH_SIZE) {
      const batch = vocabData.slice(i, i + BATCH_SIZE)
      await Promise.all(
        batch.map((vocab) =>
          prisma.vocabulary.upsert({
            where: { word: vocab.word },
            update: {
              reading: vocab.reading,
              meaning: vocab.meaning,
              part_of_speech: vocab.part_of_speech,
              jlpt_level: vocab.jlpt_level,
              frequency_rank: vocab.frequency_rank,
              tags: vocab.tags,
            },
            create: vocab,
          })
        )
      )
      if ((i + BATCH_SIZE) % 500 === 0 || i + BATCH_SIZE >= vocabData.length) {
        console.log(
          `  Progress: ${Math.min(i + BATCH_SIZE, vocabData.length)} / ${vocabData.length}`
        )
      }
    }
    console.log(`✓ Seeded ${vocabData.length.toLocaleString()} vocabulary items`)
  } else {
    console.log('⏭  No vocabulary.json found, skipping vocabulary seed')
    console.log('   Run: npx tsx scripts/vocab-pipeline/run-pipeline.ts')
  }

  // ============================================================================
  // SEED EXAMPLE SENTENCES (from pipeline-generated JSON)
  // ============================================================================
  const sentencesPath = path.join(DATA_DIR, 'example-sentences.json')
  if (fs.existsSync(sentencesPath)) {
    const sentencesData: SentenceEntry[] = JSON.parse(
      fs.readFileSync(sentencesPath, 'utf-8')
    )
    console.log(`Seeding ${sentencesData.length.toLocaleString()} example sentences...`)

    const BATCH_SIZE = 100
    for (let i = 0; i < sentencesData.length; i += BATCH_SIZE) {
      const batch = sentencesData.slice(i, i + BATCH_SIZE)
      await Promise.all(
        batch.map((s) =>
          prisma.exampleSentence.upsert({
            where: { source_id: s.source_id },
            update: {
              japanese: s.japanese,
              english: s.english,
            },
            create: {
              source_id: s.source_id,
              japanese: s.japanese,
              english: s.english,
            },
          })
        )
      )
      if ((i + BATCH_SIZE) % 1000 === 0 || i + BATCH_SIZE >= sentencesData.length) {
        console.log(
          `  Progress: ${Math.min(i + BATCH_SIZE, sentencesData.length)} / ${sentencesData.length}`
        )
      }
    }
    console.log(`✓ Seeded ${sentencesData.length.toLocaleString()} example sentences`)
  } else {
    console.log('⏭  No example-sentences.json found, skipping sentences seed')
  }

  // ============================================================================
  // SEED VOCABULARY-SENTENCE JUNCTIONS (from pipeline-generated JSON)
  // ============================================================================
  const junctionsPath = path.join(DATA_DIR, 'vocabulary-sentences.json')
  if (fs.existsSync(junctionsPath)) {
    const junctionsData: JunctionEntry[] = JSON.parse(
      fs.readFileSync(junctionsPath, 'utf-8')
    )
    console.log(
      `Seeding ${junctionsData.length.toLocaleString()} vocabulary-sentence mappings...`
    )

    // Build lookup maps for resolving word → vocabulary.id and source_id → sentence.id
    const vocabIdMap = new Map<string, string>()
    const allVocab = await prisma.vocabulary.findMany({ select: { id: true, word: true } })
    for (const v of allVocab) vocabIdMap.set(v.word, v.id)

    const sentenceIdMap = new Map<string, string>()
    const allSentences = await prisma.exampleSentence.findMany({
      select: { id: true, source_id: true },
    })
    for (const s of allSentences) {
      if (s.source_id) sentenceIdMap.set(s.source_id, s.id)
    }

    let created = 0
    let skipped = 0
    const BATCH_SIZE = 100
    for (let i = 0; i < junctionsData.length; i += BATCH_SIZE) {
      const batch = junctionsData.slice(i, i + BATCH_SIZE)
      const validEntries = batch
        .map((j) => ({
          vocabulary_id: vocabIdMap.get(j.word),
          sentence_id: sentenceIdMap.get(j.source_id),
        }))
        .filter(
          (e): e is { vocabulary_id: string; sentence_id: string } =>
            e.vocabulary_id !== undefined && e.sentence_id !== undefined
        )

      if (validEntries.length > 0) {
        await prisma.vocabularySentence.createMany({
          data: validEntries,
          skipDuplicates: true,
        })
        created += validEntries.length
      }
      skipped += batch.length - validEntries.length
    }
    console.log(`✓ Seeded ${created.toLocaleString()} junctions (${skipped} skipped)`)
  } else {
    console.log('⏭  No vocabulary-sentences.json found, skipping junctions seed')
  }

  // ============================================================================
  // SEED GRAMMAR PATTERNS (from constants)
  // ============================================================================
  console.log('Seeding grammar patterns...')
  const ALL_GRAMMAR_PATTERNS = [...N5_GRAMMAR_PATTERNS, ...N4_GRAMMAR_PATTERNS]
  for (const entry of ALL_GRAMMAR_PATTERNS) {
    const { examples, ...patternData } = entry
    const upserted = await prisma.grammarPattern.upsert({
      where: { pattern: entry.pattern },
      update: patternData,
      create: patternData,
    })

    // Replace examples: delete existing, then create fresh
    await prisma.grammarExample.deleteMany({
      where: { pattern_id: upserted.id },
    })
    if (examples.length > 0) {
      await prisma.grammarExample.createMany({
        data: examples.map((ex) => ({
          pattern_id: upserted.id,
          japanese: ex.japanese,
          english: ex.english,
          furigana: ex.furigana ?? null,
        })),
      })
    }
  }
  console.log(`✓ Seeded ${ALL_GRAMMAR_PATTERNS.length} grammar patterns with examples`)

  // ============================================================================
  // SEED MEDIA CONTENT (from constants)
  // ============================================================================
  console.log('Seeding media content...')
  for (const entry of MEDIA_LIBRARY) {
    const { episodes, streaming_url, subtitle_source, ...contentData } = entry
    const upserted = await prisma.mediaContent.upsert({
      where: { title: entry.title },
      update: {
        title_english: contentData.title_english,
        type: contentData.type,
        difficulty: contentData.difficulty,
        jlpt_level: contentData.jlpt_level,
        description: contentData.description,
        genres: contentData.genres,
      },
      create: {
        title: contentData.title,
        title_english: contentData.title_english,
        type: contentData.type,
        difficulty: contentData.difficulty,
        jlpt_level: contentData.jlpt_level,
        description: contentData.description,
        genres: contentData.genres,
      },
    })

    // Replace episodes: delete existing, then create fresh
    await prisma.mediaEpisode.deleteMany({
      where: { media_id: upserted.id },
    })
    if (episodes.length > 0) {
      await prisma.mediaEpisode.createMany({
        data: episodes.map((ep) => ({
          media_id: upserted.id,
          episode_number: ep.episode_number,
          title: ep.title,
          duration_seconds: ep.duration_seconds,
          subtitle_ja_url: ep.subtitle_ja_url,
          subtitle_en_url: ep.subtitle_en_url,
        })),
      })
    }
  }
  console.log(`✓ Seeded ${MEDIA_LIBRARY.length} media titles with episodes`)

  // ============================================================================
  // SEED LEARNING PATHS (from constants)
  // ============================================================================
  console.log('Seeding learning paths...')
  for (let i = 0; i < ALL_LEARNING_PATHS.length; i++) {
    const lp = ALL_LEARNING_PATHS[i]
    const isAvailable = lp.milestones.length > 0

    const upserted = await prisma.learningPath.upsert({
      where: { slug: lp.slug },
      update: {
        name: lp.name,
        jlpt_level: lp.jlptLevel,
        description: lp.description,
        display_order: i,
        is_available: isAvailable,
      },
      create: {
        name: lp.name,
        slug: lp.slug,
        jlpt_level: lp.jlptLevel,
        description: lp.description,
        display_order: i,
        is_available: isAvailable,
      },
    })

    // Replace milestones: delete existing, then create fresh
    await prisma.learningPathMilestone.deleteMany({
      where: { path_id: upserted.id },
    })

    if (lp.milestones.length > 0) {
      // Resolve dynamic target counts
      const milestoneData = []
      for (let j = 0; j < lp.milestones.length; j++) {
        const m = lp.milestones[j]
        let targetCount: number
        if (m.targetCount === 'dynamic') {
          // Query actual count from DB
          if (m.category === 'grammar' && m.jlptLevel) {
            targetCount = await prisma.grammarPattern.count({
              where: { jlpt_level: m.jlptLevel },
            })
          } else if (m.category === 'vocabulary' && m.jlptLevel) {
            targetCount = await prisma.vocabulary.count({
              where: { jlpt_level: m.jlptLevel },
            })
          } else {
            targetCount = 0
          }
        } else {
          targetCount = m.targetCount
        }

        milestoneData.push({
          path_id: upserted.id,
          title: m.title,
          description: m.description,
          category: m.category,
          target_count: targetCount,
          display_order: j,
          jlpt_level: m.jlptLevel ?? null,
          is_blocked: m.blocked ?? false,
          link_href: m.linkHref ?? null,
        })
      }

      await prisma.learningPathMilestone.createMany({ data: milestoneData })
    }
  }
  console.log(`✓ Seeded ${ALL_LEARNING_PATHS.length} learning paths with milestones`)

  console.log('✅ Database seed completed!')
}

main()
  .catch(e => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
