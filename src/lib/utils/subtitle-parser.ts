import { readFile } from 'fs/promises'
import path from 'path'

export interface SubtitleCue {
  index: number
  startTime: string
  endTime: string
  startSeconds: number
  endSeconds: number
  text: string
}

function timeToSeconds(time: string): number {
  const [h, m, rest] = time.split(':')
  const [s, ms] = rest.split(',')
  return parseInt(h) * 3600 + parseInt(m) * 60 + parseInt(s) + parseInt(ms) / 1000
}

/**
 * Convert ASS timestamp (H:MM:SS.cc) to seconds.
 * ASS uses centiseconds (two decimal digits), not milliseconds.
 */
function assTimeToSeconds(time: string): number {
  const [h, m, rest] = time.split(':')
  return parseInt(h) * 3600 + parseInt(m) * 60 + parseFloat(rest)
}

/**
 * Strip ASS override tags like {\b1}, {\i0}, {\pos(x,y)}, etc.
 * Also convert \N and \n line breaks to newlines.
 */
function stripAssTags(text: string): string {
  return text
    .replace(/\{[^}]*\}/g, '')
    .replace(/\\N/g, '\n')
    .replace(/\\n/g, '\n')
    .trim()
}

export function parseAss(content: string): SubtitleCue[] {
  const normalized = content.replace(/\r\n/g, '\n').replace(/\r/g, '\n')
  const lines = normalized.split('\n')

  // Find the [Events] section and its Format line
  let inEvents = false
  let formatFields: string[] = []
  const cues: SubtitleCue[] = []
  let index = 1

  for (const line of lines) {
    const trimmed = line.trim()

    if (trimmed.startsWith('[')) {
      inEvents = trimmed.toLowerCase() === '[events]'
      continue
    }

    if (!inEvents) continue

    if (trimmed.toLowerCase().startsWith('format:')) {
      formatFields = trimmed
        .slice(7)
        .split(',')
        .map(f => f.trim().toLowerCase())
      continue
    }

    if (!trimmed.toLowerCase().startsWith('dialogue:')) continue
    if (formatFields.length === 0) continue

    // Split only up to the number of format fields — the Text field may contain commas
    const values = trimmed.slice(9).split(',')
    const textIndex = formatFields.indexOf('text')
    if (textIndex === -1) continue

    // Rejoin from textIndex onward (Text is always last and may contain commas)
    const startIdx = formatFields.indexOf('start')
    const endIdx = formatFields.indexOf('end')
    if (startIdx === -1 || endIdx === -1) continue
    if (values.length <= textIndex) continue

    const startTime = values[startIdx].trim()
    const endTime = values[endIdx].trim()
    const text = stripAssTags(values.slice(textIndex).join(','))

    if (!text) continue

    cues.push({
      index: index++,
      startTime,
      endTime,
      startSeconds: assTimeToSeconds(startTime),
      endSeconds: assTimeToSeconds(endTime),
      text,
    })
  }

  return cues
}

/**
 * Dispatch to the correct parser based on filename extension.
 */
export function parseSubtitleContent(content: string, filename: string): SubtitleCue[] {
  const ext = filename.split('.').pop()?.toLowerCase()
  if (ext === 'ass' || ext === 'ssa') {
    return parseAss(content)
  }
  return parseSrt(content)
}

export function parseSrt(content: string): SubtitleCue[] {
  const normalized = content.replace(/\r\n/g, '\n').replace(/\r/g, '\n')
  const blocks = normalized.trim().split(/\n\n+/)
  const cues: SubtitleCue[] = []

  for (const block of blocks) {
    const lines = block.split('\n')
    if (lines.length < 3) continue

    const index = parseInt(lines[0])
    if (isNaN(index)) continue

    const timeParts = lines[1].split(' --> ')
    if (timeParts.length !== 2) continue

    const startTime = timeParts[0].trim()
    const endTime = timeParts[1].trim()
    const text = lines.slice(2).join('\n')

    cues.push({
      index,
      startTime,
      endTime,
      startSeconds: timeToSeconds(startTime),
      endSeconds: timeToSeconds(endTime),
      text,
    })
  }

  return cues
}

/**
 * Load subtitles from either a remote URL or local filesystem.
 * - If subtitleUrl starts with http:// or https://, fetches from remote
 * - Otherwise, treats as relative path and reads from public/ directory (backwards compat)
 * Returns null on any error (network failure, 404, parse error, etc.)
 */
export async function loadSubtitles(subtitleUrl: string): Promise<SubtitleCue[] | null> {
  try {
    let content: string

    // Remote URL: fetch from network
    if (subtitleUrl.startsWith('http://') || subtitleUrl.startsWith('https://')) {
      const response = await fetch(subtitleUrl)
      if (!response.ok) {
        return null
      }
      content = await response.text()
    } 
    // Local path: read from filesystem (backwards compatibility)
    else {
      const filePath = path.join(process.cwd(), 'public', subtitleUrl)
      content = await readFile(filePath, 'utf-8')
    }

    return parseSubtitleContent(content, subtitleUrl)
  } catch {
    return null
  }
}
