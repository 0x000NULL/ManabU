import { describe, it, expect } from 'vitest'
import { parseAss, parseSrt, parseSubtitleContent } from '@/lib/utils/subtitle-parser'

describe('parseSrt', () => {
  it('parses basic SRT content', () => {
    const srt = `1
00:00:01,000 --> 00:00:03,500
Hello world

2
00:00:05,000 --> 00:00:08,000
Second line`

    const cues = parseSrt(srt)
    expect(cues).toHaveLength(2)
    expect(cues[0]).toMatchObject({
      index: 1,
      startSeconds: 1.0,
      endSeconds: 3.5,
      text: 'Hello world',
    })
    expect(cues[1]).toMatchObject({
      index: 2,
      startSeconds: 5.0,
      endSeconds: 8.0,
      text: 'Second line',
    })
  })

  it('handles multi-line subtitle text', () => {
    const srt = `1
00:00:01,000 --> 00:00:03,000
Line one
Line two`

    const cues = parseSrt(srt)
    expect(cues[0].text).toBe('Line one\nLine two')
  })
})

describe('parseAss', () => {
  const assContent = `[Script Info]
Title: Test
ScriptType: v4.00+

[V4+ Styles]
Format: Name, Fontname, Fontsize
Style: Default,Arial,20

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
Dialogue: 0,0:00:01.00,0:00:03.50,Default,,0,0,0,,Hello world
Dialogue: 0,0:00:05.00,0:00:08.00,Default,,0,0,0,,Second line`

  it('extracts Dialogue lines from [Events] section', () => {
    const cues = parseAss(assContent)
    expect(cues).toHaveLength(2)
    expect(cues[0].text).toBe('Hello world')
    expect(cues[1].text).toBe('Second line')
  })

  it('converts ASS centisecond timestamps correctly', () => {
    const cues = parseAss(assContent)
    expect(cues[0].startSeconds).toBeCloseTo(1.0)
    expect(cues[0].endSeconds).toBeCloseTo(3.5)
    expect(cues[1].startSeconds).toBeCloseTo(5.0)
    expect(cues[1].endSeconds).toBeCloseTo(8.0)
  })

  it('strips override tags from text', () => {
    const ass = `[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
Dialogue: 0,0:00:01.00,0:00:03.00,Default,,0,0,0,,{\\b1}Bold{\\b0} text
Dialogue: 0,0:00:04.00,0:00:06.00,Default,,0,0,0,,{\\i1}Italic{\\i0}
Dialogue: 0,0:00:07.00,0:00:09.00,Default,,0,0,0,,{\\pos(320,50)}Positioned text`

    const cues = parseAss(ass)
    expect(cues[0].text).toBe('Bold text')
    expect(cues[1].text).toBe('Italic')
    expect(cues[2].text).toBe('Positioned text')
  })

  it('converts \\N line breaks to newlines', () => {
    const ass = `[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
Dialogue: 0,0:00:01.00,0:00:03.00,Default,,0,0,0,,Line one\\NLine two`

    const cues = parseAss(ass)
    expect(cues[0].text).toBe('Line one\nLine two')
  })

  it('handles text containing commas', () => {
    const ass = `[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
Dialogue: 0,0:00:01.00,0:00:03.00,Default,,0,0,0,,Hello, world, and goodbye`

    const cues = parseAss(ass)
    expect(cues[0].text).toBe('Hello, world, and goodbye')
  })

  it('skips empty text after tag stripping', () => {
    const ass = `[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
Dialogue: 0,0:00:01.00,0:00:03.00,Default,,0,0,0,,{\\b1}
Dialogue: 0,0:00:04.00,0:00:06.00,Default,,0,0,0,,Real text`

    const cues = parseAss(ass)
    expect(cues).toHaveLength(1)
    expect(cues[0].text).toBe('Real text')
  })

  it('assigns sequential index numbers', () => {
    const cues = parseAss(assContent)
    expect(cues[0].index).toBe(1)
    expect(cues[1].index).toBe(2)
  })

  it('handles hour timestamps correctly', () => {
    const ass = `[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
Dialogue: 0,1:30:00.00,1:30:05.50,Default,,0,0,0,,Late subtitle`

    const cues = parseAss(ass)
    expect(cues[0].startSeconds).toBeCloseTo(5400.0)
    expect(cues[0].endSeconds).toBeCloseTo(5405.5)
  })
})

describe('parseSubtitleContent', () => {
  const srtContent = `1
00:00:01,000 --> 00:00:03,000
Hello`

  const assContent = `[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
Dialogue: 0,0:00:01.00,0:00:03.00,Default,,0,0,0,,Hello`

  it('dispatches to parseSrt for .srt files', () => {
    const cues = parseSubtitleContent(srtContent, 'episode1.srt')
    expect(cues).toHaveLength(1)
    expect(cues[0].text).toBe('Hello')
  })

  it('dispatches to parseAss for .ass files', () => {
    const cues = parseSubtitleContent(assContent, 'episode1.ass')
    expect(cues).toHaveLength(1)
    expect(cues[0].text).toBe('Hello')
  })

  it('dispatches to parseAss for .ssa files', () => {
    const cues = parseSubtitleContent(assContent, 'episode1.ssa')
    expect(cues).toHaveLength(1)
  })

  it('defaults to SRT parser for unknown extensions', () => {
    const cues = parseSubtitleContent(srtContent, 'episode1.txt')
    expect(cues).toHaveLength(1)
  })

  it('handles paths with directories', () => {
    const cues = parseSubtitleContent(assContent, '/subtitles/show/episode1.ass')
    expect(cues).toHaveLength(1)
  })
})
