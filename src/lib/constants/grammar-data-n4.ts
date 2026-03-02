import type { GrammarPatternData } from '@/types/grammar'

export const N4_GRAMMAR_PATTERNS: GrammarPatternData[] = [
  // ===========================================================================
  // VERBS (9)
  // ===========================================================================
  {
    pattern: '辞書形',
    meaning: 'verb dictionary/plain form',
    formation: 'Verb base form (as listed in the dictionary)',
    jlpt_level: 'N4',
    difficulty: 'intermediate',
    explanation:
      'The dictionary form is the plain present/future affirmative form of a verb. It is used in casual speech, inside embedded clauses, and before many grammar patterns. Learning it is essential because most N4+ grammar attaches to the dictionary form.',
    notes:
      'Three verb groups: る-verbs end in いる/える (食べる, 見る), う-verbs end in an う-row kana (書く, 飲む, 話す), and irregular verbs are する and 来る (くる).',
    common_mistakes:
      'Confusing verb groups. Some verbs look like る-verbs but are actually う-verbs: 帰る (かえる) → 帰らない, not ×帰ない. 切る (きる) → 切らない, not ×切ない.',
    examples: [
      {
        japanese: '明日友達に会う。',
        english: 'I will meet my friend tomorrow.',
        furigana: 'あしたともだちにあう。',
      },
      {
        japanese: '毎朝コーヒーを飲む。',
        english: 'I drink coffee every morning.',
        furigana: 'まいあさコーヒーをのむ。',
      },
      {
        japanese: '週末に映画を見ると思う。',
        english: 'I think I will watch a movie on the weekend.',
        furigana: 'しゅうまつにえいがをみるとおもう。',
      },
      {
        japanese: '日本語を話すことができる。',
        english: 'I can speak Japanese.',
        furigana: 'にほんごをはなすことができる。',
      },
    ],
  },
  {
    pattern: 'ない-form',
    meaning: 'plain negative verb form',
    formation: 'Verb ない-form (う-verbs: change う to あ + ない / る-verbs: drop る + ない)',
    jlpt_level: 'N4',
    difficulty: 'intermediate',
    explanation:
      'The ない-form is the plain negative of a verb, used in casual speech and as a building block for many grammar patterns such as なければならない and なくてもいい. It conjugates like an い-adjective.',
    notes:
      'Irregular forms: する → しない, 来る → 来ない (こない), ある → ない. For う-verbs ending in う: 買う → 買わない (not ×買あない).',
    common_mistakes:
      'Forgetting the わ exception. Verbs ending in う use わ, not あ: 会う → 会わない, 言う → 言わない, 買う → 買わない.',
    examples: [
      {
        japanese: '今日は出かけない。',
        english: 'I am not going out today.',
        furigana: 'きょうはでかけない。',
      },
      {
        japanese: '野菜を食べないのは体に悪い。',
        english: 'Not eating vegetables is bad for your health.',
        furigana: 'やさいをたべないのはからだにわるい。',
      },
      {
        japanese: 'お酒は飲まないことにしている。',
        english: 'I have decided not to drink alcohol.',
        furigana: 'おさけはのまないことにしている。',
      },
      {
        japanese: '彼はまだ来ない。',
        english: 'He has not come yet.',
        furigana: 'かれはまだこない。',
      },
    ],
  },
  {
    pattern: 'た-form',
    meaning: 'plain past verb form',
    formation: 'Same sound changes as て-form but ending in た/だ',
    jlpt_level: 'N4',
    difficulty: 'intermediate',
    explanation:
      'The た-form is the plain past tense of a verb. It follows the same consonant changes as the て-form: て → た, で → だ. It is used in casual speech, inside relative clauses, and with patterns like たことがある and たら.',
    notes:
      'Formation mirrors て-form exactly: 食べて → 食べた, 飲んで → 飲んだ, 書いて → 書いた, 行って → 行った. Irregular: した, 来た (きた).',
    common_mistakes:
      'Forgetting that た-form follows て-form rules. If you know 読んで, the past is 読んだ (not ×読った). Pair them to remember.',
    examples: [
      {
        japanese: '昨日の映画は面白かった。',
        english: 'Yesterday\'s movie was interesting.',
        furigana: 'きのうのえいがはおもしろかった。',
      },
      {
        japanese: 'もう宿題をやった。',
        english: 'I already did my homework.',
        furigana: 'もうしゅくだいをやった。',
      },
      {
        japanese: '駅に着いたら電話してください。',
        english: 'Please call me when you arrive at the station.',
        furigana: 'えきについたらでんわしてください。',
      },
      {
        japanese: '先週買った本はとても良かった。',
        english: 'The book I bought last week was very good.',
        furigana: 'せんしゅうかったほんはとてもよかった。',
      },
    ],
  },
  {
    pattern: 'たことがある',
    meaning: 'have experienced / have done before',
    formation: 'Verb た-form + ことがある',
    jlpt_level: 'N4',
    difficulty: 'intermediate',
    explanation:
      'This pattern expresses that someone has had the experience of doing something at least once. It focuses on whether the experience exists, not when it happened. The negative form たことがない means "have never done".',
    notes:
      'Use for life experiences, not recent or habitual past events. "I have been to Japan" = 日本に行ったことがある. For "I went to Japan yesterday", use plain past: 昨日日本に行った.',
    common_mistakes:
      'Using dictionary form instead of た-form. Say 食べたことがある (have eaten), not ×食べることがある (which means "sometimes eat").',
    examples: [
      {
        japanese: '日本に行ったことがあります。',
        english: 'I have been to Japan.',
        furigana: 'にほんにいったことがあります。',
      },
      {
        japanese: '納豆を食べたことがありますか。',
        english: 'Have you ever eaten natto?',
        furigana: 'なっとうをたべたことがありますか。',
      },
      {
        japanese: '富士山に登ったことがない。',
        english: 'I have never climbed Mt. Fuji.',
        furigana: 'ふじさんにのぼったことがない。',
      },
      {
        japanese: '着物を着たことがあります。',
        english: 'I have worn a kimono before.',
        furigana: 'きものをきたことがあります。',
      },
    ],
  },
  {
    pattern: 'たり〜たりする',
    meaning: 'do things like A and B',
    formation: 'Verb た-form + り + Verb た-form + り + する',
    jlpt_level: 'N4',
    difficulty: 'intermediate',
    explanation:
      'This pattern lists representative actions from a larger set, meaning "do things like A and B (among other things)." It implies the list is not exhaustive. The final する can be conjugated for tense and politeness.',
    notes:
      'You can use just one たり for a single representative action. Also works with adjectives: 暑かったり寒かったりする (sometimes hot, sometimes cold).',
    common_mistakes:
      'Forgetting the final する. The pattern requires する at the end: 読んだり書いたりする, not ×読んだり書いたり.',
    examples: [
      {
        japanese: '休みの日は本を読んだり音楽を聞いたりします。',
        english: 'On my days off, I do things like read books and listen to music.',
        furigana: 'やすみのひはほんをよんだりおんがくをきいたりします。',
      },
      {
        japanese: '週末は友達と遊んだり買い物をしたりした。',
        english: 'On the weekend, I did things like hang out with friends and go shopping.',
        furigana: 'しゅうまつはともだちとあそんだりかいものをしたりした。',
      },
      {
        japanese: '最近、天気が暑かったり寒かったりする。',
        english: 'Recently, the weather has been hot and cold (alternating).',
        furigana: 'さいきん、てんきがあつかったりさむかったりする。',
      },
      {
        japanese: '旅行中は写真を撮ったり料理を食べたりしました。',
        english: 'During the trip, I did things like take photos and eat local food.',
        furigana: 'りょこうちゅうはしゃしんをとったりりょうりをたべたりしました。',
      },
    ],
  },
  {
    pattern: 'てある',
    meaning: 'resultant state from intentional action',
    formation: 'Verb て-form + ある',
    jlpt_level: 'N4',
    difficulty: 'intermediate',
    explanation:
      'てある describes a state that exists as the result of someone intentionally performing an action. It emphasizes the current state, not the action itself. Only transitive verbs are used. The object is usually marked with が.',
    notes:
      'Compare: ドアが開いている (the door is open — state) vs ドアが開けてある (the door has been opened [by someone on purpose]). てある implies someone did it deliberately.',
    common_mistakes:
      'Confusing てある with ている. 窓が開いている simply describes a state. 窓が開けてある implies someone opened it intentionally and it remains that way.',
    examples: [
      {
        japanese: 'テーブルの上にお茶が置いてあります。',
        english: 'Tea has been placed on the table.',
        furigana: 'テーブルのうえにおちゃがおいてあります。',
      },
      {
        japanese: '壁に絵が掛けてある。',
        english: 'A picture has been hung on the wall.',
        furigana: 'かべにえがかけてある。',
      },
      {
        japanese: '予約はもうしてあります。',
        english: 'The reservation has already been made.',
        furigana: 'よやくはもうしてあります。',
      },
      {
        japanese: '黒板に明日の予定が書いてある。',
        english: 'Tomorrow\'s schedule has been written on the blackboard.',
        furigana: 'こくばんにあしたのよていがかいてある。',
      },
    ],
  },
  {
    pattern: 'てしまう',
    meaning: 'end up doing / completely do with regret',
    formation: 'Verb て-form + しまう',
    jlpt_level: 'N4',
    difficulty: 'intermediate',
    explanation:
      'てしまう has two main meanings: (1) completion — an action is completely finished, and (2) regret — something unfortunate or unintended happened. Context determines which meaning applies. The polite form is てしまいます.',
    notes:
      'In casual speech, てしまう contracts to ちゃう and でしまう contracts to じゃう: 食べてしまう → 食べちゃう, 飲んでしまう → 飲んじゃう.',
    common_mistakes:
      'Always assuming regret. てしまう can be neutral completion: 本を全部読んでしまった can mean "I finished reading the whole book" without any regret.',
    examples: [
      {
        japanese: '電車の中で寝てしまいました。',
        english: 'I accidentally fell asleep on the train.',
        furigana: 'でんしゃのなかでねてしまいました。',
      },
      {
        japanese: 'ケーキを全部食べてしまった。',
        english: 'I ate all the cake (and now it\'s gone).',
        furigana: 'ケーキをぜんぶたべてしまった。',
      },
      {
        japanese: '大事な書類をなくしてしまいました。',
        english: 'I ended up losing an important document.',
        furigana: 'だいじなしょるいをなくしてしまいました。',
      },
      {
        japanese: '宿題をもう終わらせてしまった。',
        english: 'I already finished my homework completely.',
        furigana: 'しゅくだいをもうおわらせてしまった。',
      },
    ],
  },
  {
    pattern: '受身形',
    meaning: 'passive voice',
    formation:
      'る-verbs: drop る + られる / う-verbs: change う to あ + れる / する → される / 来る → 来られる',
    jlpt_level: 'N4',
    difficulty: 'advanced',
    explanation:
      'The passive form expresses that the subject receives or is affected by an action. Japanese passive has two types: direct passive (the subject is the object of the action) and indirect/adversative passive (the subject is negatively affected by someone else\'s action).',
    notes:
      'The adversative passive (迷惑の受身) is unique to Japanese. 雨に降られた means "I was rained on (and it was bad for me)" — rain did not target you, but you were affected.',
    common_mistakes:
      'Confusing passive られる with potential られる for る-verbs. 食べられる can mean "is eaten" (passive) or "can eat" (potential). Context distinguishes them.',
    examples: [
      {
        japanese: '弟にケーキを食べられた。',
        english: 'My little brother ate my cake (and I\'m upset about it).',
        furigana: 'おとうとにケーキをたべられた。',
      },
      {
        japanese: 'この小説は多くの人に読まれている。',
        english: 'This novel is read by many people.',
        furigana: 'このしょうせつはおおくのひとによまれている。',
      },
      {
        japanese: '電車の中で足を踏まれました。',
        english: 'Someone stepped on my foot on the train.',
        furigana: 'でんしゃのなかであしをふまれました。',
      },
      {
        japanese: '先生に名前を呼ばれた。',
        english: 'I was called by name by the teacher.',
        furigana: 'せんせいになまえをよばれた。',
      },
    ],
  },
  {
    pattern: '使役形',
    meaning: 'causative form: make/let someone do',
    formation:
      'る-verbs: drop る + させる / う-verbs: change う to あ + せる / する → させる / 来る → 来させる',
    jlpt_level: 'N4',
    difficulty: 'advanced',
    explanation:
      'The causative form expresses making or letting someone do something. Whether it means "make" (compulsion) or "let" (permission) depends on context. The person made to act is marked with を (for intransitive verbs) or に (for transitive verbs).',
    notes:
      'Causative + てください is a polite way to ask permission: 行かせてください (Please let me go). Casual contracted forms: 食べさせる → 食べさす, 行かせる → 行かす.',
    common_mistakes:
      'Mixing up を and に for the person. With intransitive verbs: 子供を走らせる (make the child run). With transitive verbs: 子供に野菜を食べさせる (make the child eat vegetables).',
    examples: [
      {
        japanese: '母は弟に野菜を食べさせた。',
        english: 'My mother made my little brother eat vegetables.',
        furigana: 'はははおとうとにやさいをたべさせた。',
      },
      {
        japanese: '先生は学生を立たせました。',
        english: 'The teacher made the students stand up.',
        furigana: 'せんせいはがくせいをたたせました。',
      },
      {
        japanese: '好きなことをさせてあげたい。',
        english: 'I want to let them do what they like.',
        furigana: 'すきなことをさせてあげたい。',
      },
      {
        japanese: 'すみません、少し考えさせてください。',
        english: 'Excuse me, please let me think for a bit.',
        furigana: 'すみません、すこしかんがえさせてください。',
      },
    ],
  },

  // ===========================================================================
  // CONNECTORS (5)
  // ===========================================================================
  {
    pattern: 'なければならない',
    meaning: 'must do / have to do',
    formation: 'Verb ない-form (drop い) + ければならない',
    jlpt_level: 'N4',
    difficulty: 'intermediate',
    explanation:
      'This pattern expresses obligation or necessity — "must do" or "have to do." It literally means "if one does not do X, it won\'t do." There are several equivalent forms with different levels of formality.',
    notes:
      'Shorter variants: なければいけない, なきゃいけない, なきゃ (casual). なければなりません is the polite form. All convey the same meaning.',
    common_mistakes:
      'Forgetting to drop い from ない before adding ければ. The correct chain is: 行く → 行かない → 行かなければならない, not ×行かないければならない.',
    examples: [
      {
        japanese: '明日までにレポートを出さなければならない。',
        english: 'I have to submit the report by tomorrow.',
        furigana: 'あしたまでにレポートをださなければならない。',
      },
      {
        japanese: '毎日薬を飲まなければなりません。',
        english: 'I must take medicine every day.',
        furigana: 'まいにちくすりをのまなければなりません。',
      },
      {
        japanese: '試験のために勉強しなければならない。',
        english: 'I have to study for the exam.',
        furigana: 'しけんのためにべんきょうしなければならない。',
      },
      {
        japanese: '早く起きなきゃいけない。',
        english: 'I have to wake up early.',
        furigana: 'はやくおきなきゃいけない。',
      },
    ],
  },
  {
    pattern: 'なくてもいい',
    meaning: 'don\'t have to',
    formation: 'Verb ない-form (drop い) + くてもいい',
    jlpt_level: 'N4',
    difficulty: 'intermediate',
    explanation:
      'This pattern expresses that something is not necessary — "you don\'t have to" or "it\'s okay not to." It removes an obligation rather than forbidding an action.',
    notes:
      'Compare with てはいけない (must not): 食べなくてもいい means "you don\'t have to eat" (permission not to), while 食べてはいけない means "you must not eat" (prohibition).',
    common_mistakes:
      'Confusing "don\'t have to" with "must not." なくてもいい is about lack of obligation; てはいけない is about prohibition. They are very different.',
    examples: [
      {
        japanese: '明日は来なくてもいいですよ。',
        english: 'You don\'t have to come tomorrow.',
        furigana: 'あしたはこなくてもいいですよ。',
      },
      {
        japanese: '全部食べなくてもいいです。',
        english: 'You don\'t have to eat all of it.',
        furigana: 'ぜんぶたべなくてもいいです。',
      },
      {
        japanese: '急がなくてもいい。まだ時間がある。',
        english: 'You don\'t have to hurry. There is still time.',
        furigana: 'いそがなくてもいい。まだじかんがある。',
      },
      {
        japanese: 'お金を払わなくてもいいですか。',
        english: 'Do I not have to pay?',
        furigana: 'おかねをはらわなくてもいいですか。',
      },
    ],
  },
  {
    pattern: 'たら',
    meaning: 'if / when (conditional)',
    formation: 'Verb た-form + ら / い-Adj かった + ら / な-Adj/Noun だった + ら',
    jlpt_level: 'N4',
    difficulty: 'intermediate',
    explanation:
      'たら is the most versatile conditional in Japanese. It can mean "if" (hypothetical), "when" (temporal, after something happens), or "upon doing." It is formed by adding ら to the た-form of verbs, adjectives, or nouns.',
    notes:
      'たら is the safest conditional for beginners — it works in almost all situations. It implies the condition happens first, then the result follows. Often used for one-time or specific situations.',
    common_mistakes:
      'Using たら for general truths or rules. For natural consequences and general facts, と is usually better: 春になると桜が咲く (When spring comes, cherry blossoms bloom).',
    examples: [
      {
        japanese: '雨が降ったら、家にいます。',
        english: 'If it rains, I will stay home.',
        furigana: 'あめがふったら、いえにいます。',
      },
      {
        japanese: '安かったら買います。',
        english: 'If it\'s cheap, I\'ll buy it.',
        furigana: 'やすかったらかいます。',
      },
      {
        japanese: '家に帰ったら、すぐシャワーを浴びる。',
        english: 'When I get home, I take a shower right away.',
        furigana: 'いえにかえったら、すぐシャワーをあびる。',
      },
      {
        japanese: '分からなかったら、先生に聞いてください。',
        english: 'If you don\'t understand, please ask the teacher.',
        furigana: 'わからなかったら、せんせいにきいてください。',
      },
    ],
  },
  {
    pattern: 'ば-form',
    meaning: 'general conditional',
    formation:
      'る-verbs: drop る + れば / う-verbs: change う to え + ば / い-Adj: drop い + ければ',
    jlpt_level: 'N4',
    difficulty: 'intermediate',
    explanation:
      'The ば conditional expresses a general or hypothetical condition — "if X, then Y." It focuses on the condition as a prerequisite for the result. It is commonly used for advice, general statements, and hypothetical situations.',
    notes:
      'ば is often used in the set phrase ばいい (it would be good if): どうすればいいですか (What should I do?). Negative: なければ (if not).',
    common_mistakes:
      'Using ば for past events or sequential actions. ば is for hypothetical or general conditions. For "when I did X, Y happened," use たら instead.',
    examples: [
      {
        japanese: '練習すれば上手になる。',
        english: 'If you practice, you will get better.',
        furigana: 'れんしゅうすればじょうずになる。',
      },
      {
        japanese: '安ければ買いたいです。',
        english: 'If it\'s cheap, I want to buy it.',
        furigana: 'やすければかいたいです。',
      },
      {
        japanese: '時間があれば旅行に行きたい。',
        english: 'If I have time, I want to go on a trip.',
        furigana: 'じかんがあればりょこうにいきたい。',
      },
      {
        japanese: 'どうすればいいですか。',
        english: 'What should I do?',
        furigana: 'どうすればいいですか。',
      },
    ],
  },
  {
    pattern: 'のに',
    meaning: 'although / despite',
    formation: 'Verb plain form + のに / い-Adj + のに / な-Adj + な + のに / Noun + な + のに',
    jlpt_level: 'N4',
    difficulty: 'intermediate',
    explanation:
      'のに expresses a contrast between an expected outcome and what actually happened, conveying surprise, disappointment, or frustration — "even though" or "despite." It carries a stronger emotional nuance than けど.',
    notes:
      'のに implies the speaker\'s feelings (often frustration). けど is neutral. Compare: 高いけど買った (It was expensive, but I bought it — neutral) vs 高いのに買った (Even though it was expensive, he bought it — surprising/critical).',
    common_mistakes:
      'Using のに at the end of a sentence with a command or request. You cannot say ×暑いのに、窓を開けてください. Use けど or から instead for requests.',
    examples: [
      {
        japanese: 'たくさん勉強したのに、テストに落ちた。',
        english: 'Even though I studied a lot, I failed the test.',
        furigana: 'たくさんべんきょうしたのに、テストにおちた。',
      },
      {
        japanese: '約束したのに、彼は来なかった。',
        english: 'Even though he promised, he didn\'t come.',
        furigana: 'やくそくしたのに、かれはこなかった。',
      },
      {
        japanese: 'この薬は高いのに、全然効かない。',
        english: 'Despite this medicine being expensive, it doesn\'t work at all.',
        furigana: 'このくすりはたかいのに、ぜんぜんきかない。',
      },
      {
        japanese: '天気がいいのに、どこにも行かなかった。',
        english: 'Although the weather was nice, I didn\'t go anywhere.',
        furigana: 'てんきがいいのに、どこにもいかなかった。',
      },
    ],
  },

  // ===========================================================================
  // SENTENCE PATTERNS (4)
  // ===========================================================================
  {
    pattern: 'ことができる',
    meaning: 'can do / be able to',
    formation: 'Verb dictionary form + ことができる',
    jlpt_level: 'N4',
    difficulty: 'intermediate',
    explanation:
      'This pattern expresses ability or possibility — "can do" or "is able to do." It is a more formal alternative to the potential verb form. It can also express general possibility (something is possible).',
    notes:
      'The potential form (食べられる, 読める) is more common in conversation. ことができる is more formal and often used in writing, announcements, and rules.',
    common_mistakes:
      'Using ます-form before こと. Use the dictionary form: 泳ぐことができる, not ×泳ぎますことができる.',
    examples: [
      {
        japanese: '日本語を話すことができます。',
        english: 'I can speak Japanese.',
        furigana: 'にほんごをはなすことができます。',
      },
      {
        japanese: 'ここで写真を撮ることができますか。',
        english: 'Can I take photos here?',
        furigana: 'ここでしゃしんをとることができますか。',
      },
      {
        japanese: '漢字を読むことができない。',
        english: 'I cannot read kanji.',
        furigana: 'かんじをよむことができない。',
      },
      {
        japanese: 'このアプリで予約することができます。',
        english: 'You can make a reservation with this app.',
        furigana: 'このアプリでよやくすることができます。',
      },
    ],
  },
  {
    pattern: 'と思う',
    meaning: 'I think that...',
    formation: 'Sentence (plain form) + と思う',
    jlpt_level: 'N4',
    difficulty: 'intermediate',
    explanation:
      'と思う expresses the speaker\'s opinion or thought — "I think that..." The clause before と must be in plain form. For third-person thoughts, use と思っている (is thinking).',
    notes:
      'For first person, と思う (present) and と思っている both work. For third person, use と思っている: 彼は日本に行きたいと思っている (He thinks he wants to go to Japan).',
    common_mistakes:
      'Using polite form before と. Say 明日は雨だと思う, not ×明日は雨ですと思う. The clause before と思う should be in plain form.',
    examples: [
      {
        japanese: '明日は雨が降ると思います。',
        english: 'I think it will rain tomorrow.',
        furigana: 'あしたはあめがふるとおもいます。',
      },
      {
        japanese: 'この映画は面白いと思う。',
        english: 'I think this movie is interesting.',
        furigana: 'このえいがはおもしろいとおもう。',
      },
      {
        japanese: '彼は来ないと思います。',
        english: 'I think he won\'t come.',
        furigana: 'かれはこないとおもいます。',
      },
      {
        japanese: '日本語は難しいけど楽しいと思う。',
        english: 'I think Japanese is difficult but fun.',
        furigana: 'にほんごはむずかしいけどたのしいとおもう。',
      },
    ],
  },
  {
    pattern: 'そうだ',
    meaning: 'looks like / I heard that',
    formation:
      'Appearance: Verb stem + そうだ / い-Adj (drop い) + そうだ | Hearsay: Plain form + そうだ',
    jlpt_level: 'N4',
    difficulty: 'intermediate',
    explanation:
      'そうだ has two distinct uses: (1) appearance — something looks like it will happen or looks a certain way, based on visual observation, and (2) hearsay — reporting information heard from another source, meaning "I heard that." The formation differs for each use.',
    notes:
      'Appearance attaches to verb stems and adjective stems: 降りそう (looks like it will rain), おいしそう (looks delicious). Hearsay attaches to the plain form: 降るそうだ (I heard it will rain).',
    common_mistakes:
      'Mixing up the two formations. Appearance: おいしそう (looks delicious) — drop い. Hearsay: おいしいそうだ (I heard it\'s delicious) — keep い. Exception: いい → よさそう (appearance).',
    examples: [
      {
        japanese: 'このケーキはおいしそうですね。',
        english: 'This cake looks delicious, doesn\'t it?',
        furigana: 'このケーキはおいしそうですね。',
      },
      {
        japanese: '雨が降りそうだ。傘を持っていこう。',
        english: 'It looks like it\'s going to rain. Let\'s bring an umbrella.',
        furigana: 'あめがふりそうだ。かさをもっていこう。',
      },
      {
        japanese: '天気予報によると、明日は暑いそうです。',
        english: 'According to the weather forecast, I heard it will be hot tomorrow.',
        furigana: 'てんきよほうによると、あしたはあついそうです。',
      },
      {
        japanese: '田中さんは来月結婚するそうだ。',
        english: 'I heard that Mr. Tanaka is getting married next month.',
        furigana: 'たなかさんはらいげつけっこんするそうだ。',
      },
    ],
  },
  {
    pattern: '方がいい',
    meaning: 'had better / should',
    formation: 'Verb た-form + 方がいい (affirmative) / Verb ない-form + 方がいい (negative)',
    jlpt_level: 'N4',
    difficulty: 'intermediate',
    explanation:
      'This pattern gives advice or recommendations — "you had better" or "you should." For positive advice, use た-form + 方がいい. For negative advice ("you had better not"), use ない-form + 方がいい.',
    notes:
      'た-form + 方がいい is a strong recommendation (almost a warning). For softer suggestions, use たらどうですか (how about doing...?) instead.',
    common_mistakes:
      'Using dictionary form for positive advice. Say 薬を飲んだ方がいい (you should take medicine), not ×薬を飲む方がいい. The た-form is standard for affirmative advice.',
    examples: [
      {
        japanese: '早く寝た方がいいですよ。',
        english: 'You should go to bed early.',
        furigana: 'はやくねたほうがいいですよ。',
      },
      {
        japanese: '薬を飲んだ方がいい。',
        english: 'You had better take medicine.',
        furigana: 'くすりをのんだほうがいい。',
      },
      {
        japanese: 'あまり無理しない方がいいですよ。',
        english: 'You shouldn\'t push yourself too hard.',
        furigana: 'あまりむりしないほうがいいですよ。',
      },
      {
        japanese: '一人で行かない方がいい。',
        english: 'You had better not go alone.',
        furigana: 'ひとりでいかないほうがいい。',
      },
    ],
  },

  // ===========================================================================
  // GIVING & RECEIVING (1)
  // ===========================================================================
  {
    pattern: 'てあげる・てくれる・てもらう',
    meaning: 'do for someone / receive a favor',
    formation: 'Verb て-form + あげる / くれる / もらう',
    jlpt_level: 'N4',
    difficulty: 'intermediate',
    explanation:
      'These three patterns express doing favors and receiving help. てあげる means "do something for someone" (speaker/in-group gives). てくれる means "someone does something for me/us" (speaker/in-group receives). てもらう means "have someone do something / receive the favor of someone doing something."',
    notes:
      'The choice depends on perspective: てあげる = giving outward, てくれる = receiving from someone, てもらう = requesting/receiving. てもらう can also express gratitude for help received.',
    common_mistakes:
      'Using てあげる when the speaker receives the action. If someone helps you, use てくれる: 友達が手伝ってくれた (My friend helped me), not ×友達が手伝ってあげた.',
    examples: [
      {
        japanese: '友達に日本語を教えてあげた。',
        english: 'I taught my friend Japanese (as a favor).',
        furigana: 'ともだちににほんごをおしえてあげた。',
      },
      {
        japanese: '母が弁当を作ってくれました。',
        english: 'My mother made a lunch box for me.',
        furigana: 'ははがべんとうをつくってくれました。',
      },
      {
        japanese: '先生に漢字の読み方を教えてもらった。',
        english: 'I had the teacher teach me how to read the kanji.',
        furigana: 'せんせいにかんじのよみかたをおしえてもらった。',
      },
      {
        japanese: '田中さんが駅まで送ってくれた。',
        english: 'Mr. Tanaka gave me a ride to the station.',
        furigana: 'たなかさんがえきまでおくってくれた。',
      },
    ],
  },

  // ===========================================================================
  // ADJECTIVES (1)
  // ===========================================================================
  {
    pattern: 'すぎる',
    meaning: 'too much / excessively',
    formation:
      'Verb stem + すぎる / い-Adj (drop い) + すぎる / な-Adj + すぎる',
    jlpt_level: 'N4',
    difficulty: 'intermediate',
    explanation:
      'すぎる attaches to verb stems and adjective stems to express that something is excessive — "too much" or "overly." The resulting word conjugates as a る-verb: すぎます, すぎた, すぎない.',
    notes:
      'Works with almost any verb or adjective: 食べすぎる (eat too much), 高すぎる (too expensive), 静かすぎる (too quiet). ない + すぎる becomes なさすぎる: 少なすぎる (too few).',
    common_mistakes:
      'Keeping the い when attaching to い-adjectives. Say 高すぎる, not ×高いすぎる. Drop the い first, then add すぎる.',
    examples: [
      {
        japanese: '昨日食べすぎて、お腹が痛い。',
        english: 'I ate too much yesterday, and my stomach hurts.',
        furigana: 'きのうたべすぎて、おなかがいたい。',
      },
      {
        japanese: 'この鞄は重すぎます。',
        english: 'This bag is too heavy.',
        furigana: 'このかばんはおもすぎます。',
      },
      {
        japanese: '昨日は飲みすぎた。',
        english: 'I drank too much yesterday.',
        furigana: 'きのうはのみすぎた。',
      },
      {
        japanese: 'このテストは難しすぎる。',
        english: 'This test is too difficult.',
        furigana: 'このテストはむずかしすぎる。',
      },
    ],
  },
]
