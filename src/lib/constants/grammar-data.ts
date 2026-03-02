import type { GrammarPatternData } from '@/types/grammar'

export const N5_GRAMMAR_PATTERNS: GrammarPatternData[] = [
  // ===========================================================================
  // PARTICLES (8)
  // ===========================================================================
  {
    pattern: 'は',
    meaning: 'topic marker particle',
    formation: 'Noun + は',
    jlpt_level: 'N5',
    difficulty: 'beginner',
    explanation:
      'The particle は (wa) marks the topic of a sentence — what the sentence is about. It sets the context or theme, telling the listener "as for X, ...".',
    notes: 'Pronounced "wa" not "ha" when used as a particle.',
    common_mistakes:
      'Confusing は with が. は marks the topic (old/known information), while が marks the subject (new/important information).',
    examples: [
      {
        japanese: '私は学生です。',
        english: 'I am a student.',
        furigana: 'わたしはがくせいです。',
      },
      {
        japanese: '今日は暑いです。',
        english: 'Today is hot.',
        furigana: 'きょうはあついです。',
      },
      {
        japanese: 'これは本です。',
        english: 'This is a book.',
        furigana: 'これはほんです。',
      },
      {
        japanese: '田中さんは先生です。',
        english: 'Mr. Tanaka is a teacher.',
        furigana: 'たなかさんはせんせいです。',
      },
    ],
  },
  {
    pattern: 'が',
    meaning: 'subject marker particle',
    formation: 'Noun + が',
    jlpt_level: 'N5',
    difficulty: 'beginner',
    explanation:
      'The particle が marks the grammatical subject — who or what performs the action. It highlights new or important information, answering "who?" or "what?".',
    notes:
      'Used after question words (誰が, 何が) and with adjectives of desire/ability (好き, 欲しい, できる).',
    common_mistakes:
      'Using は when が is required. After question words like 誰 (who), always use が: 誰が来ましたか, not 誰は来ましたか.',
    examples: [
      {
        japanese: '誰が来ましたか。',
        english: 'Who came?',
        furigana: 'だれがきましたか。',
      },
      {
        japanese: '猫が好きです。',
        english: 'I like cats.',
        furigana: 'ねこがすきです。',
      },
      {
        japanese: '雨が降っています。',
        english: 'It is raining.',
        furigana: 'あめがふっています。',
      },
      {
        japanese: '日本語ができます。',
        english: 'I can speak Japanese.',
        furigana: 'にほんごができます。',
      },
    ],
  },
  {
    pattern: 'を',
    meaning: 'direct object marker',
    formation: 'Noun + を + Verb',
    jlpt_level: 'N5',
    difficulty: 'beginner',
    explanation:
      'The particle を (o) marks the direct object of a transitive verb — the thing being acted upon.',
    notes: 'Pronounced "o" in modern Japanese, not "wo". Also used with motion verbs to indicate a path (道を歩く).',
    common_mistakes:
      'Using を with intransitive verbs. You say 水を飲む (drink water) but not ×ここを寝る.',
    examples: [
      {
        japanese: '水を飲みます。',
        english: 'I drink water.',
        furigana: 'みずをのみます。',
      },
      {
        japanese: '本を読みます。',
        english: 'I read a book.',
        furigana: 'ほんをよみます。',
      },
      {
        japanese: 'テレビを見ます。',
        english: 'I watch TV.',
        furigana: 'テレビをみます。',
      },
      {
        japanese: '公園を散歩します。',
        english: 'I take a walk through the park.',
        furigana: 'こうえんをさんぽします。',
      },
    ],
  },
  {
    pattern: 'に',
    meaning: 'target / time / location particle',
    formation: 'Noun + に',
    jlpt_level: 'N5',
    difficulty: 'beginner',
    explanation:
      'The particle に indicates a target or destination, a specific point in time, or the location where something exists. It is one of the most versatile particles.',
    notes:
      'に marks specific times (7時に) but not relative times (今日, 昨日). For existence, に marks where something is: 部屋に猫がいる.',
    common_mistakes:
      'Using に with relative time words. Say 昨日行きました (no particle), not ×昨日に行きました.',
    examples: [
      {
        japanese: '学校に行きます。',
        english: 'I go to school.',
        furigana: 'がっこうにいきます。',
      },
      {
        japanese: '七時に起きます。',
        english: 'I wake up at 7 o\'clock.',
        furigana: 'しちじにおきます。',
      },
      {
        japanese: '友達にプレゼントをあげます。',
        english: 'I give a present to my friend.',
        furigana: 'ともだちにプレゼントをあげます。',
      },
      {
        japanese: '部屋に猫がいます。',
        english: 'There is a cat in the room.',
        furigana: 'へやにねこがいます。',
      },
    ],
  },
  {
    pattern: 'で',
    meaning: 'location of action / means / reason particle',
    formation: 'Noun + で',
    jlpt_level: 'N5',
    difficulty: 'beginner',
    explanation:
      'The particle で marks the place where an action occurs, the means or tool used to do something, or a reason/cause.',
    notes:
      'で marks where an action happens (図書館で勉強する), while に marks where something exists (図書館に本がある).',
    common_mistakes:
      'Confusing で and に for location. Use で for actions (レストランで食べる) and に for existence (レストランにいる).',
    examples: [
      {
        japanese: '図書館で勉強します。',
        english: 'I study at the library.',
        furigana: 'としょかんでべんきょうします。',
      },
      {
        japanese: 'バスで学校に行きます。',
        english: 'I go to school by bus.',
        furigana: 'バスでがっこうにいきます。',
      },
      {
        japanese: '箸で食べます。',
        english: 'I eat with chopsticks.',
        furigana: 'はしでたべます。',
      },
      {
        japanese: '日本語で話してください。',
        english: 'Please speak in Japanese.',
        furigana: 'にほんごではなしてください。',
      },
    ],
  },
  {
    pattern: 'へ',
    meaning: 'direction particle',
    formation: 'Place + へ',
    jlpt_level: 'N5',
    difficulty: 'beginner',
    explanation:
      'The particle へ (e) indicates the direction of movement. It emphasizes the direction toward a destination rather than the arrival point itself.',
    notes:
      'Pronounced "e" not "he" when used as a particle. Often interchangeable with に for destinations, but へ emphasizes direction while に emphasizes arrival.',
    common_mistakes:
      'Using へ for non-movement contexts. へ is only for direction; say 友達に会う (meet a friend), not ×友達へ会う.',
    examples: [
      {
        japanese: '日本へ行きます。',
        english: 'I go to Japan.',
        furigana: 'にほんへいきます。',
      },
      {
        japanese: '東へ進んでください。',
        english: 'Please go east.',
        furigana: 'ひがしへすすんでください。',
      },
      {
        japanese: '家へ帰ります。',
        english: 'I return home.',
        furigana: 'いえへかえります。',
      },
    ],
  },
  {
    pattern: 'と',
    meaning: 'and / with / quotation particle',
    formation: 'Noun + と + Noun / Person + と + Verb',
    jlpt_level: 'N5',
    difficulty: 'beginner',
    explanation:
      'The particle と connects nouns exhaustively ("A and B"), indicates doing something with someone, or marks quoted speech.',
    notes:
      'For exhaustive listing use と (A and B, nothing else). For non-exhaustive listing ("things like A and B") use や instead.',
    common_mistakes:
      'Using と for non-exhaustive lists. If you mean "things like A, B, etc.", use や: りんごやバナナ, not りんごとバナナ (unless you mean only those two).',
    examples: [
      {
        japanese: 'パンと牛乳を買います。',
        english: 'I buy bread and milk.',
        furigana: 'パンとぎゅうにゅうをかいます。',
      },
      {
        japanese: '友達と映画を見ます。',
        english: 'I watch a movie with a friend.',
        furigana: 'ともだちとえいがをみます。',
      },
      {
        japanese: '先生は「静かに」と言いました。',
        english: 'The teacher said "Be quiet."',
        furigana: 'せんせいは「しずかに」といいました。',
      },
    ],
  },
  {
    pattern: 'も',
    meaning: 'also / too particle',
    formation: 'Noun + も',
    jlpt_level: 'N5',
    difficulty: 'beginner',
    explanation:
      'The particle も means "also" or "too". It replaces は, が, or を to add the meaning of inclusion.',
    notes: 'Replaces は/が/を — do not double them (say 私も, not ×私はも). Can be used with negative for "neither": 何も食べない.',
    common_mistakes:
      'Stacking も with other particles it replaces. Say 私も行きます, not ×私はも行きます.',
    examples: [
      {
        japanese: '私も学生です。',
        english: 'I am also a student.',
        furigana: 'わたしもがくせいです。',
      },
      {
        japanese: 'これも美味しいです。',
        english: 'This is also delicious.',
        furigana: 'これもおいしいです。',
      },
      {
        japanese: '何も食べませんでした。',
        english: 'I didn\'t eat anything.',
        furigana: 'なにもたべませんでした。',
      },
      {
        japanese: '猫も犬も好きです。',
        english: 'I like both cats and dogs.',
        furigana: 'ねこもいぬもすきです。',
      },
    ],
  },

  // ===========================================================================
  // COPULA / EXISTENCE (4)
  // ===========================================================================
  {
    pattern: 'です',
    meaning: 'to be (polite copula)',
    formation: 'Noun / な-Adjective + です',
    jlpt_level: 'N5',
    difficulty: 'beginner',
    explanation:
      'The polite copula です states that something "is" something. It goes at the end of a sentence to make it polite.',
    notes: 'Used after nouns and な-adjectives. After い-adjectives, です adds politeness but is technically not a copula.',
    common_mistakes:
      'Dropping です in polite speech. In casual speech だ replaces です, but omitting it entirely can sound abrupt in polite contexts.',
    examples: [
      {
        japanese: '私は学生です。',
        english: 'I am a student.',
        furigana: 'わたしはがくせいです。',
      },
      {
        japanese: 'これはペンです。',
        english: 'This is a pen.',
        furigana: 'これはペンです。',
      },
      {
        japanese: 'あの人は日本人です。',
        english: 'That person is Japanese.',
        furigana: 'あのひとはにほんじんです。',
      },
    ],
  },
  {
    pattern: 'じゃないです',
    meaning: 'is not (polite negative copula)',
    formation: 'Noun / な-Adjective + じゃないです',
    jlpt_level: 'N5',
    difficulty: 'beginner',
    explanation:
      'The polite negative form of です. Used to negate nouns and な-adjectives: "X is not Y."',
    notes:
      'じゃないです is conversational polite. ではありません is the formal equivalent. Both are correct at N5.',
    common_mistakes:
      'Using じゃないです with い-adjectives. For い-adjectives, use くないです: 高くないです, not ×高いじゃないです.',
    examples: [
      {
        japanese: '私は先生じゃないです。',
        english: 'I am not a teacher.',
        furigana: 'わたしはせんせいじゃないです。',
      },
      {
        japanese: 'ここは静かじゃないです。',
        english: 'This place is not quiet.',
        furigana: 'ここはしずかじゃないです。',
      },
      {
        japanese: 'あれは猫じゃないです。',
        english: 'That is not a cat.',
        furigana: 'あれはねこじゃないです。',
      },
    ],
  },
  {
    pattern: 'があります',
    meaning: 'there is (inanimate existence)',
    formation: 'Place に + Noun が + あります',
    jlpt_level: 'N5',
    difficulty: 'beginner',
    explanation:
      'あります expresses the existence of inanimate objects (things, plants, events). The location is marked with に, and the thing with が.',
    notes: 'Negative form: ありません. Past: ありました. Also used for possession: 車があります (I have a car).',
    common_mistakes:
      'Using あります for living things. For people and animals use います: 犬がいます, not ×犬があります.',
    examples: [
      {
        japanese: '机の上に本があります。',
        english: 'There is a book on the desk.',
        furigana: 'つくえのうえにほんがあります。',
      },
      {
        japanese: 'コンビニはあそこにあります。',
        english: 'The convenience store is over there.',
        furigana: 'コンビニはあそこにあります。',
      },
      {
        japanese: '時間がありません。',
        english: 'I don\'t have time.',
        furigana: 'じかんがありません。',
      },
      {
        japanese: '明日テストがあります。',
        english: 'There is a test tomorrow.',
        furigana: 'あしたテストがあります。',
      },
    ],
  },
  {
    pattern: 'がいます',
    meaning: 'there is (animate existence)',
    formation: 'Place に + Noun が + います',
    jlpt_level: 'N5',
    difficulty: 'beginner',
    explanation:
      'います expresses the existence of animate beings (people, animals). The location is marked with に, and the being with が.',
    notes: 'Negative form: いません. Past: いました. Also used for "I have" with family/pets: 兄がいます (I have an older brother).',
    common_mistakes:
      'Using います for inanimate objects. For things use あります: 本があります, not ×本がいます. Exception: robots and cars in fiction sometimes use います.',
    examples: [
      {
        japanese: '公園に子供がいます。',
        english: 'There are children in the park.',
        furigana: 'こうえんにこどもがいます。',
      },
      {
        japanese: '兄弟がいますか。',
        english: 'Do you have siblings?',
        furigana: 'きょうだいがいますか。',
      },
      {
        japanese: '教室に先生がいません。',
        english: 'The teacher is not in the classroom.',
        furigana: 'きょうしつにせんせいがいません。',
      },
    ],
  },

  // ===========================================================================
  // VERBS (6)
  // ===========================================================================
  {
    pattern: 'ます',
    meaning: 'polite present/future verb ending',
    formation: 'Verb stem + ます',
    jlpt_level: 'N5',
    difficulty: 'beginner',
    explanation:
      'The ます form is the polite present/future tense of verbs. It expresses habitual actions or future plans.',
    notes:
      'To form: for る-verbs, drop る and add ます (食べる → 食べます). For う-verbs, change the last vowel to い-row and add ます (飲む → 飲みます).',
    common_mistakes:
      'Misidentifying verb groups. Some verbs ending in る are actually う-verbs: 帰る → 帰ります (not ×帰ます).',
    examples: [
      {
        japanese: '毎日日本語を勉強します。',
        english: 'I study Japanese every day.',
        furigana: 'まいにちにほんごをべんきょうします。',
      },
      {
        japanese: '朝ごはんを食べます。',
        english: 'I eat breakfast.',
        furigana: 'あさごはんをたべます。',
      },
      {
        japanese: '明日東京に行きます。',
        english: 'I will go to Tokyo tomorrow.',
        furigana: 'あしたとうきょうにいきます。',
      },
    ],
  },
  {
    pattern: 'ません',
    meaning: 'polite negative verb ending',
    formation: 'Verb stem + ません',
    jlpt_level: 'N5',
    difficulty: 'beginner',
    explanation:
      'The polite negative present/future tense. Expresses that someone does not do or will not do an action.',
    notes: 'Simply replace ます with ません. All verb groups follow the same pattern once you have the stem.',
    examples: [
      {
        japanese: '肉を食べません。',
        english: 'I don\'t eat meat.',
        furigana: 'にくをたべません。',
      },
      {
        japanese: 'お酒を飲みません。',
        english: 'I don\'t drink alcohol.',
        furigana: 'おさけをのみません。',
      },
      {
        japanese: '明日は来ません。',
        english: 'I won\'t come tomorrow.',
        furigana: 'あしたはきません。',
      },
    ],
  },
  {
    pattern: 'ました',
    meaning: 'polite past verb ending',
    formation: 'Verb stem + ました',
    jlpt_level: 'N5',
    difficulty: 'beginner',
    explanation:
      'The polite past tense. Expresses that an action was completed in the past.',
    notes: 'Simply replace ます with ました. Works the same for all verb groups.',
    examples: [
      {
        japanese: '昨日映画を見ました。',
        english: 'I watched a movie yesterday.',
        furigana: 'きのうえいがをみました。',
      },
      {
        japanese: '日本に行きました。',
        english: 'I went to Japan.',
        furigana: 'にほんにいきました。',
      },
      {
        japanese: '朝ごはんを食べました。',
        english: 'I ate breakfast.',
        furigana: 'あさごはんをたべました。',
      },
    ],
  },
  {
    pattern: 'ませんでした',
    meaning: 'polite negative past verb ending',
    formation: 'Verb stem + ませんでした',
    jlpt_level: 'N5',
    difficulty: 'beginner',
    explanation:
      'The polite negative past tense. Expresses that an action did not happen in the past.',
    notes: 'Replace ます with ませんでした. This is the only past negative polite form — don\'t mix patterns.',
    common_mistakes:
      'Saying ×ませなかったです. The correct polite negative past is always ませんでした.',
    examples: [
      {
        japanese: '昨日勉強しませんでした。',
        english: 'I didn\'t study yesterday.',
        furigana: 'きのうべんきょうしませんでした。',
      },
      {
        japanese: '何も食べませんでした。',
        english: 'I didn\'t eat anything.',
        furigana: 'なにもたべませんでした。',
      },
      {
        japanese: '彼は来ませんでした。',
        english: 'He didn\'t come.',
        furigana: 'かれはきませんでした。',
      },
    ],
  },
  {
    pattern: 'て-form',
    meaning: 'verb connective / request form',
    formation: 'Verb て-form (varies by verb group)',
    jlpt_level: 'N5',
    difficulty: 'intermediate',
    explanation:
      'The て-form is the most important verb conjugation in Japanese. It connects actions in sequence, makes requests (〜てください), and forms progressive tense (〜ている).',
    notes:
      'Formation rules: る-verbs: drop る, add て (食べて). う-verbs vary by ending: う/つ/る → って, む/ぶ/ぬ → んで, く → いて, ぐ → いで, す → して. Exception: 行く → 行って.',
    common_mistakes:
      'Irregular て-forms. Common exceptions: 行く → 行って (not ×行いて), する → して, 来る → 来て (きて).',
    examples: [
      {
        japanese: '座ってください。',
        english: 'Please sit down.',
        furigana: 'すわってください。',
      },
      {
        japanese: '食べて、飲んで、寝ました。',
        english: 'I ate, drank, and slept.',
        furigana: 'たべて、のんで、ねました。',
      },
      {
        japanese: 'ここに名前を書いてください。',
        english: 'Please write your name here.',
        furigana: 'ここにまなえをかいてください。',
      },
      {
        japanese: '写真を撮ってもいいですか。',
        english: 'May I take a photo?',
        furigana: 'しゃしんをとってもいいですか。',
      },
    ],
  },
  {
    pattern: 'ている',
    meaning: 'progressive / resultant state',
    formation: 'Verb て-form + いる / います',
    jlpt_level: 'N5',
    difficulty: 'intermediate',
    explanation:
      'て-form + いる expresses an ongoing action (progressive) or a resultant state. The polite form is ています.',
    notes:
      'Two main uses: (1) ongoing action — 食べている (is eating), (2) resultant state — 結婚している (is married, not "is marrying"). Verbs of change (死ぬ, 知る) typically express result, not progress.',
    common_mistakes:
      'Translating always as "-ing". 知っている means "I know" (a state), not "I am knowing". 死んでいる means "is dead", not "is dying".',
    examples: [
      {
        japanese: '今、本を読んでいます。',
        english: 'I am reading a book right now.',
        furigana: 'いま、ほんをよんでいます。',
      },
      {
        japanese: '東京に住んでいます。',
        english: 'I live in Tokyo.',
        furigana: 'とうきょうにすんでいます。',
      },
      {
        japanese: '田中さんを知っていますか。',
        english: 'Do you know Mr. Tanaka?',
        furigana: 'たなかさんをしっていますか。',
      },
      {
        japanese: '雨が降っています。',
        english: 'It is raining.',
        furigana: 'あめがふっています。',
      },
    ],
  },

  // ===========================================================================
  // ADJECTIVES (4)
  // ===========================================================================
  {
    pattern: 'い-adjective',
    meaning: 'い-adjective predicate form',
    formation: 'い-Adjective + です',
    jlpt_level: 'N5',
    difficulty: 'beginner',
    explanation:
      'い-adjectives end in い and can directly modify nouns or serve as predicates. Add です for politeness. Past tense: drop い, add かったです.',
    notes:
      'い-adjectives conjugate on their own: 高い → 高かった (past), 高くない (negative). The い is part of the adjective, not a separate ending.',
    common_mistakes:
      'Treating きれい and 嫌い as い-adjectives. They are actually な-adjectives despite ending in い: きれいな人 (not ×きれいい人).',
    examples: [
      {
        japanese: 'この本は面白いです。',
        english: 'This book is interesting.',
        furigana: 'このほんはおもしろいです。',
      },
      {
        japanese: '今日は寒いです。',
        english: 'Today is cold.',
        furigana: 'きょうはさむいです。',
      },
      {
        japanese: '高い山が見えます。',
        english: 'I can see a tall mountain.',
        furigana: 'たかいやまがみえます。',
      },
      {
        japanese: '昨日は暑かったです。',
        english: 'Yesterday was hot.',
        furigana: 'きのうはあつかったです。',
      },
    ],
  },
  {
    pattern: 'な-adjective',
    meaning: 'な-adjective predicate and modifier form',
    formation: 'な-Adjective + な + Noun / な-Adjective + です',
    jlpt_level: 'N5',
    difficulty: 'beginner',
    explanation:
      'な-adjectives require な when modifying a noun, and use です as a predicate. They negate with じゃないです and form past tense with でした.',
    notes:
      'Common な-adjectives: 静か (quiet), 元気 (energetic), 好き (liked), 嫌い (disliked), きれい (pretty), 有名 (famous).',
    common_mistakes:
      'Forgetting な before a noun. Say 静かな場所 (quiet place), not ×静か場所.',
    examples: [
      {
        japanese: 'この町は静かです。',
        english: 'This town is quiet.',
        furigana: 'このまちはしずかです。',
      },
      {
        japanese: '元気な子供たち。',
        english: 'Energetic children.',
        furigana: 'げんきなこどもたち。',
      },
      {
        japanese: '有名な映画です。',
        english: 'It is a famous movie.',
        furigana: 'ゆうめいなえいがです。',
      },
      {
        japanese: '日本語が上手ですね。',
        english: 'Your Japanese is good, isn\'t it?',
        furigana: 'にほんごがじょうずですね。',
      },
    ],
  },
  {
    pattern: 'くない',
    meaning: 'い-adjective negative form',
    formation: 'い-Adjective (drop い) + くない + です',
    jlpt_level: 'N5',
    difficulty: 'beginner',
    explanation:
      'To negate an い-adjective, drop the final い and add くない. Add です for politeness. Past negative: くなかったです.',
    notes: 'いい (good) is irregular: its negative is よくない, not ×いくない. All other い-adjectives are regular.',
    common_mistakes:
      'Negating いい incorrectly. The correct forms are: よくない (not good), よくなかった (was not good).',
    examples: [
      {
        japanese: 'この映画は面白くないです。',
        english: 'This movie is not interesting.',
        furigana: 'このえいがはおもしろくないです。',
      },
      {
        japanese: '今日は暑くないです。',
        english: 'Today is not hot.',
        furigana: 'きょうはあつくないです。',
      },
      {
        japanese: 'あまり高くなかったです。',
        english: 'It wasn\'t very expensive.',
        furigana: 'あまりたかくなかったです。',
      },
      {
        japanese: 'この問題は難しくないです。',
        english: 'This problem is not difficult.',
        furigana: 'このもんだいはむずかしくないです。',
      },
    ],
  },
  {
    pattern: 'じゃない',
    meaning: 'な-adjective / noun negative form',
    formation: 'な-Adjective / Noun + じゃない + です',
    jlpt_level: 'N5',
    difficulty: 'beginner',
    explanation:
      'To negate a な-adjective or noun predicate, add じゃないです (or ではありません in formal speech). Past negative: じゃなかったです.',
    notes:
      'じゃ is the contracted form of では. Formal writing uses ではない. Both are correct; じゃない is more conversational.',
    common_mistakes:
      'Using くない with な-adjectives. Say 静かじゃないです, not ×静かくないです. くない is only for い-adjectives.',
    examples: [
      {
        japanese: 'ここは静かじゃないです。',
        english: 'This place is not quiet.',
        furigana: 'ここはしずかじゃないです。',
      },
      {
        japanese: '彼は学生じゃないです。',
        english: 'He is not a student.',
        furigana: 'かれはがくせいじゃないです。',
      },
      {
        japanese: '昨日は暇じゃなかったです。',
        english: 'Yesterday I wasn\'t free.',
        furigana: 'きのうはひまじゃなかったです。',
      },
    ],
  },

  // ===========================================================================
  // SENTENCE PATTERNS (4)
  // ===========================================================================
  {
    pattern: 'か',
    meaning: 'question marker particle',
    formation: 'Sentence + か',
    jlpt_level: 'N5',
    difficulty: 'beginner',
    explanation:
      'Adding か to the end of a sentence turns it into a yes/no question. Word order does not change — only か is added.',
    notes:
      'In polite speech, か is always used. In casual speech, か can sound blunt or rhetorical; rising intonation alone often marks a question.',
    examples: [
      {
        japanese: 'これは何ですか。',
        english: 'What is this?',
        furigana: 'これはなんですか。',
      },
      {
        japanese: '日本語を話しますか。',
        english: 'Do you speak Japanese?',
        furigana: 'にほんごをはなしますか。',
      },
      {
        japanese: 'トイレはどこですか。',
        english: 'Where is the restroom?',
        furigana: 'トイレはどこですか。',
      },
      {
        japanese: '明日は暇ですか。',
        english: 'Are you free tomorrow?',
        furigana: 'あしたはひまですか。',
      },
    ],
  },
  {
    pattern: 'の',
    meaning: 'possessive / nominalizer particle',
    formation: 'Noun + の + Noun / Sentence + の',
    jlpt_level: 'N5',
    difficulty: 'beginner',
    explanation:
      'The particle の connects two nouns to show possession, association, or description. It also nominalizes sentences (turns them into noun clauses).',
    notes:
      'の is extremely versatile: 私の本 (my book), 日本の文化 (Japanese culture), 食べるのが好き (I like eating).',
    examples: [
      {
        japanese: '私の名前は田中です。',
        english: 'My name is Tanaka.',
        furigana: 'わたしのなまえはたなかです。',
      },
      {
        japanese: '日本語の本を読みます。',
        english: 'I read a Japanese-language book.',
        furigana: 'にほんごのほんをよみます。',
      },
      {
        japanese: '食べるのが好きです。',
        english: 'I like eating.',
        furigana: 'たべるのがすきです。',
      },
      {
        japanese: 'これは誰のですか。',
        english: 'Whose is this?',
        furigana: 'これはだれのですか。',
      },
    ],
  },
  {
    pattern: 'ね',
    meaning: 'confirmation / agreement seeking particle',
    formation: 'Sentence + ね',
    jlpt_level: 'N5',
    difficulty: 'beginner',
    explanation:
      'The sentence-ending particle ね seeks agreement or confirmation from the listener. It is similar to "right?", "isn\'t it?", or "don\'t you think?".',
    notes:
      'ね softens statements and builds rapport. Overusing it can sound childish; underusing it can sound cold. It is a social lubricant in Japanese.',
    examples: [
      {
        japanese: 'いい天気ですね。',
        english: 'Nice weather, isn\'t it?',
        furigana: 'いいてんきですね。',
      },
      {
        japanese: 'この料理は美味しいですね。',
        english: 'This food is delicious, isn\'t it?',
        furigana: 'このりょうりはおいしいですね。',
      },
      {
        japanese: '日本語は難しいですね。',
        english: 'Japanese is difficult, right?',
        furigana: 'にほんごはむずかしいですね。',
      },
    ],
  },
  {
    pattern: 'よ',
    meaning: 'emphasis / assertion particle',
    formation: 'Sentence + よ',
    jlpt_level: 'N5',
    difficulty: 'beginner',
    explanation:
      'The sentence-ending particle よ asserts information the speaker believes the listener doesn\'t know. It adds emphasis or conviction, similar to "you know" or "I\'m telling you".',
    notes:
      'Use よ when sharing new information or giving advice. Overusing it can sound pushy. Combining ね and よ as よね means "right?" with more confidence.',
    examples: [
      {
        japanese: 'これは美味しいですよ。',
        english: 'This is delicious, you know!',
        furigana: 'これはおいしいですよ。',
      },
      {
        japanese: '明日は休みですよ。',
        english: 'Tomorrow is a holiday, you know.',
        furigana: 'あしたはやすみですよ。',
      },
      {
        japanese: '気をつけてくださいよ。',
        english: 'Please be careful!',
        furigana: 'きをつけてくださいよ。',
      },
    ],
  },

  // ===========================================================================
  // CONNECTORS (4)
  // ===========================================================================
  {
    pattern: 'から',
    meaning: 'because / from',
    formation: 'Sentence (plain/polite) + から / Noun + から',
    jlpt_level: 'N5',
    difficulty: 'beginner',
    explanation:
      'から after a sentence means "because" — it gives a reason. After a noun or time, it means "from" (starting point).',
    notes:
      'Reason から comes after the reason clause: 暑いから窓を開ける (Because it\'s hot, I open the window). Both plain and polite forms can precede から.',
    common_mistakes:
      'Mixing up word order. In Japanese, the reason comes first: [reason]から[result]. English is often the reverse: "I opened the window because it\'s hot."',
    examples: [
      {
        japanese: '暑いですから、窓を開けます。',
        english: 'Because it\'s hot, I\'ll open the window.',
        furigana: 'あついですから、まどをあけます。',
      },
      {
        japanese: '九時から仕事です。',
        english: 'Work starts from 9 o\'clock.',
        furigana: 'くじからしごとです。',
      },
      {
        japanese: '疲れたから、寝ます。',
        english: 'Because I\'m tired, I\'ll go to sleep.',
        furigana: 'つかれたから、ねます。',
      },
      {
        japanese: '東京から大阪まで新幹線で行きます。',
        english: 'I go from Tokyo to Osaka by bullet train.',
        furigana: 'とうきょうからおおさかまでしんかんせんでいきます。',
      },
    ],
  },
  {
    pattern: 'けど / が',
    meaning: 'but / although',
    formation: 'Sentence + けど / が + Sentence',
    jlpt_level: 'N5',
    difficulty: 'beginner',
    explanation:
      'けど and が connect two sentences with a contrasting or qualifying relationship, meaning "but" or "although". が is slightly more formal than けど.',
    notes:
      'けど has casual variants: けれど, けれども. All mean "but". が is also used to soften a lead-in: すみませんが… (Excuse me, but…).',
    common_mistakes:
      'Confusing が (but) with が (subject marker). Context and position distinguish them: after a clause = "but", after a noun = subject marker.',
    examples: [
      {
        japanese: '日本語は難しいですが、面白いです。',
        english: 'Japanese is difficult, but interesting.',
        furigana: 'にほんごはむずかしいですが、おもしろいです。',
      },
      {
        japanese: '高いけど、買いました。',
        english: 'It was expensive, but I bought it.',
        furigana: 'たかいけど、かいました。',
      },
      {
        japanese: 'すみませんが、ちょっといいですか。',
        english: 'Excuse me, but do you have a moment?',
        furigana: 'すみませんが、ちょっといいですか。',
      },
    ],
  },
  {
    pattern: 'たい',
    meaning: 'want to do',
    formation: 'Verb stem + たい',
    jlpt_level: 'N5',
    difficulty: 'beginner',
    explanation:
      'Adding たい to the verb stem expresses the speaker\'s desire to do something. It conjugates like an い-adjective: たくない (don\'t want to), たかった (wanted to).',
    notes:
      'たい is only for the speaker\'s own desires (or asking about the listener\'s). For third-person desires, use たがっている.',
    common_mistakes:
      'Using たい for other people\'s wants. Say 彼は行きたがっている (He wants to go), not ×彼は行きたいです.',
    examples: [
      {
        japanese: '日本に行きたいです。',
        english: 'I want to go to Japan.',
        furigana: 'にほんにいきたいです。',
      },
      {
        japanese: '何を食べたいですか。',
        english: 'What do you want to eat?',
        furigana: 'なにをたべたいですか。',
      },
      {
        japanese: '新しい車が買いたいです。',
        english: 'I want to buy a new car.',
        furigana: 'あたらしいくるまがかいたいです。',
      },
      {
        japanese: '今日は何もしたくないです。',
        english: 'I don\'t want to do anything today.',
        furigana: 'きょうはなにもしたくないです。',
      },
    ],
  },
  {
    pattern: 'ましょう',
    meaning: 'let\'s / shall we',
    formation: 'Verb stem + ましょう',
    jlpt_level: 'N5',
    difficulty: 'beginner',
    explanation:
      'ましょう is the volitional polite form, used to suggest doing something together ("let\'s") or to offer to do something ("shall I").',
    notes:
      'ましょうか adds か to make it a suggestion/offer: 手伝いましょうか (Shall I help?). The casual equivalent is the plain volitional form: 行こう (let\'s go).',
    examples: [
      {
        japanese: '一緒に食べましょう。',
        english: 'Let\'s eat together.',
        furigana: 'いっしょにたべましょう。',
      },
      {
        japanese: '始めましょう。',
        english: 'Let\'s begin.',
        furigana: 'はじめましょう。',
      },
      {
        japanese: '休みましょうか。',
        english: 'Shall we take a break?',
        furigana: 'やすみましょうか。',
      },
      {
        japanese: '映画を見に行きましょう。',
        english: 'Let\'s go see a movie.',
        furigana: 'えいがをみにいきましょう。',
      },
    ],
  },
]
