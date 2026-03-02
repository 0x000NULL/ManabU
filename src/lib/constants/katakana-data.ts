import type { KanaCharacter } from '@/types/kana'

export const KATAKANA_CHARACTERS: KanaCharacter[] = [
  // ===========================================================================
  // GROUP 1: VOWELS (5 characters)
  // ===========================================================================
  {
    character: 'ア',
    romaji: 'a',
    type: 'katakana',
    group: 'vowel',
    display_order: 1,
    is_combination: false,
    stroke_count: 2,
    mnemonic:
      'An Axe chopping downward. The angular strokes resemble the blade and handle of an axe swinging.',
    stroke_order_svg: null,
    audio_url: null,
    example_words: [
      { word: 'アメリカ', reading: 'amerika', meaning: 'America' },
      { word: 'アイス', reading: 'aisu', meaning: 'ice cream' },
      { word: 'アニメ', reading: 'anime', meaning: 'anime' },
    ],
  },
  {
    character: 'イ',
    romaji: 'i',
    type: 'katakana',
    group: 'vowel',
    display_order: 2,
    is_combination: false,
    stroke_count: 2,
    mnemonic:
      'An Easel standing upright. The two strokes look like the legs of an easel holding a canvas.',
    stroke_order_svg: null,
    audio_url: null,
    example_words: [
      { word: 'イギリス', reading: 'igirisu', meaning: 'England' },
      { word: 'インク', reading: 'inku', meaning: 'ink' },
      { word: 'イベント', reading: 'ibento', meaning: 'event' },
    ],
  },
  {
    character: 'ウ',
    romaji: 'u',
    type: 'katakana',
    group: 'vowel',
    display_order: 3,
    is_combination: false,
    stroke_count: 3,
    mnemonic:
      'Looks like a U-shaped container with a lid on top. The top bar seals the U shape below.',
    stroke_order_svg: null,
    audio_url: null,
    example_words: [
      { word: 'ウイルス', reading: 'uirusu', meaning: 'virus' },
      { word: 'ウール', reading: 'uuru', meaning: 'wool' },
      { word: 'ウエスト', reading: 'uesuto', meaning: 'waist' },
    ],
  },
  {
    character: 'エ',
    romaji: 'e',
    type: 'katakana',
    group: 'vowel',
    display_order: 4,
    is_combination: false,
    stroke_count: 3,
    mnemonic:
      'Looks like an Elevator floor indicator. The horizontal bars are the top and bottom floors with a vertical shaft between them.',
    stroke_order_svg: null,
    audio_url: null,
    example_words: [
      { word: 'エネルギー', reading: 'enerugii', meaning: 'energy' },
      { word: 'エレベーター', reading: 'erebeetaa', meaning: 'elevator' },
      { word: 'エアコン', reading: 'eakon', meaning: 'air conditioner' },
    ],
  },
  {
    character: 'オ',
    romaji: 'o',
    type: 'katakana',
    group: 'vowel',
    display_order: 5,
    is_combination: false,
    stroke_count: 3,
    mnemonic:
      'Looks like a man doing an Opera bow. The vertical line is the person and the cross is their arms extended.',
    stroke_order_svg: null,
    audio_url: null,
    example_words: [
      { word: 'オレンジ', reading: 'orenji', meaning: 'orange' },
      { word: 'オフィス', reading: 'ofisu', meaning: 'office' },
      { word: 'オーストラリア', reading: 'oosutoraria', meaning: 'Australia' },
    ],
  },

  // ===========================================================================
  // GROUP 2: K-ROW (5 characters)
  // ===========================================================================
  {
    character: 'カ',
    romaji: 'ka',
    type: 'katakana',
    group: 'k-row',
    display_order: 6,
    is_combination: false,
    stroke_count: 2,
    mnemonic:
      'A Kite being cut in half. The angular shape looks like one side of a kite that has been sliced.',
    stroke_order_svg: null,
    audio_url: null,
    example_words: [
      { word: 'カメラ', reading: 'kamera', meaning: 'camera' },
      { word: 'カレー', reading: 'karee', meaning: 'curry' },
      { word: 'カード', reading: 'kaado', meaning: 'card' },
    ],
  },
  {
    character: 'キ',
    romaji: 'ki',
    type: 'katakana',
    group: 'k-row',
    display_order: 7,
    is_combination: false,
    stroke_count: 3,
    mnemonic:
      'A Key with three prongs. The horizontal lines are the teeth of the key.',
    stroke_order_svg: null,
    audio_url: null,
    example_words: [
      { word: 'キッチン', reading: 'kicchin', meaning: 'kitchen' },
      { word: 'キャンプ', reading: 'kyanpu', meaning: 'camp' },
      { word: 'キロ', reading: 'kiro', meaning: 'kilogram' },
    ],
  },
  {
    character: 'ク',
    romaji: 'ku',
    type: 'katakana',
    group: 'k-row',
    display_order: 8,
    is_combination: false,
    stroke_count: 2,
    mnemonic:
      'A bird beak or Cuckoo bird. The angular shape resembles an open bird beak making a "ku" sound.',
    stroke_order_svg: null,
    audio_url: null,
    example_words: [
      { word: 'クラス', reading: 'kurasu', meaning: 'class' },
      { word: 'クリスマス', reading: 'kurisumasu', meaning: 'Christmas' },
      { word: 'クッキー', reading: 'kukkii', meaning: 'cookie' },
    ],
  },
  {
    character: 'ケ',
    romaji: 'ke',
    type: 'katakana',
    group: 'k-row',
    display_order: 9,
    is_combination: false,
    stroke_count: 3,
    mnemonic:
      'A crooked letter K. You can see the angular K shape with its arms reaching out.',
    stroke_order_svg: null,
    audio_url: null,
    example_words: [
      { word: 'ケーキ', reading: 'keeki', meaning: 'cake' },
      { word: 'ケース', reading: 'keesu', meaning: 'case' },
      { word: 'ケチャップ', reading: 'kechappu', meaning: 'ketchup' },
    ],
  },
  {
    character: 'コ',
    romaji: 'ko',
    type: 'katakana',
    group: 'k-row',
    display_order: 10,
    is_combination: false,
    stroke_count: 2,
    mnemonic:
      'A Corner of a room. Two lines forming a right-angle corner, like the corner of a box.',
    stroke_order_svg: null,
    audio_url: null,
    example_words: [
      { word: 'コーヒー', reading: 'koohii', meaning: 'coffee' },
      { word: 'コンピューター', reading: 'konpyuutaa', meaning: 'computer' },
      { word: 'コート', reading: 'kooto', meaning: 'coat' },
    ],
  },

  // ===========================================================================
  // GROUP 3: S-ROW (5 characters)
  // ===========================================================================
  {
    character: 'サ',
    romaji: 'sa',
    type: 'katakana',
    group: 's-row',
    display_order: 11,
    is_combination: false,
    stroke_count: 3,
    mnemonic:
      'A Samurai sword stuck in the ground. The vertical line is the blade and the horizontal lines are the guard.',
    stroke_order_svg: null,
    audio_url: null,
    example_words: [
      { word: 'サッカー', reading: 'sakkaa', meaning: 'soccer' },
      { word: 'サラダ', reading: 'sarada', meaning: 'salad' },
      { word: 'サイズ', reading: 'saizu', meaning: 'size' },
    ],
  },
  {
    character: 'シ',
    romaji: 'shi',
    type: 'katakana',
    group: 's-row',
    display_order: 12,
    is_combination: false,
    stroke_count: 3,
    mnemonic:
      'A smiling face winking — She is winking at you! The three strokes form a playful face tilted to the side.',
    stroke_order_svg: null,
    audio_url: null,
    example_words: [
      { word: 'シャツ', reading: 'shatsu', meaning: 'shirt' },
      { word: 'システム', reading: 'shisutemu', meaning: 'system' },
      { word: 'シーズン', reading: 'shiizun', meaning: 'season' },
    ],
  },
  {
    character: 'ス',
    romaji: 'su',
    type: 'katakana',
    group: 's-row',
    display_order: 13,
    is_combination: false,
    stroke_count: 2,
    mnemonic:
      'A Ski slope — swoosh! The diagonal line looks like a ski hill with a curve at the bottom.',
    stroke_order_svg: null,
    audio_url: null,
    example_words: [
      { word: 'スーパー', reading: 'suupaa', meaning: 'supermarket' },
      { word: 'スポーツ', reading: 'supootsu', meaning: 'sports' },
      { word: 'スマホ', reading: 'sumaho', meaning: 'smartphone' },
    ],
  },
  {
    character: 'セ',
    romaji: 'se',
    type: 'katakana',
    group: 's-row',
    display_order: 14,
    is_combination: false,
    stroke_count: 2,
    mnemonic:
      'A Sail catching the wind. The vertical line is the mast and the angular stroke is the billowing sail.',
    stroke_order_svg: null,
    audio_url: null,
    example_words: [
      { word: 'セーター', reading: 'seetaa', meaning: 'sweater' },
      { word: 'セット', reading: 'setto', meaning: 'set' },
      { word: 'センター', reading: 'sentaa', meaning: 'center' },
    ],
  },
  {
    character: 'ソ',
    romaji: 'so',
    type: 'katakana',
    group: 's-row',
    display_order: 15,
    is_combination: false,
    stroke_count: 2,
    mnemonic:
      'Two strokes that Sow seeds. The marks look like seeds being scattered from above.',
    stroke_order_svg: null,
    audio_url: null,
    example_words: [
      { word: 'ソフト', reading: 'sofuto', meaning: 'soft / software' },
      { word: 'ソース', reading: 'soosu', meaning: 'sauce' },
      { word: 'ソファー', reading: 'sofaa', meaning: 'sofa' },
    ],
  },

  // ===========================================================================
  // GROUP 4: T-ROW (5 characters)
  // ===========================================================================
  {
    character: 'タ',
    romaji: 'ta',
    type: 'katakana',
    group: 't-row',
    display_order: 16,
    is_combination: false,
    stroke_count: 3,
    mnemonic:
      'Looks like a clothes Tag. The angular shape resembles a price tag hanging from clothing.',
    stroke_order_svg: null,
    audio_url: null,
    example_words: [
      { word: 'タクシー', reading: 'takushii', meaning: 'taxi' },
      { word: 'タオル', reading: 'taoru', meaning: 'towel' },
      { word: 'タイプ', reading: 'taipu', meaning: 'type' },
    ],
  },
  {
    character: 'チ',
    romaji: 'chi',
    type: 'katakana',
    group: 't-row',
    display_order: 17,
    is_combination: false,
    stroke_count: 3,
    mnemonic:
      'A Cheerleader doing a split. The top horizontal line is the arms and the lower strokes are the legs.',
    stroke_order_svg: null,
    audio_url: null,
    example_words: [
      { word: 'チーズ', reading: 'chiizu', meaning: 'cheese' },
      { word: 'チケット', reading: 'chiketto', meaning: 'ticket' },
      { word: 'チョコレート', reading: 'chokoreeto', meaning: 'chocolate' },
    ],
  },
  {
    character: 'ツ',
    romaji: 'tsu',
    type: 'katakana',
    group: 't-row',
    display_order: 18,
    is_combination: false,
    stroke_count: 3,
    mnemonic:
      'Three drops of water — TSUnami! The three dots look like water droplets splashing.',
    stroke_order_svg: null,
    audio_url: null,
    example_words: [
      { word: 'ツアー', reading: 'tsuaa', meaning: 'tour' },
      { word: 'ツール', reading: 'tsuuru', meaning: 'tool' },
      { word: 'ツイッター', reading: 'tsuittaa', meaning: 'Twitter' },
    ],
  },
  {
    character: 'テ',
    romaji: 'te',
    type: 'katakana',
    group: 't-row',
    display_order: 19,
    is_combination: false,
    stroke_count: 3,
    mnemonic:
      'A Telephone pole. The horizontal line on top is the wire, with the pole going down and a support beam.',
    stroke_order_svg: null,
    audio_url: null,
    example_words: [
      { word: 'テレビ', reading: 'terebi', meaning: 'television' },
      { word: 'テスト', reading: 'tesuto', meaning: 'test' },
      { word: 'テーブル', reading: 'teeburu', meaning: 'table' },
    ],
  },
  {
    character: 'ト',
    romaji: 'to',
    type: 'katakana',
    group: 't-row',
    display_order: 20,
    is_combination: false,
    stroke_count: 2,
    mnemonic:
      'A Totem pole viewed from the side. The vertical line with a small branch sticking out.',
    stroke_order_svg: null,
    audio_url: null,
    example_words: [
      { word: 'トマト', reading: 'tomato', meaning: 'tomato' },
      { word: 'トイレ', reading: 'toire', meaning: 'toilet' },
      { word: 'トラック', reading: 'torakku', meaning: 'truck' },
    ],
  },

  // ===========================================================================
  // GROUP 5: N-ROW (5 characters)
  // ===========================================================================
  {
    character: 'ナ',
    romaji: 'na',
    type: 'katakana',
    group: 'n-row',
    display_order: 21,
    is_combination: false,
    stroke_count: 2,
    mnemonic:
      'A Knife cutting diagonally. The cross shape looks like a knife slicing through something.',
    stroke_order_svg: null,
    audio_url: null,
    example_words: [
      { word: 'ナイフ', reading: 'naifu', meaning: 'knife' },
      { word: 'ナンバー', reading: 'nanbaa', meaning: 'number' },
      { word: 'ナプキン', reading: 'napukin', meaning: 'napkin' },
    ],
  },
  {
    character: 'ニ',
    romaji: 'ni',
    type: 'katakana',
    group: 'n-row',
    display_order: 22,
    is_combination: false,
    stroke_count: 2,
    mnemonic:
      'Two horizontal lines — a Knee bending. Also looks like the number two (ni means two in Japanese).',
    stroke_order_svg: null,
    audio_url: null,
    example_words: [
      { word: 'ニュース', reading: 'nyuusu', meaning: 'news' },
      { word: 'ニット', reading: 'nitto', meaning: 'knit' },
      { word: 'ニコニコ', reading: 'nikoniko', meaning: 'smiling' },
    ],
  },
  {
    character: 'ヌ',
    romaji: 'nu',
    type: 'katakana',
    group: 'n-row',
    display_order: 23,
    is_combination: false,
    stroke_count: 2,
    mnemonic:
      'Noodles on chopsticks. The crossing strokes look like noodles being twirled around chopsticks.',
    stroke_order_svg: null,
    audio_url: null,
    example_words: [
      { word: 'ヌードル', reading: 'nuudoru', meaning: 'noodle' },
      { word: 'カヌー', reading: 'kanuu', meaning: 'canoe' },
      { word: 'メニュー', reading: 'menyuu', meaning: 'menu' },
    ],
  },
  {
    character: 'ネ',
    romaji: 'ne',
    type: 'katakana',
    group: 'n-row',
    display_order: 24,
    is_combination: false,
    stroke_count: 4,
    mnemonic:
      'A Net for catching fish. The angular strokes form a net-like shape with a handle.',
    stroke_order_svg: null,
    audio_url: null,
    example_words: [
      { word: 'ネクタイ', reading: 'nekutai', meaning: 'necktie' },
      { word: 'ネット', reading: 'netto', meaning: 'internet / net' },
      { word: 'ネコ', reading: 'neko', meaning: 'cat' },
    ],
  },
  {
    character: 'ノ',
    romaji: 'no',
    type: 'katakana',
    group: 'n-row',
    display_order: 25,
    is_combination: false,
    stroke_count: 1,
    mnemonic:
      'A single diagonal stroke like saying No with a slash. The simplest katakana — just one line.',
    stroke_order_svg: null,
    audio_url: null,
    example_words: [
      { word: 'ノート', reading: 'nooto', meaning: 'notebook' },
      { word: 'ノック', reading: 'nokku', meaning: 'knock' },
      { word: 'ピアノ', reading: 'piano', meaning: 'piano' },
    ],
  },

  // ===========================================================================
  // GROUP 6: H-ROW (5 characters)
  // ===========================================================================
  {
    character: 'ハ',
    romaji: 'ha',
    type: 'katakana',
    group: 'h-row',
    display_order: 26,
    is_combination: false,
    stroke_count: 2,
    mnemonic:
      'A Ha! — two strokes spreading apart like laughter. They look like the sides of a tent opening up.',
    stroke_order_svg: null,
    audio_url: null,
    example_words: [
      { word: 'ハンバーガー', reading: 'hanbaagaa', meaning: 'hamburger' },
      { word: 'ハイキング', reading: 'haikingu', meaning: 'hiking' },
      { word: 'ハワイ', reading: 'hawai', meaning: 'Hawaii' },
    ],
  },
  {
    character: 'ヒ',
    romaji: 'hi',
    type: 'katakana',
    group: 'h-row',
    display_order: 27,
    is_combination: false,
    stroke_count: 2,
    mnemonic:
      'A person saying HEE with their mouth open. The shape looks like an open mouth from the side.',
    stroke_order_svg: null,
    audio_url: null,
    example_words: [
      { word: 'ヒント', reading: 'hinto', meaning: 'hint' },
      { word: 'ヒーター', reading: 'hiitaa', meaning: 'heater' },
      { word: 'ヒーロー', reading: 'hiiroo', meaning: 'hero' },
    ],
  },
  {
    character: 'フ',
    romaji: 'fu',
    type: 'katakana',
    group: 'h-row',
    display_order: 28,
    is_combination: false,
    stroke_count: 1,
    mnemonic:
      'Mount Fuji seen from the side. The single curved stroke traces the profile of the famous mountain.',
    stroke_order_svg: null,
    audio_url: null,
    example_words: [
      { word: 'フランス', reading: 'furansu', meaning: 'France' },
      { word: 'フルーツ', reading: 'furuutsu', meaning: 'fruit' },
      { word: 'フォーク', reading: 'fooku', meaning: 'fork' },
    ],
  },
  {
    character: 'ヘ',
    romaji: 'he',
    type: 'katakana',
    group: 'h-row',
    display_order: 29,
    is_combination: false,
    stroke_count: 1,
    mnemonic:
      'A mountain peak or tent top. The single angular stroke looks like a simple tent or a hill — same as hiragana へ!',
    stroke_order_svg: null,
    audio_url: null,
    example_words: [
      { word: 'ヘリコプター', reading: 'herikuputaa', meaning: 'helicopter' },
      { word: 'ヘルメット', reading: 'herumetto', meaning: 'helmet' },
      { word: 'ヘア', reading: 'hea', meaning: 'hair' },
    ],
  },
  {
    character: 'ホ',
    romaji: 'ho',
    type: 'katakana',
    group: 'h-row',
    display_order: 30,
    is_combination: false,
    stroke_count: 4,
    mnemonic:
      'A Holy cross. The vertical line with small horizontal strokes on each side resembles a cross or totem.',
    stroke_order_svg: null,
    audio_url: null,
    example_words: [
      { word: 'ホテル', reading: 'hoteru', meaning: 'hotel' },
      { word: 'ホームページ', reading: 'hoomupeeji', meaning: 'homepage' },
      { word: 'ホワイト', reading: 'howaito', meaning: 'white' },
    ],
  },

  // ===========================================================================
  // GROUP 7: M-ROW (5 characters)
  // ===========================================================================
  {
    character: 'マ',
    romaji: 'ma',
    type: 'katakana',
    group: 'm-row',
    display_order: 31,
    is_combination: false,
    stroke_count: 2,
    mnemonic:
      'A Mask for your face. The horizontal line is the top of the mask, and the curved stroke is the eye opening.',
    stroke_order_svg: null,
    audio_url: null,
    example_words: [
      { word: 'マクドナルド', reading: 'makudonarudo', meaning: 'McDonald\'s' },
      { word: 'マンション', reading: 'manshon', meaning: 'apartment' },
      { word: 'マスク', reading: 'masuku', meaning: 'mask' },
    ],
  },
  {
    character: 'ミ',
    romaji: 'mi',
    type: 'katakana',
    group: 'm-row',
    display_order: 32,
    is_combination: false,
    stroke_count: 3,
    mnemonic:
      'Three lines like the Roman numeral III (three = "mi-ttsu" in Japanese). Three parallel diagonal strokes.',
    stroke_order_svg: null,
    audio_url: null,
    example_words: [
      { word: 'ミルク', reading: 'miruku', meaning: 'milk' },
      { word: 'ミュージック', reading: 'myuujikku', meaning: 'music' },
      { word: 'ミス', reading: 'misu', meaning: 'mistake' },
    ],
  },
  {
    character: 'ム',
    romaji: 'mu',
    type: 'katakana',
    group: 'm-row',
    display_order: 33,
    is_combination: false,
    stroke_count: 2,
    mnemonic:
      'A Moose head with one antler. The angular shape looks like the profile of a moose.',
    stroke_order_svg: null,
    audio_url: null,
    example_words: [
      { word: 'ゲーム', reading: 'geemu', meaning: 'game' },
      { word: 'ムービー', reading: 'muubii', meaning: 'movie' },
      { word: 'ムード', reading: 'muudo', meaning: 'mood' },
    ],
  },
  {
    character: 'メ',
    romaji: 'me',
    type: 'katakana',
    group: 'm-row',
    display_order: 34,
    is_combination: false,
    stroke_count: 2,
    mnemonic:
      'An X mark — like crossing something off a MEmo. Two crossing strokes form an X shape.',
    stroke_order_svg: null,
    audio_url: null,
    example_words: [
      { word: 'メール', reading: 'meeru', meaning: 'email' },
      { word: 'メニュー', reading: 'menyuu', meaning: 'menu' },
      { word: 'メッセージ', reading: 'messeeji', meaning: 'message' },
    ],
  },
  {
    character: 'モ',
    romaji: 'mo',
    type: 'katakana',
    group: 'm-row',
    display_order: 35,
    is_combination: false,
    stroke_count: 3,
    mnemonic:
      'More lines stacked up. The horizontal lines look like layers stacked on top of each other.',
    stroke_order_svg: null,
    audio_url: null,
    example_words: [
      { word: 'モデル', reading: 'moderu', meaning: 'model' },
      { word: 'モニター', reading: 'monitaa', meaning: 'monitor' },
      { word: 'モバイル', reading: 'mobairu', meaning: 'mobile' },
    ],
  },

  // ===========================================================================
  // GROUP 8: Y-ROW (3 characters)
  // ===========================================================================
  {
    character: 'ヤ',
    romaji: 'ya',
    type: 'katakana',
    group: 'y-row',
    display_order: 36,
    is_combination: false,
    stroke_count: 2,
    mnemonic:
      'A Yak horn. The angular shape looks like the curved horn of a yak.',
    stroke_order_svg: null,
    audio_url: null,
    example_words: [
      { word: 'タイヤ', reading: 'taiya', meaning: 'tire' },
      { word: 'ダイヤ', reading: 'daiya', meaning: 'diamond' },
      { word: 'ヤング', reading: 'yangu', meaning: 'young' },
    ],
  },
  {
    character: 'ユ',
    romaji: 'yu',
    type: 'katakana',
    group: 'y-row',
    display_order: 37,
    is_combination: false,
    stroke_count: 2,
    mnemonic:
      'A hook catching YOU. The shape looks like a fish hook with a horizontal bar at the top.',
    stroke_order_svg: null,
    audio_url: null,
    example_words: [
      { word: 'ユニフォーム', reading: 'yunifoomu', meaning: 'uniform' },
      { word: 'ユーザー', reading: 'yuuzaa', meaning: 'user' },
      { word: 'ユニーク', reading: 'yuniiku', meaning: 'unique' },
    ],
  },
  {
    character: 'ヨ',
    romaji: 'yo',
    type: 'katakana',
    group: 'y-row',
    display_order: 38,
    is_combination: false,
    stroke_count: 3,
    mnemonic:
      'A Yoga pose. The shape looks like a person doing a standing yoga stretch with arms extended.',
    stroke_order_svg: null,
    audio_url: null,
    example_words: [
      { word: 'ヨーロッパ', reading: 'yooroppa', meaning: 'Europe' },
      { word: 'ヨーグルト', reading: 'yooguruto', meaning: 'yogurt' },
      { word: 'ヨット', reading: 'yotto', meaning: 'yacht' },
    ],
  },

  // ===========================================================================
  // GROUP 9: R-ROW (5 characters)
  // ===========================================================================
  {
    character: 'ラ',
    romaji: 'ra',
    type: 'katakana',
    group: 'r-row',
    display_order: 39,
    is_combination: false,
    stroke_count: 2,
    mnemonic:
      'A Rabbit ear sticking up. The shape looks like a single upright rabbit ear.',
    stroke_order_svg: null,
    audio_url: null,
    example_words: [
      { word: 'ラーメン', reading: 'raamen', meaning: 'ramen' },
      { word: 'ライト', reading: 'raito', meaning: 'light' },
      { word: 'ラジオ', reading: 'rajio', meaning: 'radio' },
    ],
  },
  {
    character: 'リ',
    romaji: 'ri',
    type: 'katakana',
    group: 'r-row',
    display_order: 40,
    is_combination: false,
    stroke_count: 2,
    mnemonic:
      'Reeds growing by the River. The two vertical strokes are thin reeds swaying in the breeze.',
    stroke_order_svg: null,
    audio_url: null,
    example_words: [
      { word: 'リモコン', reading: 'rimokon', meaning: 'remote control' },
      { word: 'リスト', reading: 'risuto', meaning: 'list' },
      { word: 'リサイクル', reading: 'risaikuru', meaning: 'recycle' },
    ],
  },
  {
    character: 'ル',
    romaji: 'ru',
    type: 'katakana',
    group: 'r-row',
    display_order: 41,
    is_combination: false,
    stroke_count: 2,
    mnemonic:
      'Looks like tree Roots growing down. The two strokes diverge downward like roots of a plant.',
    stroke_order_svg: null,
    audio_url: null,
    example_words: [
      { word: 'ルール', reading: 'ruuru', meaning: 'rule' },
      { word: 'ルーム', reading: 'ruumu', meaning: 'room' },
      { word: 'テーブル', reading: 'teeburu', meaning: 'table' },
    ],
  },
  {
    character: 'レ',
    romaji: 're',
    type: 'katakana',
    group: 'r-row',
    display_order: 42,
    is_combination: false,
    stroke_count: 1,
    mnemonic:
      'A Razor blade edge. The single angular stroke looks like the sharp edge of a razor.',
    stroke_order_svg: null,
    audio_url: null,
    example_words: [
      { word: 'レストラン', reading: 'resutoran', meaning: 'restaurant' },
      { word: 'レシピ', reading: 'reshipi', meaning: 'recipe' },
      { word: 'レベル', reading: 'reberu', meaning: 'level' },
    ],
  },
  {
    character: 'ロ',
    romaji: 'ro',
    type: 'katakana',
    group: 'r-row',
    display_order: 43,
    is_combination: false,
    stroke_count: 3,
    mnemonic:
      'A Road sign — a square shape like a road marker. The boxy shape is easy to remember.',
    stroke_order_svg: null,
    audio_url: null,
    example_words: [
      { word: 'ロボット', reading: 'robotto', meaning: 'robot' },
      { word: 'ロッカー', reading: 'rokkaa', meaning: 'locker' },
      { word: 'ロシア', reading: 'roshia', meaning: 'Russia' },
    ],
  },

  // ===========================================================================
  // GROUP 10: W-ROW + N (3 characters)
  // ===========================================================================
  {
    character: 'ワ',
    romaji: 'wa',
    type: 'katakana',
    group: 'w-row',
    display_order: 44,
    is_combination: false,
    stroke_count: 2,
    mnemonic:
      'A Wine glass. The shape looks like the bowl and stem of a wine glass.',
    stroke_order_svg: null,
    audio_url: null,
    example_words: [
      { word: 'ワイン', reading: 'wain', meaning: 'wine' },
      { word: 'ワイシャツ', reading: 'waishatsu', meaning: 'dress shirt' },
      { word: 'ワックス', reading: 'wakkusu', meaning: 'wax' },
    ],
  },
  {
    character: 'ヲ',
    romaji: 'wo',
    type: 'katakana',
    group: 'w-row',
    display_order: 45,
    is_combination: false,
    stroke_count: 3,
    mnemonic:
      'A Warrior doing a karate chop. The top horizontal line is the arm extended, with the body below.',
    stroke_order_svg: null,
    audio_url: null,
    example_words: [
      { word: 'ヲタク', reading: 'wotaku', meaning: 'otaku (emphatic)' },
      { word: 'コーヒーヲ', reading: 'koohii wo', meaning: 'coffee (object)' },
      { word: 'ミズヲ', reading: 'mizu wo', meaning: 'water (object)' },
    ],
  },
  {
    character: 'ン',
    romaji: 'n',
    type: 'katakana',
    group: 'w-row',
    display_order: 46,
    is_combination: false,
    stroke_count: 2,
    mnemonic:
      'Looks like the lowercase letter "n" tilted sideways. A small dot leads into a sweeping diagonal stroke.',
    stroke_order_svg: null,
    audio_url: null,
    example_words: [
      { word: 'パン', reading: 'pan', meaning: 'bread' },
      { word: 'ラーメン', reading: 'raamen', meaning: 'ramen' },
      { word: 'レモン', reading: 'remon', meaning: 'lemon' },
    ],
  },

  // ===========================================================================
  // GROUP 11: G & Z ROWS — DAKUTEN (10 characters)
  // ===========================================================================
  {
    character: 'ガ',
    romaji: 'ga',
    type: 'katakana',
    group: 'g-z-row',
    display_order: 47,
    is_combination: false,
    stroke_count: 4,
    mnemonic:
      'カ (ka) plus dakuten marks. The two small strokes add voicing — ka becomes ga.',
    stroke_order_svg: null,
    audio_url: null,
    example_words: [
      { word: 'ガソリン', reading: 'gasorin', meaning: 'gasoline' },
      { word: 'ガラス', reading: 'garasu', meaning: 'glass' },
      { word: 'ガイド', reading: 'gaido', meaning: 'guide' },
    ],
  },
  {
    character: 'ギ',
    romaji: 'gi',
    type: 'katakana',
    group: 'g-z-row',
    display_order: 48,
    is_combination: false,
    stroke_count: 5,
    mnemonic:
      'キ (ki) plus dakuten marks. The voiced version turns the K sound into G.',
    stroke_order_svg: null,
    audio_url: null,
    example_words: [
      { word: 'ギター', reading: 'gitaa', meaning: 'guitar' },
      { word: 'ギフト', reading: 'gifuto', meaning: 'gift' },
      { word: 'エネルギー', reading: 'enerugii', meaning: 'energy' },
    ],
  },
  {
    character: 'グ',
    romaji: 'gu',
    type: 'katakana',
    group: 'g-z-row',
    display_order: 49,
    is_combination: false,
    stroke_count: 4,
    mnemonic:
      'ク (ku) plus dakuten marks. Adding voice to ku creates the gu sound.',
    stroke_order_svg: null,
    audio_url: null,
    example_words: [
      { word: 'グループ', reading: 'guruupu', meaning: 'group' },
      { word: 'グラス', reading: 'gurasu', meaning: 'glass (drinking)' },
      { word: 'グレー', reading: 'guree', meaning: 'gray' },
    ],
  },
  {
    character: 'ゲ',
    romaji: 'ge',
    type: 'katakana',
    group: 'g-z-row',
    display_order: 50,
    is_combination: false,
    stroke_count: 5,
    mnemonic:
      'ケ (ke) plus dakuten marks. The dakuten transforms ke into ge.',
    stroke_order_svg: null,
    audio_url: null,
    example_words: [
      { word: 'ゲーム', reading: 'geemu', meaning: 'game' },
      { word: 'ゲート', reading: 'geeto', meaning: 'gate' },
      { word: 'ゲスト', reading: 'gesuto', meaning: 'guest' },
    ],
  },
  {
    character: 'ゴ',
    romaji: 'go',
    type: 'katakana',
    group: 'g-z-row',
    display_order: 51,
    is_combination: false,
    stroke_count: 4,
    mnemonic:
      'コ (ko) plus dakuten marks. The corner shape with voice marks makes the go sound.',
    stroke_order_svg: null,
    audio_url: null,
    example_words: [
      { word: 'ゴルフ', reading: 'gorufu', meaning: 'golf' },
      { word: 'ゴール', reading: 'gooru', meaning: 'goal' },
      { word: 'ゴミ', reading: 'gomi', meaning: 'garbage' },
    ],
  },
  {
    character: 'ザ',
    romaji: 'za',
    type: 'katakana',
    group: 'g-z-row',
    display_order: 52,
    is_combination: false,
    stroke_count: 5,
    mnemonic:
      'サ (sa) plus dakuten marks. The samurai sword now buzzes with a za sound.',
    stroke_order_svg: null,
    audio_url: null,
    example_words: [
      { word: 'デザイン', reading: 'dezain', meaning: 'design' },
      { word: 'デザート', reading: 'dezaato', meaning: 'dessert' },
      { word: 'ピザ', reading: 'piza', meaning: 'pizza' },
    ],
  },
  {
    character: 'ジ',
    romaji: 'ji',
    type: 'katakana',
    group: 'g-z-row',
    display_order: 53,
    is_combination: false,
    stroke_count: 5,
    mnemonic:
      'シ (shi) plus dakuten marks. The winking face now makes a ji sound instead.',
    stroke_order_svg: null,
    audio_url: null,
    example_words: [
      { word: 'ジュース', reading: 'juusu', meaning: 'juice' },
      { word: 'イメージ', reading: 'imeeji', meaning: 'image' },
      { word: 'ジャケット', reading: 'jaketto', meaning: 'jacket' },
    ],
  },
  {
    character: 'ズ',
    romaji: 'zu',
    type: 'katakana',
    group: 'g-z-row',
    display_order: 54,
    is_combination: false,
    stroke_count: 4,
    mnemonic:
      'ス (su) plus dakuten marks. The ski slope now has a buzzing zu sound.',
    stroke_order_svg: null,
    audio_url: null,
    example_words: [
      { word: 'チーズ', reading: 'chiizu', meaning: 'cheese' },
      { word: 'シューズ', reading: 'shuuzu', meaning: 'shoes' },
      { word: 'クイズ', reading: 'kuizu', meaning: 'quiz' },
    ],
  },
  {
    character: 'ゼ',
    romaji: 'ze',
    type: 'katakana',
    group: 'g-z-row',
    display_order: 55,
    is_combination: false,
    stroke_count: 4,
    mnemonic:
      'セ (se) plus dakuten marks. The sail now vibrates with a ze sound.',
    stroke_order_svg: null,
    audio_url: null,
    example_words: [
      { word: 'ゼロ', reading: 'zero', meaning: 'zero' },
      { word: 'ゼリー', reading: 'zerii', meaning: 'jelly' },
      { word: 'プレゼント', reading: 'purezento', meaning: 'present / gift' },
    ],
  },
  {
    character: 'ゾ',
    romaji: 'zo',
    type: 'katakana',
    group: 'g-z-row',
    display_order: 56,
    is_combination: false,
    stroke_count: 4,
    mnemonic:
      'ソ (so) plus dakuten marks. The scattering seeds now make a zo sound.',
    stroke_order_svg: null,
    audio_url: null,
    example_words: [
      { word: 'アマゾン', reading: 'amazon', meaning: 'Amazon' },
      { word: 'ゾーン', reading: 'zoon', meaning: 'zone' },
      { word: 'ゾンビ', reading: 'zonbi', meaning: 'zombie' },
    ],
  },

  // ===========================================================================
  // GROUP 12: D & B ROWS — DAKUTEN (10 characters)
  // ===========================================================================
  {
    character: 'ダ',
    romaji: 'da',
    type: 'katakana',
    group: 'd-b-row',
    display_order: 57,
    is_combination: false,
    stroke_count: 5,
    mnemonic:
      'タ (ta) plus dakuten marks. The tag now has a da sound.',
    stroke_order_svg: null,
    audio_url: null,
    example_words: [
      { word: 'ダンス', reading: 'dansu', meaning: 'dance' },
      { word: 'ダイヤモンド', reading: 'daiyamondo', meaning: 'diamond' },
      { word: 'ダウンロード', reading: 'daunroodo', meaning: 'download' },
    ],
  },
  {
    character: 'ヂ',
    romaji: 'di',
    type: 'katakana',
    group: 'd-b-row',
    display_order: 58,
    is_combination: false,
    stroke_count: 5,
    mnemonic:
      'チ (chi) plus dakuten marks. Rarely used — ジ is preferred for the ji sound.',
    stroke_order_svg: null,
    audio_url: null,
    example_words: [
      { word: 'ヂ', reading: 'di/ji', meaning: '(rarely used independently)' },
      { word: 'はなヂ', reading: 'hanaji', meaning: 'nosebleed' },
      { word: 'みかヂき', reading: 'mikazuki', meaning: 'crescent moon' },
    ],
  },
  {
    character: 'ヅ',
    romaji: 'du',
    type: 'katakana',
    group: 'd-b-row',
    display_order: 59,
    is_combination: false,
    stroke_count: 5,
    mnemonic:
      'ツ (tsu) plus dakuten marks. Rarely used — ズ is preferred for the zu sound.',
    stroke_order_svg: null,
    audio_url: null,
    example_words: [
      { word: 'ヅ', reading: 'du/zu', meaning: '(rarely used independently)' },
      { word: 'つづく', reading: 'tsuzuku', meaning: 'to continue' },
      { word: 'みかヅき', reading: 'mikazuki', meaning: 'crescent moon' },
    ],
  },
  {
    character: 'デ',
    romaji: 'de',
    type: 'katakana',
    group: 'd-b-row',
    display_order: 60,
    is_combination: false,
    stroke_count: 5,
    mnemonic:
      'テ (te) plus dakuten marks. The telephone pole now makes a de sound.',
    stroke_order_svg: null,
    audio_url: null,
    example_words: [
      { word: 'デザイン', reading: 'dezain', meaning: 'design' },
      { word: 'デパート', reading: 'depaato', meaning: 'department store' },
      { word: 'デジタル', reading: 'dejitaru', meaning: 'digital' },
    ],
  },
  {
    character: 'ド',
    romaji: 'do',
    type: 'katakana',
    group: 'd-b-row',
    display_order: 61,
    is_combination: false,
    stroke_count: 4,
    mnemonic:
      'ト (to) plus dakuten marks. The totem pole now makes a do sound.',
    stroke_order_svg: null,
    audio_url: null,
    example_words: [
      { word: 'ドア', reading: 'doa', meaning: 'door' },
      { word: 'ドライブ', reading: 'doraibu', meaning: 'drive' },
      { word: 'ドイツ', reading: 'doitsu', meaning: 'Germany' },
    ],
  },
  {
    character: 'バ',
    romaji: 'ba',
    type: 'katakana',
    group: 'd-b-row',
    display_order: 62,
    is_combination: false,
    stroke_count: 4,
    mnemonic:
      'ハ (ha) plus dakuten marks. The tent opening now makes a ba sound.',
    stroke_order_svg: null,
    audio_url: null,
    example_words: [
      { word: 'バス', reading: 'basu', meaning: 'bus' },
      { word: 'バナナ', reading: 'banana', meaning: 'banana' },
      { word: 'バッグ', reading: 'baggu', meaning: 'bag' },
    ],
  },
  {
    character: 'ビ',
    romaji: 'bi',
    type: 'katakana',
    group: 'd-b-row',
    display_order: 63,
    is_combination: false,
    stroke_count: 4,
    mnemonic:
      'ヒ (hi) plus dakuten marks. The open mouth now makes a bi sound.',
    stroke_order_svg: null,
    audio_url: null,
    example_words: [
      { word: 'ビール', reading: 'biiru', meaning: 'beer' },
      { word: 'ビデオ', reading: 'bideo', meaning: 'video' },
      { word: 'ビジネス', reading: 'bijinesu', meaning: 'business' },
    ],
  },
  {
    character: 'ブ',
    romaji: 'bu',
    type: 'katakana',
    group: 'd-b-row',
    display_order: 64,
    is_combination: false,
    stroke_count: 3,
    mnemonic:
      'フ (fu) plus dakuten marks. Mount Fuji now makes a bu sound.',
    stroke_order_svg: null,
    audio_url: null,
    example_words: [
      { word: 'ブログ', reading: 'burogu', meaning: 'blog' },
      { word: 'ブランド', reading: 'burando', meaning: 'brand' },
      { word: 'ブルー', reading: 'buruu', meaning: 'blue' },
    ],
  },
  {
    character: 'ベ',
    romaji: 'be',
    type: 'katakana',
    group: 'd-b-row',
    display_order: 65,
    is_combination: false,
    stroke_count: 3,
    mnemonic:
      'ヘ (he) plus dakuten marks. The mountain peak now makes a be sound.',
    stroke_order_svg: null,
    audio_url: null,
    example_words: [
      { word: 'ベッド', reading: 'beddo', meaning: 'bed' },
      { word: 'ベスト', reading: 'besuto', meaning: 'best / vest' },
      { word: 'ベランダ', reading: 'beranda', meaning: 'balcony' },
    ],
  },
  {
    character: 'ボ',
    romaji: 'bo',
    type: 'katakana',
    group: 'd-b-row',
    display_order: 66,
    is_combination: false,
    stroke_count: 6,
    mnemonic:
      'ホ (ho) plus dakuten marks. The holy cross now makes a bo sound.',
    stroke_order_svg: null,
    audio_url: null,
    example_words: [
      { word: 'ボタン', reading: 'botan', meaning: 'button' },
      { word: 'ボール', reading: 'booru', meaning: 'ball' },
      { word: 'ボランティア', reading: 'borantia', meaning: 'volunteer' },
    ],
  },

  // ===========================================================================
  // GROUP 13: P-ROW — HANDAKUTEN (5 characters)
  // ===========================================================================
  {
    character: 'パ',
    romaji: 'pa',
    type: 'katakana',
    group: 'p-row',
    display_order: 67,
    is_combination: false,
    stroke_count: 3,
    mnemonic:
      'ハ (ha) plus handakuten circle. The small circle transforms ha into pa.',
    stroke_order_svg: null,
    audio_url: null,
    example_words: [
      { word: 'パン', reading: 'pan', meaning: 'bread' },
      { word: 'パーティー', reading: 'paatii', meaning: 'party' },
      { word: 'パソコン', reading: 'pasokon', meaning: 'PC / computer' },
    ],
  },
  {
    character: 'ピ',
    romaji: 'pi',
    type: 'katakana',
    group: 'p-row',
    display_order: 68,
    is_combination: false,
    stroke_count: 3,
    mnemonic:
      'ヒ (hi) plus handakuten circle. The circle adds a pop to create pi.',
    stroke_order_svg: null,
    audio_url: null,
    example_words: [
      { word: 'ピアノ', reading: 'piano', meaning: 'piano' },
      { word: 'ピザ', reading: 'piza', meaning: 'pizza' },
      { word: 'ピンク', reading: 'pinku', meaning: 'pink' },
    ],
  },
  {
    character: 'プ',
    romaji: 'pu',
    type: 'katakana',
    group: 'p-row',
    display_order: 69,
    is_combination: false,
    stroke_count: 2,
    mnemonic:
      'フ (fu) plus handakuten circle. The Fuji shape with a circle becomes pu.',
    stroke_order_svg: null,
    audio_url: null,
    example_words: [
      { word: 'プール', reading: 'puuru', meaning: 'pool' },
      { word: 'プレゼント', reading: 'purezento', meaning: 'present' },
      { word: 'プロ', reading: 'puro', meaning: 'professional' },
    ],
  },
  {
    character: 'ペ',
    romaji: 'pe',
    type: 'katakana',
    group: 'p-row',
    display_order: 70,
    is_combination: false,
    stroke_count: 2,
    mnemonic:
      'ヘ (he) plus handakuten circle. The peak shape with a circle becomes pe.',
    stroke_order_svg: null,
    audio_url: null,
    example_words: [
      { word: 'ペン', reading: 'pen', meaning: 'pen' },
      { word: 'ページ', reading: 'peeji', meaning: 'page' },
      { word: 'ペット', reading: 'petto', meaning: 'pet' },
    ],
  },
  {
    character: 'ポ',
    romaji: 'po',
    type: 'katakana',
    group: 'p-row',
    display_order: 71,
    is_combination: false,
    stroke_count: 5,
    mnemonic:
      'ホ (ho) plus handakuten circle. The cross shape with a circle becomes po.',
    stroke_order_svg: null,
    audio_url: null,
    example_words: [
      { word: 'ポスト', reading: 'posuto', meaning: 'post / mailbox' },
      { word: 'ポイント', reading: 'pointo', meaning: 'point' },
      { word: 'ポケット', reading: 'poketto', meaning: 'pocket' },
    ],
  },

  // ===========================================================================
  // GROUP 14: YOON — COMBINATIONS (8 characters)
  // ===========================================================================
  {
    character: 'キャ',
    romaji: 'kya',
    type: 'katakana',
    group: 'yoon',
    display_order: 72,
    is_combination: true,
    stroke_count: 5,
    mnemonic:
      'キ (ki) + small ヤ (ya) = kya. The small ヤ after キ blends the sounds together.',
    stroke_order_svg: null,
    audio_url: null,
    example_words: [
      { word: 'キャンプ', reading: 'kyanpu', meaning: 'camp' },
      { word: 'キャベツ', reading: 'kyabetsu', meaning: 'cabbage' },
      { word: 'キャリア', reading: 'kyaria', meaning: 'career' },
    ],
  },
  {
    character: 'キュ',
    romaji: 'kyu',
    type: 'katakana',
    group: 'yoon',
    display_order: 73,
    is_combination: true,
    stroke_count: 5,
    mnemonic:
      'キ (ki) + small ユ (yu) = kyu. The small ユ blends with キ for a combined sound.',
    stroke_order_svg: null,
    audio_url: null,
    example_words: [
      { word: 'キュート', reading: 'kyuuto', meaning: 'cute' },
      { word: 'バーベキュー', reading: 'baabekyuu', meaning: 'barbecue' },
      { word: 'レスキュー', reading: 'resukyuu', meaning: 'rescue' },
    ],
  },
  {
    character: 'キョ',
    romaji: 'kyo',
    type: 'katakana',
    group: 'yoon',
    display_order: 74,
    is_combination: true,
    stroke_count: 6,
    mnemonic:
      'キ (ki) + small ヨ (yo) = kyo. The small ヨ combines with キ for the kyo sound.',
    stroke_order_svg: null,
    audio_url: null,
    example_words: [
      { word: 'トーキョー', reading: 'tookyoo', meaning: 'Tokyo' },
      { word: 'キョウリュウ', reading: 'kyouryuu', meaning: 'dinosaur' },
      { word: 'キョリ', reading: 'kyori', meaning: 'distance' },
    ],
  },
  {
    character: 'シャ',
    romaji: 'sha',
    type: 'katakana',
    group: 'yoon',
    display_order: 75,
    is_combination: true,
    stroke_count: 5,
    mnemonic:
      'シ (shi) + small ヤ (ya) = sha. The winking face combines with the small ヤ.',
    stroke_order_svg: null,
    audio_url: null,
    example_words: [
      { word: 'シャツ', reading: 'shatsu', meaning: 'shirt' },
      { word: 'シャワー', reading: 'shawaa', meaning: 'shower' },
      { word: 'シャンプー', reading: 'shanpuu', meaning: 'shampoo' },
    ],
  },
  {
    character: 'シュ',
    romaji: 'shu',
    type: 'katakana',
    group: 'yoon',
    display_order: 76,
    is_combination: true,
    stroke_count: 5,
    mnemonic:
      'シ (shi) + small ユ (yu) = shu. The combination creates the shu sound.',
    stroke_order_svg: null,
    audio_url: null,
    example_words: [
      { word: 'シュート', reading: 'shuuto', meaning: 'shoot' },
      { word: 'シューズ', reading: 'shuuzu', meaning: 'shoes' },
      { word: 'シュークリーム', reading: 'shuukuriimu', meaning: 'cream puff' },
    ],
  },
  {
    character: 'ショ',
    romaji: 'sho',
    type: 'katakana',
    group: 'yoon',
    display_order: 77,
    is_combination: true,
    stroke_count: 6,
    mnemonic:
      'シ (shi) + small ヨ (yo) = sho. Creates the sho sound for common loanwords.',
    stroke_order_svg: null,
    audio_url: null,
    example_words: [
      { word: 'ショー', reading: 'shoo', meaning: 'show' },
      { word: 'ショッピング', reading: 'shoppingu', meaning: 'shopping' },
      { word: 'ショック', reading: 'shokku', meaning: 'shock' },
    ],
  },
  {
    character: 'チャ',
    romaji: 'cha',
    type: 'katakana',
    group: 'yoon',
    display_order: 78,
    is_combination: true,
    stroke_count: 5,
    mnemonic:
      'チ (chi) + small ヤ (ya) = cha. The cheerleader combines with the yak horn for cha.',
    stroke_order_svg: null,
    audio_url: null,
    example_words: [
      { word: 'チャンス', reading: 'chansu', meaning: 'chance' },
      { word: 'チャンネル', reading: 'channeru', meaning: 'channel' },
      { word: 'チャート', reading: 'chaato', meaning: 'chart' },
    ],
  },
  {
    character: 'チュ',
    romaji: 'chu',
    type: 'katakana',
    group: 'yoon',
    display_order: 79,
    is_combination: true,
    stroke_count: 5,
    mnemonic:
      'チ (chi) + small ユ (yu) = chu. The combination creates the chu sound.',
    stroke_order_svg: null,
    audio_url: null,
    example_words: [
      { word: 'チューブ', reading: 'chuubu', meaning: 'tube' },
      { word: 'チューリップ', reading: 'chuurippu', meaning: 'tulip' },
      { word: 'チュートリアル', reading: 'chuutoriaru', meaning: 'tutorial' },
    ],
  },
]
