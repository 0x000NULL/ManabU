import type { KanaRule } from '@/types/kana'

export const KATAKANA_RULES: KanaRule[] = [
  {
    id: 'long-vowel-mark',
    title: 'Long Vowel Mark (ー)',
    description:
      'Unlike hiragana, which doubles the vowel character, katakana uses a special long vowel mark ー (chōon) to indicate a lengthened vowel. This horizontal bar is one of the most common katakana symbols and appears in nearly every loanword.',
    examples: [
      {
        japanese: 'コーヒー',
        romaji: 'koohii',
        meaning: 'coffee',
        explanation:
          'The ー after コ lengthens the "o" sound, and the ー after ヒ lengthens the "i" sound.',
      },
      {
        japanese: 'ケーキ',
        romaji: 'keeki',
        meaning: 'cake',
        explanation:
          'The ー after ケ lengthens the "e" sound: ke → kee.',
      },
      {
        japanese: 'スーパー',
        romaji: 'suupaa',
        meaning: 'supermarket',
        explanation:
          'Two long vowels in one word: ス → スー (suu) and パ → パー (paa).',
      },
      {
        japanese: 'カー vs カ',
        romaji: 'kaa vs ka',
        meaning: 'car vs mosquito',
        explanation:
          'The long vowel mark changes meaning entirely. Always pay attention to ー!',
      },
    ],
  },
  {
    id: 'foreign-sounds',
    title: 'Foreign Sound Combinations',
    description:
      'Katakana has special combinations not found in hiragana, created to represent foreign sounds more accurately. These use small vowel kana (ァ, ィ, ゥ, ェ, ォ) paired with certain consonants.',
    examples: [
      {
        japanese: 'ファ, フィ, フェ, フォ',
        romaji: 'fa, fi, fe, fo',
        meaning: 'F-sounds',
        explanation:
          'フ + small vowel creates F-sounds: ファイル (fairu, file), フィルム (firumu, film), カフェ (kafe, café), フォーク (fooku, fork).',
      },
      {
        japanese: 'ティ, ディ',
        romaji: 'ti, di',
        meaning: 'English T/D + I sounds',
        explanation:
          'テ/デ + small ィ: パーティー (paatii, party), ディスク (disuku, disk). Standard チ/ジ sound different from English "ti"/"di".',
      },
      {
        japanese: 'ヴ',
        romaji: 'vu',
        meaning: 'V-sound',
        explanation:
          'ウ with dakuten creates the V sound: ヴァイオリン (vaiorin, violin). Some writers use バ行 instead.',
      },
      {
        japanese: 'ウィ, ウェ, ウォ',
        romaji: 'wi, we, wo',
        meaning: 'W-sounds',
        explanation:
          'ウ + small vowel: ウィンドウ (windou, window), ウェブ (webu, web), ウォーター (wootaa, water).',
      },
    ],
  },
  {
    id: 'small-tsu',
    title: 'Small Tsu (ッ) — Double Consonants',
    description:
      'Just like hiragana っ, the small katakana ッ indicates a double consonant. It creates a brief pause before the next consonant. Very common in loanwords that have double letters in the source language.',
    examples: [
      {
        japanese: 'サッカー',
        romaji: 'sakkaa',
        meaning: 'soccer',
        explanation:
          'The small ッ before カ doubles the "k" sound: sa-k-kaa. Hold the K briefly.',
      },
      {
        japanese: 'ロッカー',
        romaji: 'rokkaa',
        meaning: 'locker',
        explanation:
          'The small ッ before カ doubles the K: ro-k-kaa.',
      },
      {
        japanese: 'ベッド',
        romaji: 'beddo',
        meaning: 'bed',
        explanation:
          'The small ッ before ド doubles the D: be-d-do.',
      },
      {
        japanese: 'カップ',
        romaji: 'kappu',
        meaning: 'cup',
        explanation:
          'The small ッ before プ doubles the P: ka-p-pu.',
      },
    ],
  },
  {
    id: 'common-usage',
    title: 'Common Usage Contexts',
    description:
      'Katakana is used in specific contexts beyond just foreign loanwords. Understanding when katakana is used helps with reading comprehension and knowing which script to expect.',
    examples: [
      {
        japanese: 'コンピューター, テレビ',
        romaji: 'konpyuutaa, terebi',
        meaning: 'computer, television',
        explanation:
          'Foreign loanwords (gairaigo) — the most common use. Words borrowed from English and other languages.',
      },
      {
        japanese: 'ワンワン, ニャーニャー',
        romaji: 'wanwan, nyaanyaa',
        meaning: 'woof woof, meow meow',
        explanation:
          'Onomatopoeia — sound effects and animal sounds are often written in katakana.',
      },
      {
        japanese: 'ネコ, イヌ',
        romaji: 'neko, inu',
        meaning: 'cat, dog',
        explanation:
          'Emphasis or stylistic choice — native words sometimes written in katakana for visual emphasis, like italics in English.',
      },
      {
        japanese: 'バラ, サクラ',
        romaji: 'bara, sakura',
        meaning: 'rose, cherry blossom',
        explanation:
          'Scientific and botanical names — plant and animal species are conventionally written in katakana.',
      },
    ],
  },
  {
    id: 'commonly-confused',
    title: 'Commonly Confused Character Pairs',
    description:
      'Several katakana characters look very similar and are a major source of confusion for learners. These pairs require careful attention to stroke direction, angle, and small differences.',
    examples: [
      {
        japanese: 'ソ / ン',
        romaji: 'so / n',
        meaning: 'so vs n',
        explanation:
          'The most notorious pair! ソ (so) has strokes going ↘ downward-right, while ン (n) has strokes going more ↗ upward. Think: ソ "sows" seeds downward, ン tilts up like the end of "n."',
      },
      {
        japanese: 'シ / ツ',
        romaji: 'shi / tsu',
        meaning: 'shi vs tsu',
        explanation:
          'シ (shi) has strokes arranged more vertically (like a sideways smiley), while ツ (tsu) has strokes arranged more horizontally (like three drops falling). シ smiles sideways, ツ drops down.',
      },
      {
        japanese: 'ウ / フ',
        romaji: 'u / fu',
        meaning: 'u vs fu',
        explanation:
          'ウ (u) has a flat top bar with a contained shape below. フ (fu) is just a single open curve. ウ has a lid, フ does not.',
      },
      {
        japanese: 'ク / タ  and  ヌ / ス',
        romaji: 'ku / ta  and  nu / su',
        meaning: 'ku vs ta, nu vs su',
        explanation:
          'ク (ku) has no cross-stroke inside, while タ (ta) has an extra stroke. Similarly, ス (su) has a simpler curve than ヌ (nu) which crosses over itself.',
      },
    ],
  },
]
