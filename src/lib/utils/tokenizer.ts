import kuromoji from 'kuromoji'
import type { IpadicFeatures, Tokenizer } from 'kuromoji'
import path from 'path'

export interface TokenizedWord {
  surface: string
  baseForm: string
  reading: string
  pos: string
  posDetail: string
  isContentWord: boolean
}

// Japanese POS to English mapping
const POS_MAP: Record<string, string> = {
  名詞: 'noun',
  動詞: 'verb',
  形容詞: 'i-adjective',
  形容動詞: 'na-adjective',
  副詞: 'adverb',
  連体詞: 'pre-noun adjectival',
  接続詞: 'conjunction',
  感動詞: 'interjection',
  助詞: 'particle',
  助動詞: 'auxiliary verb',
  接頭詞: 'prefix',
  記号: 'symbol',
  フィラー: 'filler',
  その他: 'other',
}

// POS types that are interactive (clickable)
const CONTENT_POS = new Set(['名詞', '動詞', '形容詞', '形容動詞', '副詞', '連体詞', '感動詞'])

function isContentWord(token: IpadicFeatures): boolean {
  if (CONTENT_POS.has(token.pos)) {
    // Exclude non-independent noun subtypes (suffixes, numbers as particles, etc.)
    if (token.pos === '名詞' && token.pos_detail_1 === '非自立') return false
    if (token.pos === '名詞' && token.pos_detail_1 === '接尾') return false
    return true
  }
  return false
}

// Singleton tokenizer
let tokenizerInstance: Tokenizer | null = null
let tokenizerPromise: Promise<Tokenizer> | null = null

function getTokenizer(): Promise<Tokenizer> {
  if (tokenizerInstance) return Promise.resolve(tokenizerInstance)
  if (tokenizerPromise) return tokenizerPromise

  tokenizerPromise = new Promise<Tokenizer>((resolve, reject) => {
    const dicPath = path.join(process.cwd(), 'node_modules', 'kuromoji', 'dict')

    kuromoji.builder({ dicPath }).build((err, tokenizer) => {
      if (err) {
        tokenizerPromise = null
        reject(err)
        return
      }
      tokenizerInstance = tokenizer
      resolve(tokenizer)
    })
  })

  return tokenizerPromise
}

// LRU cache for tokenization results
class LRUCache<K, V> {
  private map = new Map<K, V>()
  private readonly maxSize: number

  constructor(maxSize: number) {
    this.maxSize = maxSize
  }

  get(key: K): V | undefined {
    const value = this.map.get(key)
    if (value !== undefined) {
      // Move to end (most recently used)
      this.map.delete(key)
      this.map.set(key, value)
    }
    return value
  }

  set(key: K, value: V): void {
    if (this.map.has(key)) {
      this.map.delete(key)
    } else if (this.map.size >= this.maxSize) {
      // Delete oldest entry
      const firstKey = this.map.keys().next().value
      if (firstKey !== undefined) this.map.delete(firstKey)
    }
    this.map.set(key, value)
  }
}

const tokenCache = new LRUCache<string, TokenizedWord[]>(500)

export async function tokenize(text: string): Promise<TokenizedWord[]> {
  const cached = tokenCache.get(text)
  if (cached) return cached

  const tokenizer = await getTokenizer()
  const tokens = tokenizer.tokenize(text)

  const result: TokenizedWord[] = tokens.map((t) => ({
    surface: t.surface_form,
    baseForm: t.basic_form === '*' ? t.surface_form : t.basic_form,
    reading: t.reading ?? '',
    pos: POS_MAP[t.pos] ?? t.pos,
    posDetail: t.pos_detail_1 === '*' ? '' : t.pos_detail_1,
    isContentWord: isContentWord(t),
  }))

  tokenCache.set(text, result)
  return result
}
