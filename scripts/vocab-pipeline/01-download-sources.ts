/**
 * Step 1: Download source data files
 *
 * Downloads 4 sources to .cache/ (idempotent — skips if cached):
 * - JMdict (jmdict-simplified): dictionary data
 * - Leeds frequency list: word frequency rankings
 * - JLPT word lists: N5/N4/N3/N2/N1 level tags
 * - Tatoeba sentences: Japanese-English sentence pairs
 */

import { execSync } from 'child_process'
import * as fs from 'fs'
import * as path from 'path'

const CACHE_DIR = path.join(__dirname, '.cache')
const INTERMEDIATE_DIR = path.join(CACHE_DIR, 'intermediate')

const SOURCES = {
  leedsFrequency: {
    url: 'https://raw.githubusercontent.com/hingston/japanese/master/44998-japanese-words.txt',
    file: 'leeds-frequency.txt',
  },
  jlptN5: {
    url: 'https://raw.githubusercontent.com/wkei/jlpt-vocab-api/main/data-source/db/n5.json',
    file: 'jlpt-n5.json',
  },
  jlptN4: {
    url: 'https://raw.githubusercontent.com/wkei/jlpt-vocab-api/main/data-source/db/n4.json',
    file: 'jlpt-n4.json',
  },
  jlptN3: {
    url: 'https://raw.githubusercontent.com/wkei/jlpt-vocab-api/main/data-source/db/n3.json',
    file: 'jlpt-n3.json',
  },
  jlptN2: {
    url: 'https://raw.githubusercontent.com/wkei/jlpt-vocab-api/main/data-source/db/n2.json',
    file: 'jlpt-n2.json',
  },
  jlptN1: {
    url: 'https://raw.githubusercontent.com/wkei/jlpt-vocab-api/main/data-source/db/n1.json',
    file: 'jlpt-n1.json',
  },
  tatoeba: {
    url: 'https://www.manythings.org/anki/jpn-eng.zip',
    archive: 'jpn-eng.zip',
    extracted: 'jpn-eng.txt',
    renamed: 'tatoeba-jpn-eng.tsv',
  },
}

async function downloadFile(url: string, destPath: string): Promise<void> {
  console.log(`  Downloading: ${path.basename(destPath)}`)
  const response = await fetch(url, {
    headers: { 'User-Agent': 'Wakaru-vocab-pipeline/1.0' },
    redirect: 'follow',
  })

  if (!response.ok) {
    throw new Error(`HTTP ${response.status} downloading ${url}`)
  }

  const buffer = Buffer.from(await response.arrayBuffer())
  fs.writeFileSync(destPath, buffer)
  console.log(`    → ${(buffer.length / 1024 / 1024).toFixed(1)} MB`)
}

/**
 * Fetches the latest jmdict-eng-common release asset URL from GitHub API.
 * Returns the download URL and expected extracted filename.
 */
async function getJmdictLatestUrl(): Promise<{ url: string }> {
  console.log('  Fetching latest JMdict release info...')
  const res = await fetch(
    'https://api.github.com/repos/scriptin/jmdict-simplified/releases/latest',
    { headers: { 'User-Agent': 'Wakaru-vocab-pipeline/1.0' } }
  )
  if (!res.ok) throw new Error(`GitHub API error: ${res.status}`)

  const release = (await res.json()) as {
    assets: Array<{ name: string; browser_download_url: string }>
  }
  const asset = release.assets.find(
    (a) => a.name.startsWith('jmdict-eng-common-') && a.name.endsWith('.json.tgz')
  )
  if (!asset) throw new Error('Could not find jmdict-eng-common tgz asset in latest release')

  return { url: asset.browser_download_url }
}

export default async function downloadSources(): Promise<{ count: number }> {
  fs.mkdirSync(CACHE_DIR, { recursive: true })
  fs.mkdirSync(INTERMEDIATE_DIR, { recursive: true })

  let downloaded = 0

  // 1. JMdict (latest release from GitHub)
  const jmdictFinal = path.join(CACHE_DIR, 'jmdict-eng-common.json')
  if (fs.existsSync(jmdictFinal)) {
    console.log('  ⏭  JMdict already cached')
  } else {
    const { url } = await getJmdictLatestUrl()
    const archivePath = path.join(CACHE_DIR, 'jmdict-eng-common.json.tgz')
    await downloadFile(url, archivePath)
    execSync(`tar -xzf "${archivePath}" -C "${CACHE_DIR}"`)
    // Find the extracted JSON file (name varies by release version)
    const extracted = fs
      .readdirSync(CACHE_DIR)
      .find((f) => f.startsWith('jmdict-eng-common-') && f.endsWith('.json'))
    if (extracted) {
      fs.renameSync(path.join(CACHE_DIR, extracted), jmdictFinal)
    }
    fs.unlinkSync(archivePath)
    downloaded++
    console.log('  ✓ JMdict extracted')
  }

  // 2. Leeds frequency list
  const leedsPath = path.join(CACHE_DIR, SOURCES.leedsFrequency.file)
  if (fs.existsSync(leedsPath)) {
    console.log('  ⏭  Leeds frequency list already cached')
  } else {
    await downloadFile(SOURCES.leedsFrequency.url, leedsPath)
    downloaded++
    console.log('  ✓ Leeds frequency list downloaded')
  }

  // 3. JLPT lists
  for (const level of ['jlptN5', 'jlptN4', 'jlptN3', 'jlptN2', 'jlptN1'] as const) {
    const src = SOURCES[level]
    const destPath = path.join(CACHE_DIR, src.file)
    if (fs.existsSync(destPath)) {
      console.log(`  ⏭  ${src.file} already cached`)
    } else {
      await downloadFile(src.url, destPath)
      downloaded++
      console.log(`  ✓ ${src.file} downloaded`)
    }
  }

  // 4. Tatoeba
  const tatoebaFinal = path.join(CACHE_DIR, SOURCES.tatoeba.renamed)
  if (fs.existsSync(tatoebaFinal)) {
    console.log('  ⏭  Tatoeba sentences already cached')
  } else {
    const archivePath = path.join(CACHE_DIR, SOURCES.tatoeba.archive)
    await downloadFile(SOURCES.tatoeba.url, archivePath)
    execSync(`unzip -o "${archivePath}" -d "${CACHE_DIR}"`)
    // Find the extracted text file (may be jpn-eng.txt or jpn.txt)
    const txtFile = fs
      .readdirSync(CACHE_DIR)
      .find((f) => f.startsWith('jpn') && f.endsWith('.txt') && !f.startsWith('_'))
    if (txtFile) {
      fs.renameSync(path.join(CACHE_DIR, txtFile), tatoebaFinal)
    }
    // Clean up archive and any attribution file
    fs.unlinkSync(archivePath)
    const attrFile = path.join(CACHE_DIR, '_about.txt')
    if (fs.existsSync(attrFile)) fs.unlinkSync(attrFile)
    downloaded++
    console.log('  ✓ Tatoeba sentences extracted')
  }

  console.log(`\n  Downloaded ${downloaded} new source(s)`)
  return { count: downloaded }
}
